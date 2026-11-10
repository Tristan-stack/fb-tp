# P02 — ATLAS : activité, acteurs et vocabulaire

## Activité

ATLAS coordonne la maintenance d'équipements de bureaux sur 180 sites, pour 42
entreprises clientes. Environ 1 600 demandes sont ouvertes chaque semaine. Les
clients achètent un service de suivi : ils doivent savoir qui traite une demande,
si une visite est prévue et pourquoi elle a été close. Une intervention ne contient
ni paiement ni diagnostic médical. Le contexte est fictif ; les volumes servent
à argumenter les choix, pas à exiger un test de charge industriel.

Un tenant est une entreprise cliente isolée des autres. Un site appartient à un
tenant. Une intervention appartient à un site et au même tenant. Un utilisateur
est rattaché à un seul tenant dans cet exercice. Les équipes ATLAS travaillent
avec des comptes distincts par tenant ; le rôle de planificateur ne donne donc
aucun accès transversal implicite. Le préfixe d'un identifiant n'est jamais un droit.

## Utilisateurs

Le demandeur client crée une demande et suit toutes celles de son tenant. Il
peut corriger le titre et la priorité tant que la demande est nouvelle. Le
planificateur attribue les techniciens, arbitre les priorités et suit les files
d'attente de son tenant. Le technicien consulte les interventions qui lui sont
affectées et met à jour leur avancement. Un compte tiers de reporting lit les
données du tenant prévu dans son identité, sans modifier les interventions.

Le support a besoin d'un identifiant de corrélation pour un échec ; il n'a pas
besoin du jeton d'authentification. Les développeurs Front-End souhaitent des
erreurs structurées et des formats stables. Les développeurs Back-End souhaitent
des validations et transitions communes, au lieu d'exceptions par interface.

## Processus

Une demande décrit un problème sur un site connu. Le planificateur vérifie la
file, affecte un technicien habilité, puis le technicien commence et termine
l'intervention. Le demandeur peut annuler tant que le travail n'a pas commencé.
L'historique sert à expliquer chaque changement ; ce n'est pas un journal de
débogage. Une correction d'affectation et le changement de statut associé doivent
apparaître comme une seule décision métier cohérente.

## Applications et consommateurs

Portail Client 1.8, encore utilisé par douze tenants, lit la v1 par un adaptateur.
Console Ops 2.4, application Web récente, affiche la file et affecte les travaux.
Terrain 0.9, interface Web mobile, suit les interventions affectées. Export BI
0.6 exécute des lectures v1 chaque nuit. Le service API et PostgreSQL sont partagés.
Le fournisseur d'identité délivre l'identité validée en amont des opérations métier.

## Glossaire de travail

« Demande » et « intervention » désignent ici la même ressource métier ; le libellé
de l'écran varie avec l'étape. « Assignée » signifie qu'un technicien a été choisi,
pas qu'il a commencé. « Fermée » dans l'ancien portail désigne historiquement une
demande terminée ; l'annulation doit rester distinguable dans la nouvelle cible.
Une « version » peut désigner le contrat ou l'état d'une ressource : votre dossier
doit éviter cette confusion. Un identifiant technique est opaque ; on ne déduit
ni date ni ordre chronologique de son nom.
