# Mission individuelle — Audit et contrat d'intégration ATLAS

## Objectif et socle

Produire un dossier qu'un développeur Front et un développeur Back pourraient
utiliser séparément puis confronter. Le travail est individuel ; discussions,
entraide, IA et recherches sont autorisées. Chaque étudiant assume ses choix et
déclare les contributions reçues. Aucun développement complet ni serveur distant
n'est exigé. L'évaluation pédagogique sur 20 reste soumise aux modalités de
l'établissement et ne présume aucun caractère certificatif officiel.

Socle contractuel obligatoire : **six opérations** sur les interventions :
liste filtrée/paginée, détail, création, modification partielle, affectation et
consultation d'historique. Chaque opération décrit droits, paramètres, types,
réponse de succès, erreurs pertinentes et effet sur l'interface. Les référentiels
locaux servent aux exemples ; les transformer en API est facultatif. Une route
de transition séparée est admise en plus si elle clarifie votre modèle.

Le parcours minimal vise un audit priorisé, une architecture défendable et ces
six opérations avec des exemples positifs et négatifs. Il permet une réussite
partielle même si la stratégie avancée de migration ou de concurrence est
incomplète : les limites doivent être annoncées et ne pas être cachées par le code.
Traiter R10 au moins par une proposition argumentée ; une simulation avancée reste
un approfondissement. Les extensions ne compensent pas un socle absent.

## Travail A — Audit et rapport de mission

Pour chaque problème : référence exacte de la preuve, observation reproductible,
conséquence, criticité argumentée, cause probable, correction proposée et raison
du choix. Distinguer faits, hypothèses et décisions. Regrouper les symptômes qui
partagent une cause, sans compter artificiellement chaque occurrence. Comparer
au moins deux pièces pour les désaccords importants. Ne pas viser un nombre
secret de défauts : la profondeur et la couverture des risques priment.

Rapport_Audit.pdf comprend dix parties : contexte ; méthode ; problèmes priorisés ;
architecture ; décisions ; alternatives et compromis ; synthèse API ; vérifications
et preuves ; risques et dépendances ; retour critique sur la démarche, les erreurs
corrigées et les outils. Annexer votre tableau d'audit et un registre de risques
(probabilité, impact, mesure, responsable proposé et risque résiduel). Les détails
techniques peuvent renvoyer aux autres fichiers plutôt que les répéter.

## Travail B — Architecture et responsabilités

Architecture.pdf contient cartographie de l'existant reconstituée, architecture
cible et au moins une séquence HTTP. Chaque flux indique acteur, protocole et
frontière de confiance. Joindre une matrice Front / Back / stockage / identité
pour affichage, validation, droits, transitions, concurrence et historique. Expliquer
les accès aux données, la continuité v1 et la migration des consommateurs. Les
diagrammes doivent rester lisibles dans le PDF sans rendu Mermaid obligatoire.

## Travaux C et D — REST et OpenAPI

Catalogue_REST.md inventorie les six opérations, ressources, routes, méthodes,
paramètres, validations, droits et codes de réponse. Les schémas donnent les champs
obligatoires, facultatifs, nullables, les valeurs permises et les conventions
d'identifiants et de dates. Décrire la signification de champ absent dans une
modification. Documenter pagination, filtres, états terminaux, isolement et erreurs.

Contrat_API.yaml est un document **OpenAPI 3.1** analysable et structurellement
valide, contenant les six opérations et leurs schémas. Les références doivent se
résoudre. Définir un mécanisme d'authentification cohérent avec le contexte ; ne
pas inventer de vrais secrets. Le contrat doit suffire à préparer des simulations.
Les validations métier non exprimables dans les schémas figurent dans les descriptions
et les tests. La syntaxe seule n'est pas une validation du comportement.

## Travail E — Exemples et preuves

Exemples_JSON/ contient au moins un exemple de succès par opération et les requêtes
de création, modification et affectation. Tests_et_Validations/ contient au moins
12 scénarios : chemin nominal, liste vide, filtre combiné, borne de pagination,
saisie invalide, champ absent/null, session invalide, accès hors tenant, permission
insuffisante, transition interdite, concurrence et continuité v1. Un scénario
comporte préconditions, requête HTTP, réponse attendue (statut/en-têtes/corps),
absence ou présence d'effet persistant et réaction attendue du Front-End.

Fournir les commandes, versions et sorties réelles des contrôles utilisés. Si un
test est une simulation, le dire. Si une exigence n'est vérifiée que par revue,
noter la méthode et ses limites. Un exemple négatif valide syntaxiquement doit
être rejeté par la bonne règle : ne confondez pas JSON mal formé et règle métier.

## Travaux F et G — Décisions et présentation

Decisions_Techniques.md contient au moins quatre décisions : frontière de confiance,
conventions REST/erreurs, compatibilité et concurrence. Pour chacune : contexte,
options, choix, justification vérifiable, conséquences, risques et critères de
réexamen. Sources_et_IA.md précise les sources principales avec date de consultation,
usages significatifs de l'IA et contrôles effectués après génération. Décrire au
moins une erreur trouvée et corrigée, provenant d'un outil ou de votre démarche.
Ne transmettez aucune donnée réelle à des outils dans ce scénario.

Presentation.pdf sert à un oral individuel de 5 à 10 minutes, éventuellement
programmé ultérieurement : problème prioritaire, architecture, un échange complet,
un arbitrage et une preuve. Vous devez expliquer sans lire votre rapport. Si
l'oral n'a pas lieu, la compréhension est évaluée sur les justifications écrites ;
aucune pénalité ne dépend d'une soutenance non organisée.

## Dépôt et fichiers exigés

Déposer le **dossier individuel** ATLAS_NOM_PRENOM_M2, sans archive ZIP, sur la
plateforme pédagogique le **17 novembre 2026**. Le formateur publie l'heure et
les modalités administratives effectives. Si la plateforme exige un conteneur,
suivre son annonce explicite ; ce kit n'en génère aucun. Contenu obligatoire :

- README.md : index de vos livrables, ordre de lecture, prérequis et commandes.
- Rapport_Audit.pdf et Architecture.pdf.
- Catalogue_REST.md et Contrat_API.yaml.
- Exemples_JSON/ et Tests_et_Validations/ (fichiers lisibles et preuves réelles).
- Decisions_Techniques.md, Sources_et_IA.md et Presentation.pdf.

Utiliser des formats ouverts lisibles sans logiciel propriétaire obligatoire.
Les PDF sont des livrables à produire par l'étudiant ; les modèles Markdown du
kit n'en dispensent pas. Ne remettez pas seulement des liens externes. Les fichiers
sources peuvent être ajoutés. Les pièces client originales ne doivent pas être
présentées comme votre contrat corrigé.

## Critères de réussite

Chaque priorité renvoie à une preuve ; chaque opération répond à un parcours ;
chaque schéma concorde avec ses exemples ; chaque choix impactant un consommateur
a un plan de compatibilité ; chaque contrôle affirme seulement ce qu'il vérifie.
Une autre architecture que celle imaginée par le formateur est recevable si elle
satisfait les règles et explique ses compromis. Aucun détecteur d'IA ne sert de
preuve de fraude ni de critère de notation. Voir [la grille](EVALUATION.md).
