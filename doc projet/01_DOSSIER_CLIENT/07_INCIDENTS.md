# P07 — Registre des incidents

Support ATLAS · export fictif du 22 octobre 2026. Les priorités annoncées reflètent le point de vue du déclarant ; votre audit doit les réévaluer.

## INC-01 — Console Ops : file non affichée

- Priorité annoncée : **P1**.
- Contexte : Console Ops : file non affichée, sur le lot de test fourni.
- Constat : À l’ouverture de C01, items.map is not a function.
- Attendu : Afficher les lignes et les métadonnées de page.
- Éléments techniques : GET /api/interventions?page=0&size=20 ; http/liste.http, code/front.mjs.
- Observation équipe : Élodie : le tableau annoncé par le wiki est devenu une enveloppe ; aucun avis de version reçu.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-02 — Création depuis un formulaire récent

- Priorité annoncée : **P1**.
- Contexte : Création depuis un formulaire récent, sur le lot de test fourni.
- Constat : Le titre saisi disparaît et la console affiche undefined pour le numéro créé.
- Attendu : Une demande avec le titre voulu, puis navigation vers son détail.
- Éléments techniques : json/creation-requete.json, json/creation-reponse.json et code/back.mjs.
- Observation équipe : Bastien : le contrôleur lit label et site_id, le formulaire envoie title et siteId ; le wiki annonce un autre statut de succès.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-03 — Retour sur un lien d’affectation

- Priorité annoncée : **P1**.
- Contexte : Retour sur un lien d’affectation, sur le lot de test fourni.
- Constat : Un rafraîchissement du navigateur réaffecte I100 et ajoute une ligne d’historique.
- Attendu : La lecture d’un lien ne déclenche pas une action métier.
- Éléments techniques : GET /api/assign?id=I100&tech=T01 ; http/affectation.http.
- Observation équipe : Hugo : un robot de préchargement a suivi le lien. Le cache ne connaît pas cette exception.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-04 — Terrain après correction d’un titre par Ops

- Priorité annoncée : **P1**.
- Contexte : Terrain après correction d’un titre par Ops, sur le lot de test fourni.
- Constat : Le technicien de I101 devient null après une mise à jour du seul titre.
- Attendu : Conserver les champs non visés et les invariants métier.
- Éléments techniques : http/modification.http ; code/back.mjs, fonction update.
- Observation équipe : Samir : nous calculons encore les transitions dans le mobile ; la dernière version envoyée par Ops a aussi rouvert I103.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-05 — Recherche sur un site sans demande ouverte

- Priorité annoncée : **P2**.
- Contexte : Recherche sur un site sans demande ouverte, sur le lot de test fourni.
- Constat : La page vide déclenche une alerte « ressource disparue » ; le passage page=0/page=1 répète parfois les mêmes lignes.
- Attendu : Un état vide normal et une navigation compréhensible, bornée et ordonnée.
- Éléments techniques : http/vide.http ; P06 liste ; deux créations dans json/interventions.json ont le même createdAt.
- Observation équipe : Élodie : le filtre site est appliqué sur la page déjà téléchargée, pas sur toute la file.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-06 — Lecture d’un autre client

- Priorité annoncée : **P0**.
- Contexte : Lecture d’un autre client, sur le lot de test fourni.
- Constat : Lina de C01 obtient le détail I200 de C02 en changeant l’URL et X-Tenant.
- Attendu : Aucun contenu ni confirmation d’existence hors périmètre autorisé.
- Éléments techniques : http/isolement.http ; json/identites.json ; code/back.mjs detail.
- Observation équipe : Salomé : nous classons sécurité urgente ; masquer un bouton ne suffit pas.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-07 — Planification avec un technicien visible dans un export global

- Priorité annoncée : **P1**.
- Contexte : Planification avec un technicien visible dans un export global, sur le lot de test fourni.
- Constat : Le serveur accepte T02 sur I100 alors que T02 appartient à C02.
- Attendu : Refus sans mutation ni historique de réussite.
- Éléments techniques : json/techniciens.json ; code/back.mjs assign.
- Observation équipe : Bastien : la seule vérification est exists(id). Le même test laisse aussi passer T03 inactif.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-08 — Deux planificateurs sur le même détail

- Priorité annoncée : **P1**.
- Contexte : Deux planificateurs sur le même détail, sur le lot de test fourni.
- Constat : Une seconde sauvegarde efface une priorité plus récente sans avertissement.
- Attendu : Détecter l’état ancien et permettre la relecture.
- Éléments techniques : http/concurrence.http ; P03 R10 ; code/back.mjs update.
- Observation équipe : Nora : les deux écrans avaient lu revision=2. Aucun champ ou en-tête conditionnel n’a été envoyé.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-09 — Export BI et interprétation de dates

- Priorité annoncée : **P2**.
- Contexte : Export BI et interprétation de dates, sur le lot de test fourni.
- Constat : Le tri intercale mal I101 et l’affichage dépend du poste.
- Attendu : Des types stables et des instants interprétables sans hypothèse locale.
- Éléments techniques : json/detail-reponse.json ; json/interventions.json ; schemas/intervention-v1.schema.json.
- Observation équipe : BI : id est déclaré entier mais les valeurs ont un préfixe ; priority=2 nous oblige à une conversion non publiée.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.

## INC-10 — Consultation de l’historique après incident SQL

- Priorité annoncée : **P1**.
- Contexte : Consultation de l’historique après incident SQL, sur le lot de test fourni.
- Constat : L’affectation a changé mais aucun événement n’est présent ; une autre tentative en a écrit deux.
- Attendu : Une trace par mutation acceptée et aucune trace de succès après rejet.
- Éléments techniques : P05 séquence ; http/historique.http ; P08 M5.
- Observation équipe : Hugo : les trois écritures sont séparées. Le support colle encore Authorization dans ses journaux ; P09 demande une autre méthode.

Reproduction à documenter : relier la pièce technique au besoin produit, distinguer cause et symptôme, puis décrire un cas de non-régression et l’état attendu à l’écran.
