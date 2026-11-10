# P06 — Extrait du wiki API historique

Équipe intégration · révision du 18 septembre 2026. Base fictive :
https://api.atlas.invalid. Les routes /api sont dites v1 dans le wiki. Des clients
les consomment encore. La notation de type ci-dessous est celle du wiki, pas une
spécification normative.

## Conventions du wiki

Le client fournit Authorization: Bearer DEMO et X-Tenant: C01. Les identifiants
d'interventions sont décrits comme des entiers. Les dates sont annoncées au format
ISO 8601 avec fuseau. Le wiki recommande de tester uniquement le booléen success
dans les réponses et de considérer HTTP 200 comme le signe que le service répond.
La propriété technicianId est présentée comme toujours renseignée dans un détail.
La propriété priority serait facultative et pourrait contenir « urgent ».

## Liste

GET /api/interventions?state=open&page=0&size=20

Paramètres : state vaut open ou closed ; page est indexée à partir de zéro ; size
est « libre ». Le wiki annonce un tableau nu d'objets {id, title, status}. Si aucun
résultat n'est disponible, l'équipe mobile demande un 404. Le filtre site est
cité dans une note sans nom de paramètre publié. Aucun ordre n'est spécifié.
Une capture plus récente est livrée dans http/liste.http.

## Détail

GET /api/intervention/{id}

Le wiki attend id entier et annonce 200 avec {id, title, siteId, status,
technicianId, createdAt}. Une absence retourne 200 avec {success:false,
error:"not_found"}. Le détail d'un autre tenant n'est pas décrit. createdAt est
parfois affiché dans la zone locale du serveur ; vérifier les traces fournies.

## Création

POST /api/interventions — Content-Type: application/json

Champs annoncés : title chaîne, siteId chaîne, priority chaîne facultative.
Le wiki annonce 201 et un en-tête Location, avec la ressource créée en JSON.
Le schéma initial et l'extrait serveur sont également joints au dossier. Exemple
wiki : {"title":"Porte bloquée","siteId":"S01","priority":"HIGH"}.
Les erreurs de titre devraient être « gérées avant l'envoi » selon une note de
revue de septembre ; aucune liste commune des erreurs n'a été publiée.

## Modification

PUT /api/intervention/{id}

Le wiki affirme que l'appel peut recevoir un seul champ title ou status. Il ne
précise ni remplacement complet ni traitement d'un champ absent. La capture jointe
ne contient pas technicianId. L'interface espère conserver l'affectation existante.
La règle de transition est calculée par Terrain. Une erreur produit tantôt une
chaîne texte, tantôt {success:false,error}, selon le contrôleur appelé.

## Affectation

GET /api/assign?id={id}&tech={technicianId}

Cette route est appelée par un lien de Console Ops. L'API répond 200 texte OK.
Le wiki suppose qu'un identifiant de technicien connu suffit. La route n'expose
pas le nouvel état de l'intervention ni de mécanisme de lecture concurrente.
Une nouvelle tentative réécrit l'historique même si le technicien est inchangé.

## Historique

GET /api/interventions/{id}/history — réponse 200 tableau d'événements.
Un événement contient actorId, kind et at. La documentation n'explique ni les
droits de lecture, ni l'ordre, ni les effets d'un échec partiel d'affectation.
Un tableau complet est renvoyé ; aucun plafond n'est annoncé.

## Modèle annoncé et questions de raccordement

status est documenté avec OPEN et CLOSED dans le schéma initial. L'équipe Ops
emploie aussi ASSIGNED. La priorité est écrite en chaîne, mais des données exportées
présentent une valeur numérique. L'étudiant doit reconstruire des conventions
communes et prévoir la conversion de v1. Une conversion qui fusionne deux états
doit indiquer ce que perd le consommateur et où reste l'information détaillée.

La version OpenAPI jointe décrit six opérations avec une syntaxe analysable.
Elle reflète ce wiki et n'atteste pas du comportement serveur. Comparer le schéma,
les captures, les données et les besoins avant d'en dériver la cible.
