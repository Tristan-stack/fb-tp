# Catalogue REST

Les opérations de la nouvelle API d'ATLAS, en clair. Le contrat exact est dans `Contrat_API.yaml`,
les raisons des choix dans `Decisions_Techniques.md`, les exemples dans `Exemples_JSON/`.

Base : `https://api.atlas.invalid/api/v2`. Le domaine est fictif et ne répond pas.

## 1. Conventions

- **Identité** : chaque requête porte un jeton (`Authorization: Bearer`). Le tenant et le rôle viennent du jeton. Aucune requête ne porte de tenant, et `X-Tenant` n'est jamais lu.
- **Isolement** : on ne voit que son tenant. Un technicien ne voit que ses affectations. Tout le reste répond comme si ça n'existait pas.
- **Format** : JSON, champs en `camelCase`. Les identifiants sont des textes opaques. Les instants sont en UTC, avec les secondes : `2026-10-20T08:00:00Z`.
- **Révision** : chaque intervention a une révision, renvoyée aussi dans l'en-tête `ETag`, entre guillemets.

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
jeton. `DONE` et `CANCELLED` sont des états terminaux.

## 3. Les opérations

| Opération | Méthode et route | État |
|---|---|---|
| Créer | `POST /interventions` | décrite ci-dessous |
| Lire le détail | `GET /interventions/{id}` | décrite ci-dessous |
| Lister | `GET /interventions` | à venir |
| Modifier | `PATCH /interventions/{id}` | à venir |
| Affecter | `PUT /interventions/{id}/assignment` | à venir |
| Lire l'historique | `GET /interventions/{id}/history` | à venir |
| Changer d'état | `POST /interventions/{id}/transitions` | à venir |

### 3.1 Créer — `POST /interventions`

- **Parcours** : U1.
- **Droits** : demandeur, planificateur. Technicien et tiers de reporting : 403.
- **Requête** : un corps JSON.

| Champ | Obligatoire | Règle |
|---|---|---|
| `siteId` | oui | Un site du tenant de l'appelant |
| `title` | oui | 5 à 120 caractères une fois les espaces du début et de la fin retirés |
| `priority` | non | `LOW`, `NORMAL` ou `HIGH`. Absente : `NORMAL`. `null` : refusé |
| tout autre champ | — | Refusé |

- **Succès** : 201, avec `Location` (l'adresse du détail) et `ETag: "1"`. Le corps est l'intervention créée : `NEW`, sans technicien, révision 1. Un événement de création est écrit dans l'historique.
- **Erreurs** : 400, 401, 403, 422. Un site inconnu et un site d'un autre tenant reçoivent le même 422.
- **Effet sur l'interface** : 201, aller au détail avec `Location`. 422, garder le formulaire et montrer le champ donné par `errors`. 401, redemander la connexion. Coupure réseau avant la réponse : ne pas dire que c'est raté, proposer de regarder la liste avant de renvoyer.
- **Exemples** : `creation-requete-valide.json`, `creation-reponse-201.json`, `creation-requete-titre-court.json`, `creation-reponse-422.json`, `creation-reponse-403.json`.

Le schéma ne sait pas retirer les espaces : il ne vérifie que le minimum brut de 5 caractères.
C'est le serveur qui applique la règle complète. Un titre fait d'espaces est donc refusé par le
serveur, pas par le schéma.

### 3.2 Lire le détail — `GET /interventions/{id}`

- **Parcours** : U1, U3.
- **Droits** : demandeur, planificateur et tiers de reporting, pour toute intervention de leur tenant. Technicien, seulement pour celles qui lui sont affectées.
- **Requête** : `id` dans le chemin. Pas de corps.
- **Succès** : 200, avec `ETag`. Le corps est l'intervention.
- **Erreurs** : 401, 404. Une intervention inexistante, d'un autre tenant ou non affectée au technicien reçoit le même 404.
- **Effet sur l'interface** : 200, afficher et garder l'`ETag` pour une écriture future. 404, afficher que l'intervention est introuvable. 401, redemander la connexion.
- **Exemples** : `detail-reponse-200.json`, `detail-reponse-404.json`, `detail-reponse-401.json`.
