# Scénarios

Douze scénarios, un par thème de la mission. Ce sont des contrôles statiques : aucun serveur
n'existe, personne n'a envoyé ces requêtes. La preuve est que chaque exemple suit le contrat, ce que
montre la sortie `sorties/controle_contrat.txt`.

Les identités viennent du kit (`json/identites.json`). Les jetons `DEMO-…` sont des marqueurs sans
pouvoir. Les fichiers d'exemple sont dans `Exemples_JSON/`.

| N° | Thème | État |
|---|---|---|
| SC-01 | Chemin nominal | écrit |
| SC-02 | Liste vide | à venir |
| SC-03 | Filtre combiné | à venir |
| SC-04 | Borne de pagination | à venir |
| SC-05 | Saisie invalide | écrit |
| SC-06 | Champ absent ou null | à venir |
| SC-07 | Session invalide | écrit |
| SC-08 | Accès hors tenant | écrit |
| SC-09 | Permission insuffisante | écrit |
| SC-10 | Transition interdite | à venir |
| SC-11 | Concurrence | à venir |
| SC-12 | Continuité v1 | à venir |

## SC-01 — Chemin nominal : Lina crée une demande et la retrouve

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : le site S01 appartient à C01.
- **Requête** : `POST /api/v2/interventions`, avec `Authorization: Bearer DEMO-U01-C01` et `Content-Type: application/json`. Corps : `creation-requete-valide.json`.
- **Réponse attendue** : 201, `Location: /api/v2/interventions/I105`, `ETag: "1"`. Corps : `creation-reponse-201.json`. Puis `GET /api/v2/interventions/I105` répond 200 avec le même contenu.
- **Effet** : une intervention de plus dans C01, en NEW, révision 1, priorité NORMAL. Un événement de création.
- **Écran** : va au détail de I105, avec le titre et le site saisis.
- **Lien** : opérations créer et lire. Règles R01 à R03. Parcours U1. Décisions 1 et 2. Constat 10.
- **Preuve et limite** : la requête et la réponse suivent le contrat. Rien ne prouve qu'un serveur répondrait ainsi.

## SC-05 — Saisie invalide : un titre trop court

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : rien de particulier.
- **Requête** : `POST /api/v2/interventions`, jeton de Lina. Corps : `creation-requete-titre-court.json`.
- **Réponse attendue** : 422, `Content-Type: application/problem+json`. Corps : `creation-reponse-422.json`, avec le code `validation_failed` et le champ `title` dans `errors`.
- **Effet** : aucun. Pas d'intervention, pas d'événement.
- **Écran** : garde les valeurs du formulaire et met le message sous le champ titre.
- **Lien** : opération créer. Règle R02. Parcours U1. Décision 2. Constat 5.
- **Preuve et limite** : le contrôle montre que la requête est refusée par une seule règle, la longueur minimale du titre. Un titre fait d'espaces, lui, passe le schéma : seul le serveur le refuse.

## SC-07 — Session invalide : lire un détail sans jeton

- **Qui** : personne. La requête n'a pas de jeton.
- **Avant** : I102 existe dans C01.
- **Requête** : `GET /api/v2/interventions/I102`, sans en-tête `Authorization`.
- **Réponse attendue** : 401, `Content-Type: application/problem+json`. Corps : `detail-reponse-401.json`, avec le code `unauthenticated`.
- **Effet** : aucun.
- **Écran** : redemande la connexion. Il n'affiche rien de l'intervention.
- **Lien** : opération lire. Règle R07. Décisions 1 et 2. Constat 13.
- **Preuve et limite** : l'exemple suit le contrat. Le comportement actuel sans jeton n'est pas connu : aucune capture du kit ne le montre.

## SC-08 — Accès hors tenant : Lina demande I200

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : I200 existe, dans le tenant C02.
- **Requête** : `GET /api/v2/interventions/I200`, jeton de Lina. Ajouter `X-Tenant: C02` ne change rien.
- **Réponse attendue** : 404, `Content-Type: application/problem+json`. Corps : `detail-reponse-404.json`. C'est la même réponse que pour I999, qui n'existe pas.
- **Effet** : aucun.
- **Écran** : affiche que l'intervention est introuvable. Il ne parle pas de permission.
- **Lien** : opération lire. Règle R07. Parcours U3. Décisions 1 et 2. Constat 1.
- **Preuve et limite** : l'exemple suit le contrat. Avant, la capture `http/isolement.http` du kit répondait 200 avec le contenu de I200.

## SC-09 — Permission insuffisante : le compte de reporting tente de créer

- **Qui** : bi-c01 (BI01), tiers de reporting du tenant C01.
- **Avant** : le site S01 appartient à C01.
- **Requête** : `POST /api/v2/interventions`, avec le jeton de bi-c01. Corps : `creation-requete-valide.json`.
- **Réponse attendue** : 403, `Content-Type: application/problem+json`. Corps : `creation-reponse-403.json`, avec le code `forbidden`.
- **Effet** : aucun. Pas d'intervention, pas d'événement.
- **Écran** : dit que ce compte ne peut pas créer.
- **Lien** : opération créer. Règle R06. Décision 2. Constat 2.
- **Preuve et limite** : l'exemple suit le contrat. Le kit ne montre aucun contrôle de rôle aujourd'hui.
