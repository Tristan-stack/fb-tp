# T13 — Cahier de recette du support, 22 octobre

Le support souhaite des parcours reproductibles avec les identités synthétiques.
Pour C01, Lina doit retrouver la demande créée ; pour C02, Zoé ne doit jamais
voir cette demande. Le compte bi-c01 doit lire, sans pouvoir écrire. Samir doit
voir I101 mais pas les travaux de C01 non affectés. Le technicien T03 existe
encore dans le référentiel bien qu'il soit inactif ; ne pas le supprimer du jeu
de test, car le service doit savoir refuser une nouvelle affectation.

Pour une liste, demander le statut NEW et le site S01 ensemble ; une seule ligne
ne suffit pas à conclure que le filtrage est correct. Vérifier aussi un site du
même tenant sans résultat et une taille déraisonnable. Le support doit distinguer
« aucune intervention » et « la ressource demandée n'est pas accessible ».

Pour les mutations, conserver l'état initial et comparer état final et historique.
Ne pas conclure au succès avec le seul message affiché. Reproduire le cas où deux
écrans utilisent la même révision. Un rejet ne doit pas laisser une moitié de
mutation ; une relecture après conflit doit refléter la dernière décision acceptée.

Le consultant peut choisir une autre convention de statuts ou de pagination, mais
doit fournir une table de correspondance et les effets attendus pour les interfaces.
Les tests statiques doivent annoncer leur limite : aucune vraie base n'est fournie.
