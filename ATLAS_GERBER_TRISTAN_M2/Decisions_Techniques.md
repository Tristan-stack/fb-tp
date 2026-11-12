# Décisions techniques

Six décisions pour la nouvelle API d'ATLAS. Les constats cités sont ceux de l'annexe A du rapport
(`Sources_PDF/Annexe_A_Matrice_Audit.md`). Les règles R01 à R12 et N01 à N05 viennent de la fiche
produit P03. Les pièces P01 à P09 et les fichiers cités sont ceux du kit.

| N° | Décision | Choix |
|---|---|---|
| 1 | Frontière de confiance | Le tenant et le rôle viennent du jeton validé, de rien d'autre |
| 2 | Conventions REST et erreurs | Le statut HTTP dit le résultat, une seule forme d'erreur |
| 3 | Concurrence | Un ETag égal à la révision, `If-Match` obligatoire sur chaque écriture |
| 4 | Compatibilité v1 | Nouveau contrat sous `/api/v2`, v1 gardée derrière l'adaptateur |
| 5 | Pagination et filtres | Pages numérotées, tri fixe, filtres faits par le serveur |
| 6 | Modification, affectation et transitions | Trois opérations séparées |

## Décision 1 — Frontière de confiance

- **Contexte** : aujourd'hui le serveur croit ce qu'on lui envoie. Lina lit une demande de C02, et le tenant d'une création vient de l'en-tête `X-Tenant` (constats 1, 2 et 4).
- **Options** : A. Tout prendre dans le jeton validé, sans jamais lire `X-Tenant`. B. Lire `X-Tenant` et refuser s'il contredit le jeton. C. Garder `X-Tenant` comme autorité, comme le demande une note dans le code (`code/back.mjs` l.2).
- **Choix** : A. Le tenant et le rôle viennent du jeton (`Authorization: Bearer`). Le contrat n'a aucun champ ni paramètre de tenant. À chaque requête, le serveur vérifie que la demande, le site et le technicien sont au tenant de l'appelant.
- **Justification** : seul le résultat validé de l'authentification porte le tenant et le rôle (P09 l.19–21). C'est aussi R03, R07 et R12 (P03 l.14, l.18, l.23). C est exclu : c'est la cause de la brèche. B n'ajoute aucune sécurité.
- **Conséquences** : bénéfice, un client ne sort plus de son tenant, même avec une requête forgée. Coût, un contrôle de périmètre dans chaque opération. Touchés : tous, sans changement visible pour un usage normal.
- **Risques** : un contrôle oublié sur une future route. Les données déjà lues par un autre client restent à traiter (constat 1).
- **Réexamen** : si un utilisateur doit un jour appartenir à plusieurs tenants. Aujourd'hui il n'en a qu'un (P02 l.13–14).
- **Preuve** : avant, `http/isolement.http`. Après, les scénarios *accès hors tenant* et *session invalide*.

## Décision 2 — Conventions REST et erreurs

- **Contexte** : un échec répond 200, une liste vide répond 404, une erreur est tantôt du texte, tantôt du JSON (constat 13). Les écrans ne peuvent pas réagir.
- **Options** : A. Le statut HTTP dit le résultat, avec une forme d'erreur standard (`application/problem+json`, RFC 9457). B. Pareil, avec un format d'erreur maison. C. Garder 200 partout, avec `success` à faux.
- **Choix** : A, avec la table ci-dessous. Une erreur contient `type`, `title`, `status` et `detail`, plus un `code` stable, un `correlationId` et, pour une saisie refusée, la liste `errors` qui nomme le champ en cause.

| Ordre | Situation | Statut |
|---|---|---|
| 1 | Jeton absent ou invalide | 401 |
| 2 | Requête illisible : JSON cassé, paramètre mal formé | 400 |
| 3 | Demande inexistante, ou hors de ce que l'appelant peut voir | 404 |
| 4 | Le rôle n'a jamais cette action | 403 |
| 5 | `If-Match` absent sur une écriture | 428 |
| 6 | Révision dépassée | 412 |
| 7 | Le rôle a l'action, mais l'état actuel l'interdit | 409 |
| 8 | Saisie refusée par une règle | 422 |

Le serveur contrôle dans cet ordre et s'arrête au premier refus. Un succès répond 200, ou 201 avec `Location` pour une création. Une liste vide est un succès.

Conventions communes : identifiants en texte opaque, instants en UTC avec les secondes (`2026-10-20T08:00:00Z`), champs en `camelCase`. Une lecture ne modifie jamais rien.

