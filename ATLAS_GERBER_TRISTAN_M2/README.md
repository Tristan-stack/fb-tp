# ATLAS — audit et contrat d'intégration

Dossier individuel de Tristan Gerber, Mastère 2 Informatique (Innov Campus / Ynov Strasbourg).
Mission de coordination Front-End / Back-End, à remettre le 17 novembre 2026.

Ce fichier est l'index du dossier.

## Livrables

| Livrable | Chemin | Contenu |
|---|---|---|
| Index, ordre de lecture, prérequis et commandes | `README.md` | ce fichier |
| Rapport d'audit | [Rapport_Audit.pdf](Rapport_Audit.pdf) | les dix parties, puis l'annexe A (14 constats) et l'annexe B (dix risques) |
| Architecture et responsabilités | [Architecture.pdf](Architecture.pdf) | l'existant, la cible, un échange HTTP, qui fait quoi, les données, la migration |
| Catalogue REST | [Catalogue_REST.md](Catalogue_REST.md) | les sept opérations, les droits, les états d'écran, la correspondance v1 |
| Contrat d'API, OpenAPI 3.1 | [Contrat_API.yaml](Contrat_API.yaml) | sept opérations : les six de la mission et la route de transition |
| Exemples de requêtes et de réponses | [Exemples_JSON/](Exemples_JSON/) | 25 exemples : succès, refus, et un exemple v1 |
| Scénarios, contrôles et sorties | [Tests_et_Validations/](Tests_et_Validations/) | [Scenarios.md](Tests_et_Validations/Scenarios.md) : les douze scénarios ; quatre contrôles |
| Décisions techniques | [Decisions_Techniques.md](Decisions_Techniques.md) | six décisions |
| Sources et usage de l'IA | [Sources_et_IA.md](Sources_et_IA.md) | les sources, qui a fait quoi, les erreurs corrigées |
| Support de présentation | [Presentation.pdf](Presentation.pdf) | cinq diapositives, pour l'oral |

Les sources des trois PDF sont dans [Sources_PDF/](Sources_PDF/). Les PDF sont imprimés avec Chrome à
partir de ces sources.

## Ordre de lecture

1. `Rapport_Audit.pdf` : le résumé du dossier. Les deux annexes sont à la fin.
2. `Architecture.pdf`.
3. `Decisions_Techniques.md`.
4. `Catalogue_REST.md`, puis `Contrat_API.yaml` et `Exemples_JSON/`.
5. `Tests_et_Validations/Scenarios.md`, puis les sorties des contrôles.
6. `Sources_et_IA.md`.

## Prérequis et commandes

Outils utilisés : Python 3.13.2 avec jsonschema 4.26.0, rfc3339-validator 0.1.4, PyYAML 6.0.3 et
openapi-spec-validator 0.9.0, et Node.js 24.11.1.

Le kit ATLAS n'est pas dans ce dossier. Les scripts le lisent sans le modifier. Son emplacement est
donné en argument : ici `../doc projet`, à remplacer par l'endroit où se trouve le kit.

Commandes lancées le 12/11/2026, depuis ce dossier :

```
python Tests_et_Validations/outils/controle_donnees_v1.py "../doc projet"
node Tests_et_Validations/outils/date_i101.mjs "../doc projet"
node Tests_et_Validations/outils/reproduire_extraits.mjs "../doc projet"
python Tests_et_Validations/outils/controle_contrat.py .
```

| Script | Ce qu'il fait | Résultat | Sortie |
|---|---|---|---|
| `controle_donnees_v1.py` | Compare les six objets du kit au schéma publié | Aucun n'est conforme, 17 écarts. Le script affiche aussi quels formats de date sont vraiment vérifiés. | [controle_donnees_v1.txt](Tests_et_Validations/sorties/controle_donnees_v1.txt) |
| `date_i101.mjs` | Cherche quel instant donne la date de I101 | 08:00 UTC affiché à l'heure de Paris. Compatible, pas prouvé. | [date_i101.txt](Tests_et_Validations/sorties/date_i101.txt) |
| `reproduire_extraits.mjs` | Fait tourner les extraits de code du kit avec de fausses dépendances, sur 11 cas | C'est une simulation : elle montre ce que le code permet, pas ce que fait le vrai serveur. | [reproduire_extraits.txt](Tests_et_Validations/sorties/reproduire_extraits.txt) |
| `controle_contrat.py` | Vérifie le contrat (OpenAPI 3.1, références), chaque exemple contre son schéma, et les routes du catalogue | Tout passe. Contrôle statique, sans serveur. | [controle_contrat.txt](Tests_et_Validations/sorties/controle_contrat.txt) |

## Pièces du sujet

Les pièces du kit ATLAS ne sont pas recopiées dans ce dossier. Elles sont citées par leur identifiant
(P01 à P09 pour le dossier client) et par leur nom de fichier dans le kit distribué le 27 octobre 2026.
