# Exemple de ligne d'audit — autre domaine

| Preuve | Observation | Conséquence | Criticité | Cause probable | Proposition | Justification | Non-régression |
|---|---|---|---|---|---|---|---|
| Capture bibliothèque, GET /books/B1 et schéma Book.id | La capture émet un identifiant texte et le schéma annonce un nombre | Le client généré refuse la réponse | Importante : lecture impossible pour ce client | Schéma publié non synchronisé | Aligner type et consommateurs via une version annoncée | L'identifiant est opaque et stable ; convertir en nombre en perd le préfixe | Vérifier un livre et une référence dans une autre ressource |

Dans votre audit ATLAS, distinguer preuve certaine et explication supposée.
Ajouter une colonne de statut de décision et une référence à vos tests. Regrouper
les occurrences d'une même cause au lieu de gonfler le nombre de problèmes.
