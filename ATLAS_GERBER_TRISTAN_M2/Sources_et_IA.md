# Sources et usage de l'IA

Tristan Gerber, dossier ATLAS. « Je » désigne l'étudiant, « l'outil » l'assistant d'IA.

## Sources

| Source | Auteur ou organisme | Référence | Consultée le | Décision éclairée |
|---|---|---|---|---|
| Kit ATLAS, 45 fichiers fictifs | Ynov Campus / Ynov Strasbourg | Kit distribué le 27/10/2026 | 27/10/2026 | Tout le dossier |
| RFC 9110, HTTP Semantics | IETF (R. Fielding, M. Nottingham, J. Reschke) | https://www.rfc-editor.org/rfc/rfc9110.html, sections 15.5.5, 13.1.1 et 9.2.2 | 12/11/2026 | Décision 2 (404 commun), décision 3 (`If-Match`), décision 6 (`PUT` idempotent) |
| RFC 6585, Additional HTTP Status Codes | IETF (M. Nottingham, R. Fielding) | https://www.rfc-editor.org/rfc/rfc6585.html, section 3 | 12/11/2026 | Décision 3 (statut 428) |
| RFC 9457, Problem Details for HTTP APIs | IETF (M. Nottingham, E. Wilde, S. Dalal) | https://www.rfc-editor.org/rfc/rfc9457.html, section 3 | 12/11/2026 | Décision 2 (forme des erreurs) |
| RFC 7396, JSON Merge Patch | IETF (P. Hoffman, J. Snell) | https://www.rfc-editor.org/rfc/rfc7396.html, section 1 | 12/11/2026 | Décision 6 (modification partielle) |

Je relis chaque passage sur la page avant de le citer.

## Usage de l'IA

**Outil.** Claude Code (Anthropic) dans VS Code, modèle Claude Fable 5 depuis le 10/11/2026.

**Répartition.** Je tranche les choix importants : priorités de l'audit, hypothèses, décisions
techniques. L'outil présente les preuves et les options. Je rédige en priorité ; l'outil rédige aussi
par moments. L'outil relit et je valide chaque étape avant la suivante. Les parties mécaniques
(contrat YAML, exemples, scripts de contrôle) sont écrites par moi et l'outil au besoin, qui me les
explique si fait par lui.

**Données.** L'outil a reçu le kit fictif et ce dossier, aucune donnée réelle de client ou de tiers.
Il tourne sur mon poste : il en voit des informations techniques et connaît mon nom.

**Usages.** L'outil a produit un premier dossier le 27/10/2026 : j'en ai relu le registre et je l'ai
abandonné le 10/11/2026, rien n'en est conservé (voir « Erreurs »). Depuis, il a inventorié les pièges
du sujet et préparé le plan de travail, `README.md` et ce fichier. J'ai validé le plan et repris ce
fichier. Pour l'audit, l'outil a relu le kit, relevé les preuves, puis rédigé les 14 fiches de
l'annexe A et les trois scripts de contrôle. J'ai validé l'échelle de gravité, le classement et les
hypothèses qu'il proposait. J'ai relu l'annexe, je l'ai raccourcie, et j'ai rédigé l'échelle de gravité et la vue d'ensemble.
Pour les décisions, l'outil a proposé sept choix avec leurs autres options. Je les ai retenus ainsi que structurer le document avec chaque partie, et il
a rédigé `Decisions_Techniques.md`. Pour la création et le détail, l'outil a écrit le contrat, huit
exemples, le catalogue, cinq scénarios et le script qui contrôle le contrat et les exemples. Il a
ensuite écrit, sur le même modèle, les cinq autres opérations, leurs exemples et les sept scénarios
restants, puis je me suis chargé de l'archi et les trois schémas que l'outil a ensuite corrigés et simplifiés.
J'ai ensuite structuré les parties du rapport avec chacune leur but et un court résumé de ce qui doit y être et l'outil a ensuite rédigé le rapport en dix parties et le registre de risques.
L'outil a enfin écrit les cinq diapositives et produit les trois PDF. Il a regardé chaque page et
rejoué les quatre contrôles depuis une copie du dossier. À ma demande, il a ensuite refait la mise en
page des trois PDF et les couleurs des schémas, dans le style de shadcn/ui.

## Erreurs trouvées et corrigées

1. **Déclaration IA inexacte.** Le 10/11/2026, j'ai relevé dans le registre du premier passage :
   « Seul le kit fictif lui a été transmis, aucune donnée réelle. » C'est inexact : l'outil voit aussi
   mon poste et connaît mon nom. La voix passive du registre m'attribuait aussi des contrôles faits
   par l'outil. Correction : premier passage abandonné ; ce fichier dit qui a fait quoi.
2. **Un validateur qui laisse passer une date fausse.** Le 12/11/2026, le contrôle du schéma n'a pas
   signalé la date « 20/10/2026 10:00 » de I101 : jsonschema 4.26.0 ne vérifie pas le format
   `date-time` sans le paquet rfc3339-validator. Correction : j'ai installé le paquet, et le script
   affiche les formats vraiment vérifiés et contrôle aussi les dates lui-même.

## Pairs

Contributions de pairs
J'ai travaillé avec Jeremy Deveney pour comprendre le dossier et ses enjeux. Chacun a ensuite pris ses propres décisions et rédigé son propre rendu.

## Limites

L'outil lit les pages web par extraits : je relis donc chaque passage cité.
