# Scénarios

Douze scénarios, un par thème de la mission. Ce sont des contrôles statiques : aucun serveur
n'existe, personne n'a envoyé ces requêtes. La preuve est que chaque exemple suit le contrat, ce que
montre la sortie `sorties/controle_contrat.txt`.

Les identités viennent du kit (`json/identites.json`). Les jetons `DEMO-…` sont des marqueurs sans
pouvoir. Les fichiers d'exemple sont dans `Exemples_JSON/`.

| N° | Thème | Opération |
|---|---|---|
| SC-01 | Chemin nominal | Créer, lire le détail |
| SC-02 | Liste vide | Lister |
| SC-03 | Filtre combiné | Lister |
| SC-04 | Borne de pagination | Lister |
| SC-05 | Saisie invalide | Créer |
| SC-06 | Champ absent ou null | Modifier |
| SC-07 | Session invalide | Lire le détail |
| SC-08 | Accès hors tenant | Lire le détail |
| SC-09 | Permission insuffisante | Créer |
| SC-10 | Transition interdite | Changer d'état |
| SC-11 | Concurrence | Modifier, affecter |
| SC-12 | Continuité v1 | Route v1 du détail |

L'historique n'a pas de scénario à lui : son exemple est `historique-reponse-200.json`.

## SC-01 — Chemin nominal : Lina crée une demande et la retrouve

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : le site S01 appartient à C01.
- **Requête** : `POST /api/v2/interventions`, avec `Authorization: Bearer DEMO-U01-C01` et `Content-Type: application/json`. Corps : `creation-requete-valide.json`.
- **Réponse attendue** : 201, `Location: /api/v2/interventions/I105`, `ETag: "1"`. Corps : `creation-reponse-201.json`. Puis `GET /api/v2/interventions/I105` répond 200 avec le même contenu.
- **Effet** : une intervention de plus dans C01, en NEW, révision 1, priorité NORMAL. Un événement de création.
- **Écran** : va au détail de I105, avec le titre et le site saisis.
- **Lien** : règles R01 à R03. Parcours U1. Décisions 1 et 2. Constat 10.
- **Preuve et limite** : la requête et la réponse suivent le contrat. Rien ne prouve qu'un serveur répondrait ainsi.

## SC-02 — Liste vide : un site sans demande

- **Qui** : Nora (U02), planificatrice du tenant C01.
- **Avant** : le site S03 appartient à C01 et n'a aucune intervention.
- **Requête** : `GET /api/v2/interventions?siteId=S03`, jeton de Nora.
- **Réponse attendue** : 200, `Content-Type: application/json`. Corps : `liste-reponse-200-vide.json`, avec `items` vide, `total` à 0 et `hasNext` à faux.
- **Effet** : aucun.
- **Écran** : affiche une file vide normale. Pas d'alerte.
- **Lien** : règle R08. Parcours U4. Décision 5. Constat 11.
- **Preuve et limite** : l'exemple suit le contrat. Avant, la capture `http/vide.http` du kit répondait 404.

## SC-03 — Filtre combiné : le statut NEW et le site S01

- **Qui** : Nora (U02), planificatrice du tenant C01.
- **Avant** : C01 a quatre interventions : I100 (S01, NEW), I101 (S01, ASSIGNED), I102 (S02, NEW) et I103 (S01, DONE). I200 est à C02.
- **Requête** : `GET /api/v2/interventions?status=NEW&siteId=S01`, jeton de Nora.
- **Réponse attendue** : 200. Corps : `liste-reponse-200.json`, avec une seule ligne, I100, et `total` à 1.
- **Effet** : aucun.
- **Écran** : affiche I100, page 1, sans page suivante.
- **Lien** : règle R08. Parcours U4. Décision 5. Constat 11.
- **Preuve et limite** : l'exemple suit le contrat. Une seule ligne ne prouve pas que le filtre est bon : il faut regarder ce qui est écarté. I102 est NEW mais sur S02. I101 et I103 sont sur S01 mais pas NEW. I200 est d'un autre tenant. Sans filtre de site, `status=NEW` rendrait I100 puis I102 : elles ont la même date de création, et c'est `id` qui les départage.

## SC-04 — Borne de pagination : une taille trop grande

