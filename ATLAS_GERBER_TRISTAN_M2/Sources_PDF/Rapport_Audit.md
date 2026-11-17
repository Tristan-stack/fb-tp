# Rapport d'audit — ATLAS

Tristan Gerber, Mastère 2 Informatique. Mission de coordination Front-End / Back-End, novembre 2026.

Ce rapport résume le dossier. Le détail est dans les autres fichiers, cités à chaque partie.

## 1. Contexte

ATLAS gère la maintenance d'équipements de bureaux : 180 sites, 42 clients, environ 1 600 demandes
par semaine (P02 l.5–6). Quatre applications utilisent la même API : le Portail Client 1.8, la
Console Ops 2.4, Terrain 0.9 et l'Export BI 0.6 (P02 l.43–46). Elles n'ont pas de contrat commun.
Depuis septembre, des demandes ne s'affichent pas et des affectations se perdent (P01 l.9–11).

La mission demande trois choses : dire ce qui ne va pas, avec des preuves, proposer une
architecture, et écrire le contrat de six opérations sur les interventions. Il n'y a pas
d'application à développer (P01 l.13–18). Pour les besoins, c'est la fiche produit du 23 octobre
qui fait référence (P01 l.38–39).

## 2. Méthode

- Le kit compte 45 fichiers. Ils ont été relus en entier avec l'assistant d'IA, sans être modifiés.
- Pour chaque problème, je donne le fichier et la ligne, et je recoupe au moins deux pièces.
- Je sépare trois choses : le fait, le témoignage et l'hypothèse. Un ticket est un témoignage, pas une preuve.
- En cas de désaccord entre pièces, la fiche produit gagne.
- Deux phrases du dossier client s'adressent à un assistant. Je ne les ai pas suivies (annexe A, section 7).
- Quatre scripts vérifient ce qui peut l'être. Leurs sorties sont dans `Tests_et_Validations/sorties/`.
- Tout est statique : aucun serveur n'existe, aucune requête n'a été envoyée.

L'usage de l'IA est décrit dans `Sources_et_IA.md`.

## 3. Problèmes priorisés

J'ai retenu 14 problèmes, rangés sous 5 causes. L'échelle a quatre niveaux, de Critique à Mineur.
Les priorités des tickets ont toutes été réévaluées.

| N° | Problème | Gravité |
|---|---|---|
| 1 | Lina (C01) lit une intervention de C02 | Critique |
| 2 | Le client choisit lui-même son tenant et son statut | Critique |
| 3 | La console lit la base en direct | Critique |
| 4 | Un technicien d'un autre client, ou inactif, est accepté | Critique |
| 5 | Le serveur ne valide rien et accepte n'importe quel statut | Majeur |
| 6 | L'affectation est un GET : un rechargement la rejoue | Majeur |
| 7 | Corriger le titre efface le technicien | Majeur |
| 8 | La deuxième sauvegarde écrase la première sans prévenir | Majeur |
| 9 | Une affectation fait trois écritures séparées | Majeur |
| 10 | La création perd le titre et le site | Majeur |
| 14 | Les jetons et les titres sont copiés dans les journaux | Majeur |
| 11 | La liste a changé de forme, ses règles ne sont écrites nulle part | Important |
| 12 | Le contrat publié ne décrit pas ce que l'API renvoie | Important |
| 13 | Un échec répond 200 : les écrans ne peuvent pas réagir | Important |

La première cause passe avant tout : le serveur croit ce qu'on lui envoie. Tant qu'il ne sait pas
qui appelle, aucune autre correction ne tient. Deux problèmes critiques n'avaient aucun ticket : le
2 et le 3.

Le détail de chaque problème est dans l'annexe A : preuve, conséquence, cause, correction et test.

## 4. Architecture

Aujourd'hui, il n'y a pas de frontière de confiance. L'API lit le tenant dans un en-tête envoyé par
le client, et la console lit la base sans passer par l'API.

Dans la cible, tout passe par l'API. Le tenant et le rôle viennent du jeton validé. Seule l'API
accède à la base, et chaque écriture se fait dans une transaction. Le Portail 1.8 et l'export BI
gardent leurs routes v1, derrière un adaptateur qui traduit sans rien décider.

La migration se fait en cinq étapes, un consommateur à la fois, sans arrêt. La sécurité est
corrigée d'abord, pour tout le monde.

Le détail est dans `Architecture.pdf` : les schémas, les flux, le tableau des responsabilités et
les étapes de la migration.

## 5. Décisions

| N° | Décision | Choix |
|---|---|---|
| 1 | Frontière de confiance | Le tenant et le rôle viennent du jeton validé, de rien d'autre |
| 2 | Conventions REST et erreurs | Le statut HTTP dit le résultat, une seule forme d'erreur |
| 3 | Concurrence | Un ETag égal à la révision, `If-Match` obligatoire sur chaque écriture |
| 4 | Compatibilité v1 | Nouveau contrat sous `/api/v2`, v1 gardée derrière l'adaptateur |
| 5 | Pagination et filtres | Pages numérotées, tri fixe, filtres faits par le serveur |
| 6 | Modification, affectation et transitions | Trois opérations séparées |

Chaque décision est détaillée dans `Decisions_Techniques.md` : contexte, options, justification,
conséquences, risques et critère de réexamen.

## 6. Alternatives et compromis

