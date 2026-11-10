# P03 — Fiche produit de référence

Direction produit · 23 octobre 2026 · version métier 2.0 approuvée pour la mission.
Ces exigences priment sur les notes historiques ; les mécanismes techniques restent
à concevoir et doivent être argumentés. Les termes DOIT et PEUT sont des priorités
du scénario, pas des obligations réglementaires générales.

## Règles fonctionnelles

| ID | Exigence et exemple d'acceptation |
|---|---|
| R01 | Une intervention a un identifiant opaque stable, un tenant, un site, un titre, une priorité, un statut, une affectation éventuelle et des dates non ambiguës. Le même identifiant se retrouve dans détail et historique. |
| R02 | Le titre doit contenir 5 à 120 caractères après suppression des espaces aux extrémités. Priorité : LOW, NORMAL ou HIGH. L'absence de priorité à la création vaut NORMAL. Un titre composé d'espaces est refusé. |
| R03 | Création : statut NEW, aucun technicien. Les valeurs de tenant, statut, auteur, dates et révision sont déterminées par le serveur. Un client ne peut pas s'attribuer un autre tenant. |
| R04 | Cycle : NEW vers ASSIGNED par affectation ; NEW ou ASSIGNED vers CANCELLED ; ASSIGNED vers IN_PROGRESS ; IN_PROGRESS vers DONE. Aucun retour arrière. Les états DONE et CANCELLED sont terminaux. |
| R05 | Un planificateur peut affecter ou réaffecter un technicien actif du même tenant à une demande NEW ou ASSIGNED. Impossible d'affecter un technicien inactif, d'un autre tenant ou un travail commencé. Une affectation réussie implique ASSIGNED. |
| R06 | Demandeur : lecture du tenant, création, correction titre/priorité en NEW, annulation en NEW ou ASSIGNED. Planificateur : lecture du tenant, création, correction titre/priorité en NEW ou ASSIGNED, affectation, annulation avant démarrage. Technicien : lecture et historique de ses seules affectations, transitions ASSIGNED → IN_PROGRESS → DONE. Tiers : lectures du tenant uniquement. |
| R07 | Une requête sur une ressource étrangère au tenant ne révèle ni existence ni contenu. Une identité absente/invalide et un droit insuffisant sur une ressource visible sont des situations distinctes. |
| R08 | Recherche par statut exact et site ; plusieurs filtres se combinent par ET. Une file vide est un résultat de lecture normal. Toute liste doit être bornée et ordonnée de façon déterministe, même quand plusieurs créations ont la même date. |
| R09 | Historique : un événement à la création, puis un par mutation effective, avec acteur, instant UTC, type et révision. Les tentatives échouées ne modifient pas l'historique métier. Un client ne peut écrire cet historique. |
| R10 | Deux utilisateurs peuvent modifier le même état. Le dernier envoi ne doit pas effacer silencieusement une modification intervenue depuis sa lecture. Le consommateur doit savoir comment reprendre après conflit. |
| R11 | Une modification partielle distingue « conserver l'affectation » et « changer l'affectation ». Le retrait sans remplacement d'un technicien n'est pas une fonctionnalité demandée. Les règles sur null et champ absent doivent être explicites. |
| R12 | Sites et techniciens de référence sont fournis localement. Aucun écran ne doit inventer une association en joignant des identifiants provenant d'un autre tenant. L'API contrôle ces relations. |

## Exigences non fonctionnelles

N01 — Maintenir les formats et routes v1 utilisés par Portail 1.8 et Export BI
pendant une période de transition fictive allant jusqu'au 31 janvier 2027. Des
restrictions de sécurité sont permises et doivent être annoncées. Aucun arrêt
global n'est acceptable. La date de retrait reste une proposition opérationnelle
à confirmer par ATLAS ; elle ne change pas la remise étudiante.

N02 — Les échanges cibles doivent être documentés, versionnés et vérifiables sans
accès à la base. Un développeur Front-End doit préparer ses états d'écran avec
les seules réponses et erreurs du contrat. Les exemples doivent couvrir tous les
types de consommateurs ; le socle d'évaluation reste les six opérations définies
dans la mission.

N03 — Ne pas journaliser les jetons ni les textes libres complets. Les historiques
ne doivent contenir que les données utiles au suivi. Les durées de conservation
du scénario sont 12 mois pour l'historique métier et 30 jours pour les journaux
techniques, puis purge ou anonymisation selon décision interne. Ce sont des
hypothèses de politique ATLAS, pas des délais légaux. Une revue réelle avec le
responsable de la protection des données serait nécessaire avant exploitation.

N04 — Objectif de lecture : réponse inférieure à 500 ms au 95e percentile pour une
page de 20 interventions sur les volumes annoncés. Dans ce projet, proposer une
méthode de mesure et les facteurs de coût suffit ; aucune infrastructure n'est
fournie pour en apporter la preuve. Ne pas transformer un objectif en résultat mesuré.

N05 — Le dossier doit permettre un développement indépendant. Décrire les règles
qui ne sont pas exprimables par un schéma. Protéger l'isolation, la concurrence et
la cohérence de l'historique dans une transaction. Une prévalidation navigateur
améliore l'ergonomie sans remplacer les validations serveur.

## Points ouverts que le consultant doit décider

Le choix d'une pagination, d'un mécanisme de concurrence et d'une forme d'erreur
n'est pas imposé. Expliquer leurs conséquences. L'idempotence des créations après
une coupure réseau est un approfondissement, pas une condition cachée de réussite.
Les fuseaux horaires d'affichage appartiennent aux interfaces ; les instants
échangés doivent identifier sans ambiguïté la même seconde pour tous.