- **Qui** : Nora (U02), planificatrice du tenant C01.
- **Avant** : rien de particulier.
- **Requête** : `GET /api/v2/interventions?size=1000`, jeton de Nora.
- **Réponse attendue** : 422, `Content-Type: application/problem+json`. Corps : `liste-reponse-422.json`, avec le code `validation_failed` et le champ `size`.
- **Effet** : aucun.
- **Écran** : garde la taille précédente et signale la limite de 100.
- **Lien** : règle R08, exigence N04. Parcours U4. Décision 5. Constat 11.
- **Preuve et limite** : l'exemple suit le contrat. Autre borne : une page après la dernière répond 200 avec `items` vide. Le temps de réponse n'est pas mesuré.

## SC-05 — Saisie invalide : un titre trop court

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : rien de particulier.
- **Requête** : `POST /api/v2/interventions`, jeton de Lina. Corps : `creation-requete-titre-court.json`.
- **Réponse attendue** : 422, `Content-Type: application/problem+json`. Corps : `creation-reponse-422.json`, avec le code `validation_failed` et le champ `title` dans `errors`.
- **Effet** : aucun. Pas d'intervention, pas d'événement.
- **Écran** : garde les valeurs du formulaire et met le message sous le champ titre.
- **Lien** : règle R02. Parcours U1. Décision 2. Constat 5.
- **Preuve et limite** : le contrôle montre que la requête est refusée par une seule règle, la longueur minimale du titre. Un titre fait d'espaces, lui, passe le schéma : seul le serveur le refuse.

## SC-06 — Champ absent ou null : corriger le titre sans perdre le technicien

- **Qui** : Nora (U02), planificatrice du tenant C01.
- **Avant** : I101 est ASSIGNED, affectée au technicien T01, révision 2. Sa priorité et sa date de création sont celles des hypothèses H1 et H2 de l'annexe A : NORMAL et 2026-10-20T08:00:00Z.
- **Requête** : `PATCH /api/v2/interventions/I101`, jeton de Nora, `If-Match: "2"`, `Content-Type: application/merge-patch+json`. Corps : `modification-requete-valide.json`, qui ne contient que le titre.
- **Réponse attendue** : 200, `ETag: "3"`. Corps : `modification-reponse-200.json`. Le titre a changé, le technicien T01 et la priorité sont restés.
- **Effet** : I101 passe en révision 3. Un événement UPDATED. Variante : le même appel avec `modification-requete-null.json` répond 422, et rien ne change.
- **Écran** : affiche le nouveau titre et garde le nouvel `ETag`.
- **Lien** : règles R09 et R11. Parcours U2. Décision 6. Constat 7.
- **Preuve et limite** : les exemples suivent le contrat, et le contrôle montre que le corps avec `null` est refusé par une seule règle. Avant, la capture `http/modification.http` du kit effaçait le technicien.

## SC-07 — Session invalide : lire un détail sans jeton

- **Qui** : personne. La requête n'a pas de jeton.
- **Avant** : I102 existe dans C01.
- **Requête** : `GET /api/v2/interventions/I102`, sans en-tête `Authorization`.
- **Réponse attendue** : 401, `Content-Type: application/problem+json`. Corps : `detail-reponse-401.json`, avec le code `unauthenticated`.
- **Effet** : aucun.
- **Écran** : redemande la connexion. Il n'affiche rien de l'intervention.
- **Lien** : règle R07. Décisions 1 et 2. Constat 13.
- **Preuve et limite** : l'exemple suit le contrat. Le comportement actuel sans jeton n'est pas connu : aucune capture du kit ne le montre.

## SC-08 — Accès hors tenant : Lina demande I200

- **Qui** : Lina (U01), demandeuse du tenant C01.
- **Avant** : I200 existe, dans le tenant C02.
- **Requête** : `GET /api/v2/interventions/I200`, jeton de Lina. Ajouter `X-Tenant: C02` ne change rien.
- **Réponse attendue** : 404, `Content-Type: application/problem+json`. Corps : `detail-reponse-404.json`. C'est la même réponse que pour I999, qui n'existe pas.
- **Effet** : aucun.
- **Écran** : affiche que l'intervention est introuvable. Il ne parle pas de permission.
- **Lien** : règle R07. Parcours U3. Décisions 1 et 2. Constat 1.
- **Preuve et limite** : l'exemple suit le contrat. Avant, la capture `http/isolement.http` du kit répondait 200 avec le contenu de I200.

## SC-09 — Permission insuffisante : le compte de reporting tente de créer

