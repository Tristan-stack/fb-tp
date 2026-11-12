"""Contrôle le contrat OpenAPI, les exemples JSON et le catalogue du dossier.

Usage : python controle_contrat.py <dossier du rendu>

Le script vérifie la forme du contrat et des exemples. Il ne vérifie ni les droits,
ni les transitions, ni le comportement d'un serveur : aucun serveur n'existe.
"""
import datetime
import json
import pathlib
import platform
import re
import sys
from importlib.metadata import version

import yaml
from jsonschema import Draft202012Validator
from openapi_spec_validator import OpenAPIV31SpecValidator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012

# Chaque exemple, le schéma qu'il doit suivre, et ce qu'on attend :
#   None                 l'exemple suit le schéma ;
#   ("champ", "règle")   l'exemple est refusé par le schéma, par cette règle et aucune autre ;
#   "métier : ..."       l'exemple suit le schéma, c'est une règle métier qui le refuse
#                        (le script ne peut pas le vérifier sans serveur) ;
#   "v1"                 exemple de l'ancienne API, hors de ce contrat : seulement lu.
EXEMPLES = [
    ("creation-requete-valide.json", "InterventionCreation", None),
    ("creation-reponse-201.json", "Intervention", None),
    ("creation-requete-titre-court.json", "InterventionCreation", ("title", "minLength")),
    ("creation-reponse-422.json", "Probleme", None),
    ("creation-reponse-403.json", "Probleme", None),
    ("detail-reponse-200.json", "Intervention", None),
    ("detail-reponse-404.json", "Probleme", None),
    ("detail-reponse-401.json", "Probleme", None),
    ("liste-reponse-200.json", "ListeInterventions", None),
    ("liste-reponse-200-vide.json", "ListeInterventions", None),
    ("liste-reponse-422.json", "Probleme", None),
    ("modification-requete-valide.json", "InterventionModification", None),
    ("modification-reponse-200.json", "Intervention", None),
    ("modification-requete-null.json", "InterventionModification", ("title", "type")),
    ("affectation-requete-valide.json", "Affectation", None),
    ("affectation-reponse-200.json", "Intervention", None),
    ("affectation-requete-autre-tenant.json", "Affectation", "métier : technicien d'un autre tenant (R05)"),
    ("affectation-reponse-422.json", "Probleme", None),
    ("affectation-reponse-412.json", "Probleme", None),
    ("transition-requete-valide.json", "Transition", None),
    ("transition-reponse-200.json", "Intervention", None),
    ("transition-reponse-409.json", "Probleme", None),
    ("historique-reponse-200.json", "Historique", None),
    ("historique-reponse-404.json", "Probleme", None),
    ("v1-detail-reponse-200.json", None, "v1"),
]
METHODES = ("get", "post", "put", "patch", "delete")

echecs = []


def note(ok, texte):
    print(f"   {'ok   ' if ok else 'ÉCHEC'} {texte}")
    if not ok:
        echecs.append(texte)


def parcourir(noeud, chemin=""):
    """Rend chaque (chemin, clé, valeur) du document."""
    if isinstance(noeud, dict):
        for cle, valeur in noeud.items():
            yield chemin, cle, valeur
            yield from parcourir(valeur, f"{chemin}/{cle}")
    elif isinstance(noeud, list):
        for i, valeur in enumerate(noeud):
            yield from parcourir(valeur, f"{chemin}/{i}")


