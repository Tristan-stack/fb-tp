# Prise en main et progression

## Avant toute recherche

Créer votre répertoire de travail, conserver les pièces reçues en lecture seule
et noter les versions des outils employés. Lire la mission avant de modifier les
exemples : ils décrivent un existant à investiguer. Un constat doit pouvoir être
retrouvé par une autre personne : fichier, section, requête ou identifiant précis.
Séparer trois colonnes dans vos notes : fait constaté, hypothèse explicative,
décision proposée. Une intuition issue d'un ticket n'est pas encore une preuve.

## Rappels pour repartir sur des bases communes

Le navigateur affiche et accompagne la saisie. Il ne constitue pas une frontière
de sécurité : un client HTTP peut contourner ses contrôles. Le serveur applique
les droits et les invariants métier, puis assure la persistance. Le stockage
protège l'intégrité et la transaction ; son schéma interne n'est pas nécessairement
le modèle publié. Décrivez les transformations entre ces modèles.

Une requête HTTP combine méthode, cible, en-têtes et éventuellement contenu. Une
réponse combine statut, en-têtes et contenu éventuel. Lire le statut et le type
de contenu avant d'interpréter le JSON. JSON distingue nombre, chaîne, booléen,
objet, tableau et null. Un champ absent et un champ présent avec null peuvent
avoir des significations métier différentes ; elles doivent être contractualisées.

Une opération de lecture ne doit pas déclencher une mutation métier. L'idempotence
concerne l'effet de répétitions d'une requête, pas l'égalité de toutes les réponses.
Un contrat décrit aussi les erreurs : le Front-End doit pouvoir choisir une
réaction précise, et pas seulement afficher « erreur ». Un schéma vérifie la forme ;
il ne suffit pas à prouver un droit d'accès ou une transition de statut.

## Méthode d'investigation

Choisir un parcours (par exemple ouvrir une demande), suivre son identifiant
entre données, capture réseau et code. Comparer le modèle produit par l'émetteur
à celui attendu par le récepteur. Écrire une reproduction sur papier ou en test
local. Rechercher une règle métier qui tranche le désaccord. Proposer une correction
et examiner les autres consommateurs avant de figer une décision.

Pour chaque modification de contrat, poser : qui émet, qui consomme, quelle
version, quel échec observable, quelle preuve de non-régression ? Ne normalisez
pas silencieusement les pièces source ; conservez l'avant et l'après.

## Jalons conseillés

27 octobre, 12h00 : trois constats sourcés, une cartographie provisoire et deux
questions ouvertes. 16h30 : priorités d'audit, première architecture, ébauche de
deux opérations et plan individuel de validation. Aucun rendu final ce jour-là.
Entre le 28 octobre et le 3 novembre : consolider audit et catalogue. Du 4 au
10 novembre : achever le contrat et ses cas limites. Du 11 au 16 novembre :
rejouer les contrôles, produire les PDF, relire et préparer l'oral. Dépôt le
17 novembre 2026. Ces jalons intermédiaires sont des conseils, pas des obligations
de disponibilité du formateur.

## Autocontrôle avant de poursuivre

Pouvez-vous expliquer un échange HTTP complet ? Avez-vous une preuve et une
conséquence pour chaque priorité ? Votre cible satisfait-elle les contraintes
actuelles tout en préservant les consommateurs historiques ? Si une information
manque, pouvez-vous avancer avec une hypothèse réversible et explicitée ?