| Décision | Option écartée | Ce que j'accepte en échange |
|---|---|---|
| 1 | Lire `X-Tenant` et refuser s'il contredit le jeton | Un contrôle de périmètre dans chaque opération |
| 2 | Un format d'erreur maison, ou 200 partout | Huit cas à tester par opération. Un 404 qui ne dit pas pourquoi |
| 3 | La révision dans le corps de la requête | Chaque écran garde l'ETag qu'il a lu |
| 4 | Tout remplacer d'un coup | Deux contrats à tester pendant la transition |
| 5 | Un curseur | Une ligne peut glisser d'une page à l'autre pendant des écritures |
| 6 | Une seule modification qui accepte tout | Une septième opération à décrire |

Ce que je n'ai pas fait, et pourquoi :

- La reprise d'une création après une coupure réseau. C'est un approfondissement (P03 l.59–60). L'écran propose seulement de regarder la liste avant de renvoyer.
- La suppression d'une intervention. Elle n'est pas demandée : annuler garde les traces (P09 l.54).
- La mesure du temps de réponse. Aucune infrastructure n'est fournie. Je propose une méthode dans `Architecture.pdf`.

## 7. Synthèse API

| Opération | Méthode et route | Qui |
|---|---|---|
| Lister | `GET /interventions` | Tous. Un technicien ne voit que ses affectations |
| Créer | `POST /interventions` | Demandeur, planificateur |
| Lire le détail | `GET /interventions/{id}` | Comme la liste |
| Modifier | `PATCH /interventions/{id}` | Demandeur si NEW, planificateur si NEW ou ASSIGNED |
| Affecter | `PUT /interventions/{id}/assignment` | Planificateur |
| Changer d'état | `POST /interventions/{id}/transitions` | Technicien affecté, ou annulation par le demandeur et le planificateur |
| Lire l'historique | `GET /interventions/{id}/history` | Comme le détail |

Les six opérations de la mission y sont, plus la route de transition qu'elle admet.

- Une erreur a toujours la même forme, avec un code stable et un identifiant de corrélation.
- Une intervention d'un autre tenant répond comme une intervention qui n'existe pas.
- Une écriture exige la révision lue. Si elle a changé, rien n'est écrit.
- Chaque changement réel écrit un événement d'historique, dans la même transaction.

Le détail est dans `Catalogue_REST.md`, le contrat dans `Contrat_API.yaml` et 25 exemples dans
`Exemples_JSON/`.

## 8. Vérifications et preuves

| Contrôle | Ce qu'il montre | Sa limite |
|---|---|---|
| `controle_donnees_v1.py` | Aucun des six objets du kit ne suit le schéma publié : 17 écarts | Il vérifie la forme, pas le serveur |
| `date_i101.mjs` | La date de I101 colle avec 08:00 UTC à l'heure de Paris | Compatible, pas prouvé |
| `reproduire_extraits.mjs` | Le code du kit laisse passer onze cas de l'audit | C'est une simulation, avec une fausse base |
| `controle_contrat.py` | Le contrat est un OpenAPI 3.1 valide, les 25 exemples suivent leurs schémas, le catalogue a les mêmes routes | Statique, sans serveur |

Douze scénarios couvrent les douze thèmes de la mission (`Tests_et_Validations/Scenarios.md`).
Chacun donne l'utilisateur, la requête, la réponse attendue, l'effet et ce que fait l'écran.

Ce qui n'est vérifié que par relecture : les droits, les transitions, les journaux et le temps de
réponse. Un schéma ne peut pas les prouver. Les commandes et les versions sont dans `README.md`.

## 9. Risques et dépendances

Les trois risques les plus lourds :

- L'accès direct à la base reste ouvert tant que la console n'a pas migré.
- Des données ont déjà été lues par un autre client. Corriger la route ne règle pas ce passé.
- On ne sait pas ce que le Portail 1.8 et l'export BI reçoivent vraiment aujourd'hui.

Les dépendances : le fournisseur d'identité, qui doit mettre le tenant et le rôle dans le jeton ;
l'adaptateur, qui doit tenir toute la transition ; et ATLAS, qui doit confirmer la date de fin de la
v1 et prévenir ses clients des restrictions de sécurité.

Le registre complet est dans l'annexe B, avec pour chaque risque sa probabilité, son impact, la
mesure, un responsable proposé et ce qui reste.

## 10. Retour critique sur la démarche, les erreurs corrigées et les outils

**La démarche.** Partir des preuves a évité de suivre les tickets à l'aveugle : deux d'entre eux
orientaient mal, INC-03 et INC-06. Trancher les choix avant d'écrire le contrat a évité de le réécrire.
Écrire d'abord deux opérations de bout en bout a montré tôt ce qui manquait.

**Les erreurs corrigées.**

- Le validateur ne signalait pas une date fausse. Il manquait un paquet. Je l'ai installé, et le script affiche maintenant ce qu'il vérifie vraiment.
- Le contrôle du contrat plantait sur une référence cassée, au lieu de la signaler. Je l'ai corrigé, puis essayé avec sept fautes volontaires.
- L'annexe d'audit annonçait quatre tests qui n'existaient pas. Les renvois ont été corrigés.
- La première version de l'annexe était trop longue. Je l'ai raccourcie.

**Les outils.** L'assistant d'IA va vite pour relire les pièces et tenir les références. Mais il
faut tout vérifier : j'ai dû améliorer et optimiser des textes d'explication, et il lit le web par extraits. Un validateur
qui dit que tout va bien ne suffit pas non plus : il faut regarder ce qu'il a vraiment contrôlé.

**Les limites du dossier.** Tout est statique. Le format réel de la v1 n'est pas connu. Le temps de
réponse n'est pas mesuré. Les droits et les transitions sont décrits, pas prouvés.