- **Qui** : bi-c01 (BI01), tiers de reporting du tenant C01.
- **Avant** : le site S01 appartient à C01.
- **Requête** : `POST /api/v2/interventions`, avec le jeton de bi-c01. Corps : `creation-requete-valide.json`.
- **Réponse attendue** : 403, `Content-Type: application/problem+json`. Corps : `creation-reponse-403.json`, avec le code `forbidden`.
- **Effet** : aucun. Pas d'intervention, pas d'événement.
- **Écran** : dit que ce compte ne peut pas créer.
- **Lien** : règle R06. Décision 2. Constat 2.
- **Preuve et limite** : l'exemple suit le contrat. Le kit ne montre aucun contrôle de rôle aujourd'hui.

## SC-10 — Transition interdite : repartir d'une intervention terminée

- **Qui** : Samir (U03), technicien T01 du tenant C01.
- **Avant** : I103 est DONE, affectée au technicien T01, révision 3.
- **Requête** : `POST /api/v2/interventions/I103/transitions`, jeton de Samir, `If-Match: "3"`. Corps : `transition-requete-valide.json`, où `to` vaut IN_PROGRESS.
- **Réponse attendue** : 409, `Content-Type: application/problem+json`. Corps : `transition-reponse-409.json`, avec le code `conflict`.
- **Effet** : aucun. I103 reste DONE, en révision 3, sans nouvel événement.
- **Écran** : relit I103 et explique qu'elle est terminée.
- **Lien** : règle R04. Parcours U3. Décisions 2 et 6. Constat 5.
- **Preuve et limite** : l'exemple suit le contrat. Le corps est valide : c'est l'état qui refuse, ce qu'aucun schéma ne peut vérifier.

## SC-11 — Concurrence : une affectation sur une ancienne révision

- **Qui** : Lina (U01), demandeuse, puis Nora (U02), planificatrice. Toutes deux du tenant C01.
- **Avant** : I100 est NEW, révision 2. Les deux écrans l'ont lue à cette révision.
- **Requête** : d'abord Lina passe la priorité à HIGH : `PATCH /api/v2/interventions/I100`, `If-Match: "2"`. Elle reçoit 200 et `ETag: "3"`. Puis Nora affecte le technicien T01 depuis son ancien écran : `PUT /api/v2/interventions/I100/assignment`, `If-Match: "2"`, corps `affectation-requete-valide.json`.
- **Réponse attendue** : pour Nora, 412, `Content-Type: application/problem+json`. Corps : `affectation-reponse-412.json`, avec le code `precondition_failed`.
- **Effet** : l'affectation n'est pas écrite. I100 reste NEW, en révision 3, avec la priorité HIGH. Un seul événement de plus, celui de Lina.
- **Écran** : celui de Nora garde son choix du technicien T01, montre que l'intervention a changé et propose de relire. Il ne renvoie pas tout seul. Après relecture, le même appel avec `If-Match: "3"` passe.
- **Lien** : règle R10. Parcours U2. Décision 3. Constat 8.
- **Preuve et limite** : l'exemple suit le contrat. Avant, la capture `http/concurrence.http` du kit écrasait la première modification. Aucune simulation de deux clients n'a été faite.

## SC-12 — Continuité v1 : le Portail 1.8 lit toujours un détail

- **Qui** : Lina (U01), demandeuse du tenant C01, depuis le Portail 1.8.
- **Avant** : I102 existe dans C01. I200 existe dans C02.
- **Requête** : `GET /api/intervention/I102`, l'ancienne route, jeton de Lina.
- **Réponse attendue** : 200, avec les mêmes champs qu'aujourd'hui. Corps : `v1-detail-reponse-200.json`. Variante de sécurité : `GET /api/intervention/I200` répond comme pour une intervention inexistante en v1, soit 200 et `{"success":false,"error":"not_found"}`, la réponse de la capture `http/detail.http` du kit.
- **Effet** : aucun.
- **Écran** : le Portail affiche I102 comme avant. Pour I200, il affiche son message habituel d'intervention introuvable.
- **Lien** : exigence N01. Décision 4. Constats 1 et 12.
- **Preuve et limite** : le fichier est un JSON lisible, hors du contrat v2, donc sans schéma. Sa forme reprend la capture `json/detail-reponse.json` du kit. C'est une hypothèse : aucune pièce ne montre ce que le Portail reçoit vraiment derrière l'adaptateur.
