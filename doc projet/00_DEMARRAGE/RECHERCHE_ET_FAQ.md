# Ressources de recherche et questions pratiques

## Références gratuites et primaires

Consultées le 27 octobre 2026 pour cette édition :

- [HTTP Semantics — RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) : méthodes (§9), préconditions (§13), statuts (§15).
- [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html) : structure, paramètres, réponses, Schema Object.
- [JSON Schema 2020-12, validation](https://json-schema.org/draft/2020-12/json-schema-validation) : types, required, enum, bornes et formats.

Les rappels locaux permettent de démarrer sans réseau. Ces liens servent à
approfondir et à justifier ; aucune inscription payante n'est requise. Relever
le passage réellement utilisé, pas seulement la page d'accueil d'un outil.

## Fiches de recherche

HTTP : rechercher les propriétés safe/idempotent, comparer lecture et action,
puis analyser les effets d'un préchargement de lien. JSON Schema : comparer
required et null, tester une propriété absente puis présente avec null. OpenAPI :
suivre une référence de réponse jusqu'au schéma, puis confronter un exemple au
schéma résolu. Sécurité : dessiner la source de l'identité et repérer chaque valeur
que le navigateur peut falsifier. Migration : lister les consommateurs avant de
supprimer un champ et écrire un contrat ancien/nouveau pour chacun.

## FAQ étudiante

Faut-il installer une base ? Non, données et captures suffisent. Peut-on faire un
prototype ? Oui, facultatif, sans remplacer les documents. Faut-il résoudre chaque
ambiguïté comme le formateur ? Non, les compromis défendables sont acceptés.
Peut-on changer les routes ? Oui, à condition d'expliquer la compatibilité.

L'OpenAPI initial doit-il être conservé ? Conserver les sources et produire votre
contrat séparément. Un YAML écrit avec des accolades est-il accepté ? Oui : la
syntaxe JSON est compatible avec YAML 1.2 ; la validité sémantique reste à vérifier.
Un validateur qui dit « OK » suffit-il ? Non, vérifier règles métier et états Front.

Que faire si les pièces divergent ? Dater, recouper, utiliser les besoins actuels,
puis formaliser une hypothèse pour le reste. Peut-on échanger avec un autre étudiant ?
Oui, expliquer ses apports et écrire son propre dossier. L'IA est-elle autorisée ?
Oui, avec déclaration et responsabilité personnelle. Faut-il attendre un retour
du formateur entre deux jalons ? Non : les hypothèses explicites permettent
d'avancer sans disponibilité particulière après la séance.
