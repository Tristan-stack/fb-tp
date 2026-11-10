# Exemple ADR — catalogue de bibliothèque

Contexte : deux clients du catalogue ne peuvent migrer la même semaine.
Options : remplacement immédiat, conversion dans chaque écran, adaptateur de
compatibilité au point d'entrée. Choix illustratif : adaptateur temporaire pour
l'ancien format, nouvelle version pour les nouveaux clients.

Justification : une seule conversion maintenue réduit le nombre de traductions
divergentes ; la nouvelle forme reste cohérente. Conséquences : tests de deux
contrats et coût transitoire d'exploitation. Risque : oubli du retrait. Critère
de réexamen : absence de trafic ancien constatée et confirmation des propriétaires
des clients. Preuve à fournir : une paire d'exemples avant/après et un test de
non-régression. Ce choix est un exemple de raisonnement, pas une architecture
imposée à ATLAS.
