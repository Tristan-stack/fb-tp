# Approfondissements facultatifs

## 1 — Coupure après création

La réponse d'une création réussie est perdue avant d'atteindre le client. Proposer
une clé d'idempotence, son périmètre tenant/utilisateur, sa durée de rétention et
le traitement d'une réutilisation avec un autre contenu. Écrire deux scénarios
et discuter la différence entre déduplication et interdiction de doublons métier.
Ne pas annoncer exactly-once sans démonstration de ses conditions.

## 2 — Pagination sous écritures concurrentes

Préparer six interventions avec deux createdAt identiques. Lire une page, insérer
une ligne avant la page suivante et comparer offset et curseur. Décrire le tri
secondaire et le comportement du curseur. Livrable : tableau de positions avant/
après, choix justifié, limites acceptées par le produit et coût côté stockage.

## 3 — Évolution sans rupture

Ajouter un nouveau statut WAITING_PARTS dans une proposition v3. Identifier les
consommateurs v1/v2, leurs enums fermés, les pertes d'information d'une conversion
et les critères d'une migration réversible. Construire une matrice consommateurs/
changements et un test de contrat par client. Ne pas ajouter cet état au socle
actuel sans l'isoler comme hypothèse future.

## 4 — Vie privée et exploitation

Concevoir un événement utile à l'audit sans recopier le titre libre. Décrire purge
et anonymisation à partir des durées internes du scénario, les journaux de sécurité
et les preuves de minimisation. Identifier ce qui nécessiterait une validation
organisationnelle réelle. Aucun avis juridique n'est attendu.

## 5 — Mock local et tests de consommation

Créer un simulateur statique piloté par le contrat, puis un consommateur qui
réagit à succès, refus et conflit. Prouver qu'il utilise les mêmes schémas que
les exemples. Décrire pourquoi un mock conforme ne prouve pas l'implémentation
du serveur. Les travaux ne rapportent pas de bonus au-delà du barème sur 20.