- **Justification** : R07 demande de distinguer identité invalide, droit insuffisant et ressource étrangère (P03 l.18). Le 404 commun ne révèle pas qu'une demande existe ailleurs (RFC 9110, section 15.5.5). Le Front prépare ses écrans avec les seules réponses du contrat (P03 l.33–35). C est exclu : les outils HTTP ne verraient que des succès (P04 l.61–63).
- **Conséquences** : bénéfice, un écran par situation et un identifiant de corrélation pour le support. Coût, huit cas à tester par opération. Touchés : Console Ops et Terrain, qui changent leur lecture des erreurs. Le Portail 1.8 et l'export gardent la forme v1.
- **Risques** : un écran qui affiche le même message pour tout, sans lire le `code`. Le 404 commun ne dit pas pourquoi la demande est invisible : c'est voulu.
- **Réexamen** : si un consommateur ne sait pas lire `problem+json`, ou si une situation ne rentre dans aucune ligne de la table.
- **Preuve** : avant, `http/detail.http` et `http/vide.http`. Après, un exemple par ligne de la table dans `Exemples_JSON/`.

## Décision 3 — Concurrence

- **Contexte** : deux écrans lisent la même révision, et le second écrase le premier sans alerte (constat 8).
- **Options** : A. ETag et `If-Match`, les préconditions de HTTP. B. La révision lue, envoyée dans le corps de la requête. C. Le dernier qui écrit gagne.
- **Choix** : A. Chaque demande a une révision, qui augmente de 1 à chaque changement réel. Le détail, la création et chaque écriture renvoient un ETag fort égal à la révision, par exemple `"3"`. La révision est aussi dans le corps et dans chaque ligne de liste. Modifier, affecter et changer d'état exigent `If-Match`. S'il manque : 428. S'il est dépassé : 412, et rien n'est écrit. L'écran garde la saisie et propose de relire. Il ne renvoie pas tout seul.
- **Justification** : R10 (P03 l.21) et le parcours U2 (P04 l.18–22). `If-Match` sert à éviter les écrasements et impose la comparaison forte (RFC 9110, section 13.1.1). Le 428 existe pour ce cas (RFC 6585, section 3). C est exclu par R10. B marche aussi, mais mélange les données et le contrôle.
- **Conséquences** : bénéfice, plus de modification perdue en silence, même entre une modification et une affectation. Coût, chaque écran garde l'ETag qu'il a lu. Touchés : Console Ops et Terrain. Les deux routes d'écriture v1 n'envoient pas `If-Match` : elles restent exposées jusqu'à leur fermeture (décision 4).
- **Risques** : un écran qui relit puis renvoie sans montrer le changement à l'utilisateur. Les révisions actuelles ne sont peut-être pas fiables (hypothèse H6 de l'annexe A) : elles sont à reprendre à la migration.
- **Réexamen** : si la période d'observation montre des conflits fréquents sur une même demande (P09 l.36–37).
- **Preuve** : avant, `http/concurrence.http`. Après, le scénario *concurrence* : deux écritures sur la révision 2, la seconde reçoit 412.

## Décision 4 — Compatibilité v1

- **Contexte** : douze tenants utilisent encore le Portail 1.8, et l'export BI lit la v1 chaque nuit (P02 l.43–46). On ne peut pas les arrêter (P01 l.33). Mais la v1 a des brèches.
- **Options** : A. Un nouveau contrat sous `/api/v2`, et la v1 gardée derrière l'adaptateur. B. Les mêmes routes, avec une version choisie par un en-tête. C. Tout remplacer d'un coup.
- **Choix** : A. Les routes v1 du Portail 1.8 (liste, détail, création) et de l'export BI (liste, historique) gardent leurs formats jusqu'à la fin de la transition : le 31 janvier 2027, date proposée, à confirmer par ATLAS. L'adaptateur traduit entre v1 et v2 et ne décide d'aucun droit. Les corrections de sécurité s'appliquent aussi en v1 et sont annoncées. Les deux routes d'écriture dangereuses, `PUT /api/intervention/{id}` et `GET /api/assign`, ferment quand Console Ops et Terrain ont migré. Ordre : Console Ops, Terrain, puis le Portail et l'export.
- **Justification** : N01 (P03 l.27–31). Le maintien porte sur les formats de ces deux consommateurs, et sur aucune lecture d'un autre tenant (P09 l.7–14). C est exclu : aucun arrêt global n'est accepté. B est fragile : les clients v1 n'envoient pas d'en-tête de version.
- **Conséquences** : bénéfice, personne n'est coupé et la sécurité n'attend pas la migration. Coût, deux contrats à tester pendant la transition. Touchés : tous. Un ancien usage non autorisé peut cesser de marcher (P09 l.38–39).
- **Risques** : on ne sait pas exactement ce que l'adaptateur sert aujourd'hui au Portail et à l'export, aucune capture ne le montre. Et l'oubli de fermer la v1 après la transition.
- **Réexamen** : à la fin de la transition, ou avant si le trafic v1 tombe à zéro. Le retour arrière se fait consommateur par consommateur, sans jamais rouvrir l'accès direct à la base ni la lecture entre tenants (P09 l.37–38).
- **Preuve** : avant, `http/liste.http` et `http/creation.http`. Après, le scénario *continuité v1* et la table de correspondance de `Catalogue_REST.md`.

