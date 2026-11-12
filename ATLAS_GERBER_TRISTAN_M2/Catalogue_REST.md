# Catalogue REST

Les opérations de la nouvelle API d'ATLAS, en clair. Le contrat exact est dans `Contrat_API.yaml`,
les raisons des choix dans `Decisions_Techniques.md`, les exemples dans `Exemples_JSON/`.

Base : `https://api.atlas.invalid/api/v2`. Le domaine est fictif et ne répond pas.

## 1. Conventions

- **Identité** : chaque requête porte un jeton (`Authorization: Bearer`). Le tenant et le rôle viennent du jeton. Aucune requête ne porte de tenant, et `X-Tenant` n'est jamais lu.
- **Isolement** : on ne voit que son tenant. Un technicien ne voit que ses affectations. Tout le reste répond comme si ça n'existait pas.
- **Format** : JSON, champs en `camelCase`. Les identifiants sont des textes opaques. Les instants sont en UTC, avec les secondes : `2026-10-20T08:00:00Z`.
- **Révision** : chaque intervention a une révision, renvoyée aussi dans l'en-tête `ETag`, entre guillemets. Une écriture sur une intervention existante exige `If-Match` avec la révision lue.
- **Historique** : chaque changement réel écrit un événement, dans la même transaction que le changement. Une requête refusée, ou qui ne change rien, n'écrit rien.

### Erreurs

Une erreur est en `application/problem+json`, toujours avec la même forme : `type`, `title`, `status`,
`code`, `correlationId`, et `errors` pour une saisie refusée. Le serveur contrôle dans cet ordre.

| Statut | `code` | Quand | Ce que fait l'écran |
|---|---|---|---|
| 401 | `unauthenticated` | Jeton absent ou invalide | Redemande la connexion |
| 400 | `bad_request` | Requête illisible | Signale un problème technique |
| 404 | `not_found` | Intervention inexistante, ou hors de ce qu'on peut voir | Affiche que l'intervention est introuvable, sans parler de permission |
| 403 | `forbidden` | Le rôle n'a jamais cette action | Dit que ce compte ne peut pas le faire |
| 428 | `precondition_required` | `If-Match` absent sur une écriture | Relit l'intervention |
| 412 | `precondition_failed` | Révision dépassée | Garde la saisie, propose de relire |
| 409 | `conflict` | L'état actuel interdit l'action | Relit et explique l'état |
| 422 | `validation_failed` | Saisie refusée par une règle | Garde le formulaire, montre le champ en cause |

## 2. L'intervention

| Champ | Type | Peut être `null` | Valeurs | Qui le fixe |
|---|---|---|---|---|
| `id` | texte | non | opaque | le serveur |
| `siteId` | texte | non | un site du tenant | le client, à la création |
| `title` | texte | non | 5 à 120 caractères | le client |
| `priority` | texte | non | `LOW`, `NORMAL`, `HIGH` | le client ; `NORMAL` si absente à la création |
| `status` | texte | non | `NEW`, `ASSIGNED`, `IN_PROGRESS`, `DONE`, `CANCELLED` | le serveur |
| `technicianId` | texte ou `null` | oui | un technicien actif du tenant | le serveur, par l'affectation |
| `createdAt` | instant | non | UTC | le serveur |
| `updatedAt` | instant | non | UTC | le serveur |
| `revision` | entier | non | 1 ou plus | le serveur |

Tous ces champs sont toujours présents dans une réponse. Le tenant n'y est pas : c'est celui du
jeton. Cycle : `NEW` vers `ASSIGNED` par l'affectation, `ASSIGNED` vers `IN_PROGRESS`, `IN_PROGRESS`
vers `DONE`, et `NEW` ou `ASSIGNED` vers `CANCELLED`. Pas de retour arrière. `DONE` et `CANCELLED`
sont terminaux.

## 3. Les droits

