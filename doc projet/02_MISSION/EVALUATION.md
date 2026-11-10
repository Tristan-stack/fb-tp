# Grille pédagogique sur 20

Cinq domaines de 4 points ; vingt sous-critères de 1 point. Évaluation pédagogique sous réserve des modalités de l’établissement.

| Code | Domaine | Critère observable | Maximum |
|---|---|---|---:|
| A1 | Audit | Preuves localisées et faits distincts des hypothèses | 1 |
| A2 | Audit | Causes et conséquences établies par recoupement | 1 |
| A3 | Audit | Criticité et priorités argumentées, risques majeurs couverts | 1 |
| A4 | Audit | Corrections réalistes et traçables aux besoins | 1 |
| B1 | Architecture | Cartographies existante/cible et flux compréhensibles | 1 |
| B2 | Architecture | Matrice Front/Back/stockage/identité cohérente | 1 |
| B3 | Architecture | Frontières de confiance, isolement et droits | 1 |
| B4 | Architecture | Migration, dépendances et risques de continuité | 1 |
| C1 | REST HTTP JSON | Ressources, six opérations, méthodes et paramètres | 1 |
| C2 | REST HTTP JSON | Statuts et erreurs exploitables par les interfaces | 1 |
| C3 | REST HTTP JSON | Types, null, validation et cycle métier cohérents | 1 |
| C4 | REST HTTP JSON | Pagination, filtres et gestion de concurrence expliqués | 1 |
| D1 | OpenAPI | Document 3.1 analysable, structure et références valides | 1 |
| D2 | OpenAPI | Six opérations et paramètres/sécurité correctement décrits | 1 |
| D3 | OpenAPI | Schémas et réponses succès/erreurs précis | 1 |
| D4 | OpenAPI | Exemples et catalogue alignés au contrat | 1 |
| E1 | Justifications et preuves | Scénarios positifs/négatifs et effets Front-End | 1 |
| E2 | Justifications et preuves | Preuves de validation, limites et corrections documentées | 1 |
| E3 | Justifications et preuves | Décisions, alternatives et compréhension personnelle | 1 |
| E4 | Justifications et preuves | Rapport clair, rendu navigable, sources et usages IA | 1 |


## Niveaux appliqués à chaque sous-critère

- 0 : absent, contradictoire ou inexploitable.
- 0,25 : mention générique, sans preuve utilisable ou sans lien avec ATLAS.
- 0,50 : réalisation partielle, exemple utile, mais couverture ou précision insuffisante.
- 0,75 : réalisation cohérente et argumentée, défaut local qui ne compromet pas l'ensemble.
- 1 : complet sur le périmètre requis, précis, vérifiable et relié au contexte.

Les domaines restent indépendants : un défaut de syntaxe OpenAPI ne supprime pas
les points d'un audit solide. Un oubli de sécurité affecte B3 et les critères
techniques effectivement concernés ; pas de sanction globale inventée. Justifier
chaque retrait par une observation. Éviter de décompter plusieurs fois le même
symptôme dans un même critère. Une seule bonne opération ne démontre pas la
couverture des six, mais peut justifier des points partiels de conception.

Exemples de défauts de rendu, indépendants des incidents à découvrir : catalogue
ne couvrant que deux des six opérations demandées (C1), exemple qui ne correspond
pas à son propre schéma (D4), contrat sans description des erreurs pertinentes
(D3), « test réussi » sans sortie ni méthode (E2). Une solution
alternative de pagination ou de concurrence peut obtenir tous les points si
elle est précise, réalisable et respecte les besoins. Aucune architecture unique
n'est imposée. Les approfondissements servent à démontrer la maîtrise dans les
critères existants ; ils n'ajoutent pas de points au-delà de 20.

E3 s'appuie sur les explications écrites et, si elle est organisée, la soutenance.
L'oral vérifie la compréhension, sans déplacer le barème ni créer une note cachée.
La déclaration IA est une exigence de transparence ; un score automatique de
détection d'IA n'est ni une preuve ni un critère.
