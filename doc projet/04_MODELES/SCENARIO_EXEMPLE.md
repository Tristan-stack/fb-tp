# Exemple de scénario — bibliothèque

Précondition : B1 existe, utilisateur autorisé, aucune mutation prévue.
Requête : GET /books/B1, Accept: application/json.
Réponse attendue : 200, Content-Type: application/json, objet Book avec id=B1.
Effet persistant : aucun. Front-End : afficher le titre, terminer le chargement.
Preuve : commande et sortie du contrôle de schéma, puis revue du lien entre id
et la fixture. Limite : contrôle statique sans serveur.

Variante négative : B999 absent. Documenter la réponse de votre contrat, l'absence
de mutation et l'état d'écran. Ne pas se contenter du texte « doit échouer ».
Un scénario ATLAS doit identifier un utilisateur et son périmètre de tenant.