| Action | Demandeur | Planificateur | Technicien | Tiers de reporting |
|---|---|---|---|---|
| Lister, lire le détail, lire l'historique | son tenant | son tenant | ses affectations | son tenant |
| Créer | oui | oui | non | non |
| Modifier le titre ou la priorité | si `NEW` | si `NEW` ou `ASSIGNED` | non | non |
| Affecter | non | si `NEW` ou `ASSIGNED` | non | non |
| Annuler | si `NEW` ou `ASSIGNED` | si `NEW` ou `ASSIGNED` | non | non |
| Commencer, terminer | non | non | ses affectations | non |

Une case à non répond 403. Le bon rôle dans le mauvais état répond 409. Hypothèse : pour le demandeur et
le planificateur, lire son tenant comprend l'historique.

## 4. Les opérations

| Opération | Méthode et route | Parcours |
|---|---|---|
| Lister | `GET /interventions` | U4 |
| Créer | `POST /interventions` | U1 |
| Lire le détail | `GET /interventions/{id}` | U1, U3 |
| Modifier | `PATCH /interventions/{id}` | U2 |
| Affecter | `PUT /interventions/{id}/assignment` | U2 |
| Changer d'état | `POST /interventions/{id}/transitions` | U3 |
| Lire l'historique | `GET /interventions/{id}/history` | U4 |

Les six opérations de la mission y sont. Changer d'état est la route de transition que la mission
admet en plus.

### 4.1 Lister — `GET /interventions`

- **Droits** : tous les rôles. Un technicien ne reçoit que ses affectations.
- **Requête** : quatre paramètres facultatifs, combinés par ET.

| Paramètre | Règle |
|---|---|
| `status` | Une des cinq valeurs exactes |
| `siteId` | Un identifiant de site |
| `page` | 1 ou plus. Par défaut 1 |
| `size` | De 1 à 100. Par défaut 20 |

- **Succès** : 200, avec `items`, `page`, `size`, `total` et `hasNext`. Tri fixe : `createdAt` du plus récent au plus ancien, puis `id`. Une liste vide répond 200 avec `items` vide. Une page après la fin aussi. Un site inconnu ou d'un autre tenant donne une liste vide. `total` ne compte que ce que l'appelant peut voir.
- **Erreurs** : 400 pour un paramètre mal formé, 401, 422 pour un statut inconnu ou une taille au-delà de 100.
- **Effet sur l'interface** : afficher les lignes, la position (`page`, `total`) et le bouton suivant selon `hasNext`. Liste vide : un écran vide normal, pas une alerte.
- **Limite** : pendant des écritures, une ligne peut glisser d'une page à l'autre.
- **Exemples** : `liste-reponse-200.json`, `liste-reponse-200-vide.json`, `liste-reponse-422.json`.

### 4.2 Créer — `POST /interventions`

- **Droits** : demandeur, planificateur.
- **Requête** : un corps JSON.

| Champ | Obligatoire | Règle |
|---|---|---|
| `siteId` | oui | Un site du tenant de l'appelant |
| `title` | oui | 5 à 120 caractères une fois les espaces du début et de la fin retirés |
| `priority` | non | `LOW`, `NORMAL` ou `HIGH`. Absente : `NORMAL`. `null` : refusé |
| tout autre champ | — | Refusé |

