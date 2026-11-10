# P04 — Parcours observés et attentes de service

## U1 — Créer et retrouver une demande

Lina, demandeuse de C01, sélectionne S01, saisit « Climatisation salle réunion »
et conserve la priorité par défaut. Elle valide une fois et veut voir la demande
créée dans son détail puis dans sa liste. Si la saisie est refusée, le formulaire
doit garder ses valeurs et identifier le champ concerné. Si le réseau coupe avant
la réponse, l'interface ne peut conclure que la création a échoué : proposer une
reprise compréhensible et distinguer ce problème d'un rejet de validation.

Vérifier la cohérence des identifiants entre requête, réponse et lien de détail.
Lina ne doit pas choisir C02 dans une liste cachée ni modifier le tenant en envoyant
sa propre requête. La protection attendue est côté serveur.

## U2 — Planifier sans perdre une modification

Nora et un collègue ouvrent I100 à la même révision. Nora modifie la priorité ;
son collègue affecte T01 depuis son ancien écran. Le produit demande que l'un
des consommateurs soit averti de l'état devenu ancien. L'écran doit conserver
l'intention de l'utilisateur et proposer une relecture, sans appliquer une
répétition aveugle. Le planificateur n'est pas autorisé à forcer une transition
IN_PROGRESS pour un technicien.

Une affectation de T02 doit pouvoir être rejetée même si son identifiant existe
dans le jeu de données. Une opération rejetée ne doit pas laisser ASSIGNED sans
technicien ni créer d'événement métier réussi.

## U3 — Consulter depuis Terrain

Samir, technicien T01 de C01, ouvre I101 qui lui est affectée. Il commence puis
termine le travail. Ses écrans reçoivent un état actualisé après chaque mutation.
Une intervention terminée ne peut pas repartir en NEW. La déconnexion n'autorise
pas l'écran à prétendre que le serveur a accepté une action. Terrain peut stocker
une intention locale, mais ne décide pas des droits ni de l'état persistant.

Samir ne doit pas accéder à I100 non affectée ni à I200 de C02, même en devinant
leur adresse. Le produit veut une règle d'erreur qui ne divulgue pas une ressource
inaccessible. Décrire comment le Front-End interprète cette réponse sans inventer
un message de permission qu'il ne peut pas distinguer.

## U4 — Lire une file et son historique

Le planificateur filtre C01 par site S01 et statut NEW. Il peut atteindre une
page sans résultat. Il veut connaître la position dans la pagination et savoir
si une page suivante est disponible. Deux créations à la même seconde doivent
rester ordonnées avec un second critère. Une pagination n'est pas forcément une
photographie de tout le jeu de données ; votre décision doit préciser sa stabilité
et ses limites pendant des écritures concurrentes.

Pour expliquer une affectation contestée, le support consulte l'historique via
un compte autorisé. Les événements doivent suivre les mutations effectivement
acceptées, avec une chronologie et une révision interprétables. Le reporting tiers
veut continuer à lire ses routes historiques sans accéder à un nouveau stockage.

## Ateliers de coordination à mener seul ou en échange collectif

Décrire pour chaque parcours les états chargement, vide, succès, saisie refusée,
session invalide, permission insuffisante et conflit. Choisir le responsable de
chaque décision. Écrire un exemple de réponse pour les cas réellement possibles ;
indiquer ceux qui ne s'appliquent pas. Une proposition qui mélange toute erreur
dans une réponse « succès=false » doit expliquer comment les outils HTTP et les
consommateurs peuvent encore prendre les bonnes décisions.
