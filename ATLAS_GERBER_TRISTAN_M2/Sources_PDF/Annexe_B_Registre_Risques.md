# Annexe B — Registre de risques

Dix risques qui restent après les corrections proposées. Les responsables sont des propositions,
prises parmi les personnes du dossier client. Probabilité et impact : faible, moyen ou fort.

| N° | Risque | Probabilité | Impact | Mesure | Responsable proposé | Risque résiduel |
|---|---|---|---|---|---|---|
| 1 | L'accès direct à la base reste ouvert tant que la console n'a pas migré | Moyenne | Fort | Migrer la console en premier. Changer le compte de la base. Sortir l'adresse de la configuration publique | Hugo, plateforme | Faible après la migration de la console |
| 2 | Des données ont déjà été lues par un autre client | Forte : c'est arrivé | Fort | Chercher les lectures entre tenants dans les journaux. Prévenir selon la procédure interne | Salomé, support, avec la direction | On ne retrouvera pas tout : les journaux ne sont gardés que 30 jours |
| 3 | Le format v1 que reçoivent le Portail 1.8 et l'export BI n'est pas connu | Moyenne | Moyen | Capturer les réponses actuelles de l'adaptateur avant tout changement. En faire des tests de non-régression | Hugo, plateforme | Faible |
| 4 | Un ancien usage cesse de marcher quand la sécurité est corrigée | Moyenne | Moyen | Annoncer les restrictions. Observer les erreurs après la mise en service | Inès, produit | Accepté : c'est le prix de la correction |
| 5 | Les révisions et l'historique d'avant la migration ne sont pas fiables | Forte | Moyen | Reprendre les données à la migration : une révision sûre et un événement de reprise par intervention | Bastien, Back | L'historique d'avant reste incomplet |
| 6 | Les anciennes données ambiguës sont mal converties (priorité `2`, date de I101) | Moyenne | Faible | Écrire la règle de conversion et la faire valider | Inès, produit, avec l'équipe BI | Une conversion fausse si l'hypothèse est fausse |
| 7 | Un écran contourne un refus : il renvoie tout seul après un conflit, ou ne lit pas le code d'erreur | Moyenne | Moyen | Mettre le scénario SC-11 et les états d'écran dans la recette de chaque Front | Élodie, Front | Faible |
| 8 | L'objectif de 500 ms n'est pas tenu | Inconnue : rien n'est mesuré | Moyen | Mesurer avec la méthode de l'architecture. Ajouter l'index de la liste | Hugo, plateforme | À mesurer |
| 9 | La v1 n'est jamais fermée après la transition | Moyenne | Moyen | Faire confirmer la date de fin. Suivre le trafic v1 | Claire Martin, direction des opérations | Faible |
| 10 | La purge efface trop tôt, ou garde trop longtemps (12 mois d'historique, 30 jours de journaux) | Moyenne | Moyen | Écrire la règle de purge. La revoir avec le responsable de la protection des données | Claire Martin, direction des opérations | Dépend d'une décision interne. Aucun avis juridique n'est donné ici |

Les durées de 12 mois et de 30 jours sont des hypothèses de politique d'ATLAS, pas des délais
légaux (P03 l.39–44).
