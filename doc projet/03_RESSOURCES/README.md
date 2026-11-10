# Ressources d'investigation — index

Les documents P01 à P09 sont dans 01_DOSSIER_CLIENT. Les fichiers ci-dessous
proviennent du système historique et décrivent des observations, pas la solution.
Les JSON sont tous syntaxiquement lisibles. Les divergences de sens et de modèle
doivent être analysées. Ne pas exécuter les extraits comme une application réelle.

| Pièce | Fichiers | Usage |
|---|---|---|
| T01 | json/interventions.json | Échantillon persistant historique, comparer statuts, types, dates et relations |
| T02 | json/sites.json, json/techniciens.json, json/identites.json | Référentiels synthétiques et périmètres autorisés |
| T03 | json/creation-requete.json, json/creation-reponse.json | Charge utile envoyée par le formulaire et réponse capturée |
| T04 | json/detail-reponse.json | Réponse capturée pour I101 |
| T05 | http/liste.http, http/vide.http | Liste et résultat vide |
| T06 | http/creation.http, http/detail.http | Création et lecture absente |
| T07 | http/affectation.http, http/modification.http | Opérations de planification |
| T08 | http/isolement.http, http/concurrence.http, http/historique.http | Droits, mises à jour parallèles et traces |
| T09 | code/front.mjs, code/back.mjs | Consommateur et contrôleurs historiques simplifiés |
| T10 | config-demo.json | Configuration publique de la console et paramètres de connexion fictifs |
| T11 | schemas/intervention-v1.schema.json | Schéma annoncé par le wiki |
| T12 | openapi-initial.yaml | Six opérations historiques ; à comparer aux pièces et à la cible |
| T13 | cahier-recette-support.md | Attentes opérationnelles et questions d'intégration |

Les captures HTTP comprennent requête et réponse séparées par une ligne vide et
un commentaire « réponse capturée » ; ce sont des transcriptions, pas des fichiers
à envoyer en bloc. Les modules JavaScript exportent des fonctions qui reçoivent
des dépendances simulées. node --check peut en vérifier la syntaxe. Les jetons
DEMO sont des marqueurs sans pouvoir d'authentification.