- **Succès** : 201, avec `Location` (l'adresse du détail) et `ETag: "1"`. Le corps est l'intervention créée : `NEW`, sans technicien, révision 1. Un événement de création est écrit.
- **Erreurs** : 400, 401, 403, 422. Un site inconnu et un site d'un autre tenant reçoivent le même 422.
- **Effet sur l'interface** : 201, aller au détail avec `Location`. 422, garder le formulaire et montrer le champ donné par `errors`. Coupure réseau avant la réponse : ne pas dire que c'est raté, proposer de regarder la liste avant de renvoyer.
- **Exemples** : `creation-requete-valide.json`, `creation-reponse-201.json`, `creation-requete-titre-court.json`, `creation-reponse-422.json`, `creation-reponse-403.json`.

Le schéma ne sait pas retirer les espaces : il ne vérifie que le minimum brut de 5 caractères.
C'est le serveur qui applique la règle complète. Un titre fait d'espaces est donc refusé par le
serveur, pas par le schéma.

### 4.3 Lire le détail — `GET /interventions/{id}`

- **Droits** : demandeur, planificateur et tiers de reporting, pour leur tenant. Technicien, pour ses affectations.
- **Requête** : `id` dans le chemin. Pas de corps.
- **Succès** : 200, avec `ETag`. Le corps est l'intervention.
- **Erreurs** : 401, 404. Une intervention inexistante, d'un autre tenant ou non affectée au technicien reçoit le même 404.
- **Effet sur l'interface** : 200, afficher et garder l'`ETag` pour une écriture future. 404, afficher que l'intervention est introuvable.
- **Exemples** : `detail-reponse-200.json`, `detail-reponse-404.json`, `detail-reponse-401.json`.

### 4.4 Modifier — `PATCH /interventions/{id}`

- **Droits** : demandeur si l'intervention est `NEW`. Planificateur si elle est `NEW` ou `ASSIGNED`.
- **Requête** : `If-Match` obligatoire. Corps en `application/merge-patch+json`.

| Champ | Règle |
|---|---|
| `title` | La règle du titre |
| `priority` | `LOW`, `NORMAL` ou `HIGH` |
| champ absent | Inchangé |
| champ à `null` | Refusé (422) |
| tout autre champ | Refusé (422). Le technicien se change par l'affectation, le statut par un changement d'état |

- **Succès** : 200, avec l'intervention à jour et son nouvel `ETag`. S'il y a un changement réel : une révision de plus et un événement. Sinon, rien n'est écrit.
- **Erreurs** : 400, 401, 403, 404, 409, 412, 422, 428.
- **Effet sur l'interface** : 200, afficher le nouvel état et garder le nouvel `ETag`. 412, garder la saisie et proposer de relire. 422, montrer le champ.
- **Exemples** : `modification-requete-valide.json`, `modification-reponse-200.json`, `modification-requete-null.json`.

### 4.5 Affecter — `PUT /interventions/{id}/assignment`

- **Droits** : planificateur, si l'intervention est `NEW` ou `ASSIGNED`.
- **Requête** : `If-Match` obligatoire. Corps : `technicianId`, un technicien actif du tenant.
- **Succès** : 200. L'intervention est `ASSIGNED`, avec son technicien. Une révision de plus, et un seul événement pour le technicien et le statut. Répéter la même affectation répond 200 sans rien écrire.
- **Erreurs** : 400, 401, 403, 404, 412, 428. 409 si le travail est commencé ou fini. 422 si le technicien est inconnu, d'un autre tenant ou inactif. Inconnu et autre tenant reçoivent la même réponse.
- **Effet sur l'interface** : 200, afficher le technicien et le statut. 412, garder le choix du planificateur, proposer de relire, ne pas renvoyer tout seul. 422, dire que ce technicien ne peut pas être choisi.
- **Exemples** : `affectation-requete-valide.json`, `affectation-reponse-200.json`, `affectation-requete-autre-tenant.json`, `affectation-reponse-422.json`, `affectation-reponse-412.json`.

### 4.6 Changer d'état — `POST /interventions/{id}/transitions`

- **Droits** : technicien affecté, pour commencer puis terminer. Demandeur et planificateur, pour annuler.
- **Requête** : `If-Match` obligatoire. Corps : `to`, qui vaut `IN_PROGRESS`, `DONE` ou `CANCELLED`.
- **Succès** : 200, avec l'intervention à jour. Une révision de plus et un événement.
- **Erreurs** : 400, 401, 404, 412, 428. 403 si le rôle n'a jamais cette transition, par exemple un planificateur qui veut commencer. 409 si la transition sort du cycle, par exemple repartir d'une intervention terminée. 422 pour une autre valeur de `to`.
- **Effet sur l'interface** : 200, afficher le nouvel état. 409, relire et expliquer l'état. Hors connexion : ne pas montrer l'action comme faite.
- **Exemples** : `transition-requete-valide.json`, `transition-reponse-200.json`, `transition-reponse-409.json`.

### 4.7 Lire l'historique — `GET /interventions/{id}/history`

- **Droits** : les mêmes que pour le détail.
- **Requête** : `page` et `size`, comme pour la liste.
- **Succès** : 200, avec `items`, `page`, `size`, `total` et `hasNext`. Un événement par changement réel, du plus ancien au plus récent.

| Champ d'un événement | Contenu |
|---|---|
| `revision` | La révision après ce changement |
| `type` | `CREATED`, `UPDATED`, `ASSIGNED`, `STARTED`, `COMPLETED` ou `CANCELLED` |
| `actorId` | L'utilisateur qui a fait le changement |
| `at` | L'instant, en UTC |
| `technicianId` | Le technicien choisi, pour `ASSIGNED` seulement |

- **Erreurs** : 400, 401, 404, 422.
- **Effet sur l'interface** : afficher la chronologie. Un événement ne contient ni titre ni texte libre.
- **Exemples** : `historique-reponse-200.json`, `historique-reponse-404.json`.

## 5. États d'écran par parcours

Le serveur décide, l'écran affiche.

| État | U1 créer et retrouver | U2 planifier | U3 Terrain | U4 file et historique |
|---|---|---|---|---|
| Chargement | Pendant l'envoi, bouton bloqué | Pendant l'écriture | Pendant l'action | Pendant la lecture d'une page |
| Vide | Sans objet | Sans objet | Aucune affectation : liste vide | Liste vide (200) |
| Succès | 201, aller au détail | 200, nouvel état et nouvel `ETag` | 200, état à jour | 200, lignes, position, page suivante |
| Saisie refusée | 422, champ montré, formulaire gardé | 422, champ ou technicien refusé | Sans objet : pas de saisie libre | 422, filtre ou taille refusés |
| Session invalide | 401, reconnexion | 401, reconnexion | 401, reconnexion | 401, reconnexion |
| Permission insuffisante | 403, ce compte ne crée pas | 403, rôle sans cette action | 404 pour une intervention non affectée | 404 pour un historique hors périmètre |
| Conflit | Sans objet : c'est une création | 412, relire. 409, état interdit | 412 ou 409, relire | Sans objet : c'est une lecture |

## 6. Correspondance avec la v1

| Route v1 | Nouvelle route | Sort de la route v1 |
|---|---|---|
| `GET /api/interventions` | `GET /interventions` | Gardée pour le Portail 1.8 et l'export BI |
| `GET /api/intervention/{id}` | `GET /interventions/{id}` | Gardée pour le Portail 1.8 |
| `POST /api/interventions` | `POST /interventions` | Gardée pour le Portail 1.8 |
| `GET /api/interventions/{id}/history` | `GET /interventions/{id}/history` | Gardée pour l'export BI |
| `PUT /api/intervention/{id}` | `PATCH /interventions/{id}` | Fermée quand Console Ops et Terrain ont migré |
| `GET /api/assign` | `PUT /interventions/{id}/assignment` | Fermée quand Console Ops a migré |

Les routes gardées passent par l'adaptateur et servent le même format qu'aujourd'hui, jusqu'à la
fin de la transition. Deux choses changent en v1, et elles sont annoncées : on ne lit plus un autre
tenant, et une intervention d'un autre tenant répond comme une intervention inexistante.

| Statut v2 | Filtre v1 `state` | Statut montré en v1 | Ce que la v1 perd |
|---|---|---|---|
| `NEW` | `open` | `NEW` | Rien |
| `ASSIGNED` | `open` | `ASSIGNED` | Rien |
| `IN_PROGRESS` | `open` | `ASSIGNED` | On ne voit pas que le travail a commencé |
| `DONE` | `closed` | `DONE` | Rien |
| `CANCELLED` | `closed` | `DONE` | L'annulation est confondue avec la fin du travail |

L'information complète reste dans le champ `status` de la v2. Hypothèse : la v1 sert aujourd'hui les
statuts vus dans les captures du kit (`NEW`, `ASSIGNED`, `DONE`). Aucune pièce ne montre ce que
reçoivent vraiment le Portail 1.8 et l'export BI.