## Décision 5 — Pagination et filtres

- **Contexte** : la liste a changé de forme sans prévenir, le filtre par site est fait dans le navigateur, une liste vide répond 404 et l'ordre n'est pas défini (constat 11).
- **Options** : A. Des pages numérotées, avec `page` et `size`. B. Un curseur, avec `limit` et `cursor`.
- **Choix** : A. `page` commence à 1. `size` vaut 20 par défaut et 100 au plus ; au-delà, 422. La réponse donne `items`, `page`, `size`, `total` et `hasNext`. Une page après la fin répond 200 avec `items` vide. Tri fixe : `createdAt` du plus récent au plus ancien, puis `id`. Filtres `status`, une des cinq valeurs, et `siteId`, combinés par ET. Un site inconnu ou d'un autre client donne une liste vide. Les compteurs ne comptent que ce que l'appelant peut voir.
- **Justification** : R08 (P03 l.19). Le parcours U4 veut la position et savoir s'il y a une page suivante (P04 l.44–49) : un curseur ne donne pas la position. N04 parle d'une page de 20 (P03 l.46–47).
- **Conséquences** : bénéfice, la file complète d'un site et un écran vide normal. Coût, un comptage à chaque page et des index à ajouter : aujourd'hui il n'y en a que sur `id` et `created_at` (P05 l.60). Touchés : Console Ops et Terrain. L'export garde la liste v1.
- **Risques** : pendant des écritures, une ligne peut glisser d'une page à l'autre, donc être vue deux fois ou manquée. C'est la limite acceptée. L'objectif de 500 ms n'est pas mesuré ici.
- **Réexamen** : si la file d'un tenant devient trop longue pour être comptée à chaque page, passer au curseur.
- **Preuve** : avant, `http/liste.http` et `http/vide.http`. Après, les scénarios *liste vide*, *filtre combiné* et *borne de pagination*.

## Décision 6 — Modification, affectation et transitions

- **Contexte** : corriger un titre efface le technicien, l'affectation est un GET rejoué par un rechargement, et le statut reçu est enregistré tel quel (constats 5, 6, 7 et 9).
- **Options** : A. Trois opérations séparées : modifier, affecter, changer d'état. B. Une seule modification qui accepte tout : titre, technicien et statut.
- **Choix** : A.
  - Modifier : `PATCH` en `application/merge-patch+json`, sur `title` et `priority` seulement. Un champ absent reste inchangé. `null` est refusé (422). Tout autre champ est refusé (422).
  - Affecter : `PUT` sur l'affectation de la demande, avec le technicien. La demande passe à ASSIGNED. Répéter la même affectation ne change rien.
  - Changer d'état : une route de transition, pour commencer, terminer ou annuler. C'est une septième opération.
  - Chaque changement réel fait trois choses dans une seule transaction : l'état, une révision de plus, un événement d'historique. Une requête qui ne change rien n'écrit ni révision ni événement.
- **Justification** : R11 demande de distinguer garder et changer l'affectation (P03 l.22). R04 à R06 fixent le cycle et les droits (P03 l.15–17). R09 veut un événement par changement réel (P03 l.20), N05 une transaction (P03 l.52–53). Avec le merge patch, seuls les champs envoyés sont traités (RFC 7396). `PUT` est idempotent : le répéter a le même effet qu'une seule fois (RFC 9110, section 9.2.2). La mission admet une route de transition en plus (mission l.16–17).
- **Conséquences** : bénéfice, corriger un titre ne peut plus toucher l'affectation, et un rechargement ne peut plus affecter. Coût, une opération de plus à décrire et à tester. Touchés : Console Ops pour modifier et affecter, Terrain pour commencer et terminer.
- **Risques** : en merge patch, `null` veut dire retirer. Ici il est toujours refusé, et il faut le tester. Les demandes déjà créées n'ont peut-être pas d'événement de création.
- **Réexamen** : si ATLAS veut un jour retirer un technicien sans le remplacer, ce que R11 ne demande pas aujourd'hui.
- **Preuve** : avant, `http/modification.http` et `http/affectation.http`. Après, les scénarios *champ absent/null* et *transition interdite*.
