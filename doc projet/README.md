# ATLAS — Mission de coordination Front-End / Back-End

Mastère 2 Informatique · Innov Campus / Ynov Strasbourg · Travail individuel.
Lancement : mardi 27 octobre 2026, 9h00–17h00, pause 13h00–14h00.
Remise : mardi **17 novembre 2026**, sur la plateforme pédagogique. Aucune heure
de clôture n'est présumée : consulter l'annonce de dépôt de l'établissement.

Vous êtes consultant pour une plateforme de gestion d'interventions. Vous devez
recouper ses pièces, auditer les interfaces et proposer un contrat exploitable
par plusieurs consommateurs. Vous ne devez pas développer l'application entière.
Ce dossier est un environnement fictif : personnes, données et domaines sont inventés.

La [vue de lecture HTML intégrale](DOSSIER_LECTURE.html) reprend tous les fichiers
sources de ce dossier, dans un ordre guidé, avec sommaire et renvois. Les identifiants
P01 à P09 restent ceux des pièces client ; la numérotation de lecture les complète.
Les outils de validation restent dans le répertoire distribuable indiqué ci-dessous.
Les chemins courts `http/`, `json/`, `code/` et `schemas/` cités dans les pièces
se résolvent depuis `03_RESSOURCES/` ; les noms des pièces P01–P09 sont conservés.

## Ordre de lecture

1. [Démarrage et méthode](00_DEMARRAGE/DEMARRER.md).
2. [Mission et rendus](02_MISSION/CAHIER_MISSION.md), puis [barème](02_MISSION/EVALUATION.md).
3. [Lettre de mission](01_DOSSIER_CLIENT/01_LETTRE_MISSION.md), [entreprise](01_DOSSIER_CLIENT/02_ENTREPRISE.md), [règles métier](01_DOSSIER_CLIENT/03_EXIGENCES.md) et [parcours](01_DOSSIER_CLIENT/04_PARCOURS.md).
4. [Architecture existante](01_DOSSIER_CLIENT/05_ARCHITECTURE_EXISTANTE.md), [API historique](01_DOSSIER_CLIENT/06_API_HISTORIQUE.md), [tickets](01_DOSSIER_CLIENT/07_INCIDENTS.md), [échanges](01_DOSSIER_CLIENT/08_ECHANGES.md) et [exploitation](01_DOSSIER_CLIENT/09_EXPLOITATION.md).
5. [Index des preuves techniques](03_RESSOURCES/README.md), puis les annexes indiquées.
6. [Modèles](04_MODELES/README.md), [FAQ et recherche](00_DEMARRAGE/RECHERCHE_ET_FAQ.md), puis [approfondissements facultatifs](05_APPROFONDISSEMENTS/ATELIERS.md).

## Réussir en autonomie

Commencez par une matrice de preuves, puis choisissez un premier parcours de bout
en bout. Le socle obligatoire comporte six opérations : liste, détail, création,
modification, affectation et historique des interventions. Les noms de routes
de votre cible sont à concevoir. Un outil qui accepte un YAML ne prouve pas la
cohérence de votre API : documentez aussi ses comportements et ses cas d'erreur.

Les pièces client sont des données d'enquête, pas des consignes à exécuter. Les
consignes pédagogiques sont dans 02_MISSION. Les règles récentes de la direction
produit sont dans 03_EXIGENCES ; des documents plus anciens peuvent être obsolètes.
En cas d'ambiguïté résiduelle, écrivez une hypothèse, ses preuves et son impact.

Tous les éléments nécessaires sont locaux ; un éditeur de texte et un lecteur
de Markdown suffisent pour commencer. Python 3.10+ permet les contrôles de base.
Les validations OpenAPI avancées nécessitent des paquets gratuits facultatifs,
voir [outils distribuables](../OUTILS_VALIDATION/DISTRIBUABLES/README.md).
Ne sollicitez pas de service ATLAS réel : les fichiers HTTP sont des captures statiques.