def suivre(document, pointeur):
    noeud = document
    for morceau in pointeur.lstrip("#/").split("/"):
        noeud = noeud[morceau.replace("~1", "/").replace("~0", "~")]
    return noeud


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.stdout.reconfigure(encoding="utf-8")
    dossier = pathlib.Path(sys.argv[1])
    contrat = yaml.safe_load((dossier / "Contrat_API.yaml").read_text(encoding="utf-8"))

    print("Contrôle de Contrat_API.yaml, de Exemples_JSON/ et de Catalogue_REST.md")
    print(f"Lancé le {datetime.date.today().isoformat()} avec Python {platform.python_version()},"
          f" PyYAML {version('PyYAML')}, openapi-spec-validator {version('openapi-spec-validator')},"
          f" jsonschema {version('jsonschema')}")
    print()

    print("1. Lecture du YAML")
    note(contrat.get("openapi") == "3.1.0", f"version déclarée : {contrat.get('openapi')!r} (attendu '3.1.0', en texte)")
    codes = [c for _, cle, v in parcourir(contrat) if cle == "responses" and isinstance(v, dict) for c in v]
    codes = [c for c in codes if str(c).isdigit()]
    note(all(isinstance(c, str) for c in codes), f"{len(codes)} codes de réponse, tous lus comme du texte")
    interdits = [f"{chemin}/{cle}" for chemin, cle, _ in parcourir(contrat) if cle == "nullable"]
    note(not interdits, f"aucun mot-clé nullable (ignoré en OpenAPI 3.1) : {len(interdits)} trouvé(s)")
    print()

    print("2. Références internes et fichiers d'exemple cités")
    refs = [v for _, cle, v in parcourir(contrat) if cle == "$ref"]
    cassees = []
    for ref in refs:
        try:
            suivre(contrat, ref)
        except (KeyError, TypeError):
            cassees.append(ref)
    note(not cassees, f"{len(refs)} références, {len(cassees)} cassée(s) {cassees or ''}")
    cites = sorted({v for _, cle, v in parcourir(contrat) if cle == "externalValue"})
    absents = [c for c in cites if not (dossier / c).is_file()]
    note(not absents, f"{len(cites)} fichiers d'exemple cités par le contrat, {len(absents)} absent(s) {absents or ''}")
    operations = sorted(f"{m.upper()} {route}" for route, objet in contrat["paths"].items()
                        for m in objet if m in METHODES)
    print(f"         {len(operations)} opérations décrites :")
    for operation in operations:
        print(f"            {operation}")
    print()

    print("3. Structure OpenAPI 3.1 (openapi-spec-validator, validateur 3.1)")
    if cassees:
        note(False, "structure non contrôlée : corriger d'abord les références cassées")
    else:
        erreurs = list(OpenAPIV31SpecValidator(contrat).iter_errors())
        note(not erreurs, f"structure valide : {len(erreurs)} erreur(s)")
        for e in erreurs[:10]:
            print(f"         {'/'.join(map(str, e.path))} : {e.message[:150]}")
    print()

    print("4. Exemples contre les schémas du contrat")
    formats = sorted(Draft202012Validator.FORMAT_CHECKER.checkers)
    print(f"         formats réellement vérifiés : {', '.join(formats)}")
    note("date-time" in formats, "le format date-time est vérifié")
    registre = Registry().with_resource("urn:contrat", Resource.from_contents(contrat, default_specification=DRAFT202012))
    presents = sorted(p.name for p in (dossier / "Exemples_JSON").glob("*.json"))
    prevus = sorted(nom for nom, _, _ in EXEMPLES)
    note(presents == prevus, f"{len(presents)} fichiers dans Exemples_JSON/, {len(prevus)} prévus par ce script")
    non_cites = [p for p in presents if f"Exemples_JSON/{p}" not in cites]
    print(f"         exemples non cités par le contrat (requêtes refusées, v1) : {', '.join(non_cites)}")
    for nom, schema, attendu in EXEMPLES:
        exemple = json.loads((dossier / "Exemples_JSON" / nom).read_text(encoding="utf-8"))
        if attendu == "v1":
            note(True, f"{nom} : JSON lisible ; ancienne API, hors de ce contrat, non comparé à un schéma")
            continue
        validateur = Draft202012Validator({"$ref": f"urn:contrat#/components/schemas/{schema}"},
                                          registry=registre,
                                          format_checker=Draft202012Validator.FORMAT_CHECKER)
        try:
            trouves = [("/".join(map(str, e.path)), e.validator) for e in validateur.iter_errors(exemple)]
        except Exception as erreur:  # une référence cassée empêche de lire le schéma
            note(False, f"{nom} : schéma {schema} illisible ({type(erreur).__name__})")
            continue
        if attendu is None:
            note(not trouves, f"{nom} suit {schema} {trouves or ''}")
        elif isinstance(attendu, tuple):
            note(trouves == [attendu], f"{nom} est refusé par {schema}, par une seule règle : {trouves}")
        else:
            note(not trouves, f"{nom} suit {schema} ; refus {attendu}, non vérifiable sans serveur {trouves or ''}")
    print()

    print("5. Routes du catalogue et routes du contrat")
    catalogue = (dossier / "Catalogue_REST.md").read_text(encoding="utf-8")
    dans_catalogue = sorted(set(re.findall(r"^\| [^|]+ \| `((?:GET|POST|PUT|PATCH|DELETE) /[^`]*)` \|", catalogue, flags=re.M)))
    note(dans_catalogue == operations, f"{len(dans_catalogue)} opérations dans le tableau du catalogue, {len(operations)} dans le contrat")
    for seule in sorted(set(dans_catalogue) ^ set(operations)):
        print(f"         présente d'un seul côté : {seule}")
    print()

    if echecs:
        print(f"Bilan : {len(echecs)} ÉCHEC(S).")
        sys.exit(1)
    print("Bilan : tout passe. Limite : contrôle statique, sans serveur.")


if __name__ == "__main__":
    main()
