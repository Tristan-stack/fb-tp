# P01 — Lettre de mission

ATLAS Services Numériques · Direction des opérations · Strasbourg, 23 octobre 2026.
À l'attention du consultant chargé de la coordination des interfaces.

Notre plateforme organise la maintenance des équipements de bureaux pour des
entreprises clientes. La croissance nous a conduits à ouvrir un portail client,
une console de planification et une application technicien, sans aligner leurs
contrats d'échange. Depuis septembre, les équipes d'exploitation compensent par
des appels téléphoniques les demandes non visibles et les affectations perdues.
Cette situation menace la confiance de nos clients et la fiabilité de nos historiques.

Nous vous demandons de rendre explicites les incompatibilités qui empêchent les
équipes de travailler indépendamment. Votre mission couvre l'analyse de l'existant,
la proposition de frontières Front/Back et la définition d'un contrat d'API stable.
Il ne s'agit pas de remplacer tout le produit ni d'écrire un nouveau système de
planification. Une démonstration statique étayée vaut mieux qu'un prototype qui
occulte les règles métier.

Le périmètre porte sur les interventions : consulter, rechercher, créer, modifier,
affecter et consulter l'historique. Les identités et l'authentification existent
déjà ; vous devez définir leur effet sur les interfaces, sans développer un
fournisseur d'identité. La facturation, les pièces jointes, la géolocalisation et
les notifications push sont hors périmètre obligatoire. Le reporting tiers reste
un consommateur à préserver, pas un chantier d'analytique.

Nous attendons un diagnostic priorisé avec preuves, une architecture cible,
un catalogue cohérent, un contrat OpenAPI, des exemples vérifiables et une stratégie
de transition. Chaque arbitrage doit préciser bénéfice, coût, consommateurs touchés
et risque résiduel. Une règle du produit ne peut être écartée au seul motif qu'un
écran ne la met pas encore en œuvre.

Nous ne pouvons interrompre le portail historique. La compatibilité demandée porte
sur les échanges documentés de v1, sans autoriser le maintien d'une fuite entre
clients. Les mesures correctives de sécurité doivent être distinguées des changements
de confort. Proposez une migration progressive avec critères d'arrêt et de retour.

Les pièces jointes proviennent de plusieurs équipes et dates. La fiche produit
du 23 octobre fait référence pour les besoins actuels. Pour les comportements
observés, les captures et extraits sont à recouper ; leur présence ne vaut pas
validation de la direction. Nous accepterons plusieurs conceptions si elles sont
testables et respectent nos contraintes.

Votre dossier devra être remis le 17 novembre 2026. Nous souhaitons pouvoir faire
développer Front-End et Back-End séparément à partir de votre proposition, puis
vérifier leur intégration sans réinterpréter les intentions de chacun.

Claire Martin, directrice des opérations ATLAS (personnage fictif).
