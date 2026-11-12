# Sources et usage de l'IA

Tristan Gerber, dossier ATLAS. « Je » désigne l'étudiant, « l'outil » l'assistant d'IA.

## Sources

| Source | Auteur ou organisme | Référence | Consultée le | Décision éclairée |
|---|---|---|---|---|
| Kit ATLAS, 45 fichiers fictifs | Innov Campus / Ynov Strasbourg | Kit distribué le 27/10/2026 | À compléter par moi | Tout le dossier |

Aucune source externe n'est encore citée. Je relis chaque passage sur la page avant de le citer.

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
hypothèses qu'il proposait. J'ai relu l'annexe, je l'ai fait raccourcir, et j'ai rédigé l'échelle de gravité et la vue d'ensemble.
Pour les décisions, l'outil a proposé sept choix avec leurs autres options. Je les ai retenus ainsi que structurer le documents avec chaques parties, et il
a rédigé `Decisions_Techniques.md`. Pour la création et le détail, l'outil a écrit le contrat, huit
exemples, le catalogue, cinq scénarios et le script qui contrôle le contrat et les exemples. Il a
ensuite écrit, sur le même modèle, les cinq autres opérations, leurs exemples et les sept scénarios
restants.

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

À compléter par moi.

## Limites

L'outil lit les pages web par extraits : je relis donc chaque passage cité.
