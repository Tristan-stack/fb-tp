"""Compare les données v1 du kit ATLAS au schéma publié par le wiki.

Usage : python controle_donnees_v1.py <dossier du kit>

Le script lit le kit et ne modifie rien. Il vérifie la forme des objets fournis.
Il ne dit rien du comportement du vrai serveur.
"""
import datetime
import json
import pathlib
import platform
import re
import sys
from collections import Counter, defaultdict
from importlib.metadata import version

from jsonschema import Draft202012Validator

INSTANT_UTC = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")
STATUTS_P03 = ["NEW", "ASSIGNED", "IN_PROGRESS", "DONE", "CANCELLED"]


def lire(chemin):
    return json.loads(chemin.read_text(encoding="utf-8"))


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.stdout.reconfigure(encoding="utf-8")
    ressources = pathlib.Path(sys.argv[1]) / "03_RESSOURCES"
    schema = lire(ressources / "schemas" / "intervention-v1.schema.json")
    interventions = lire(ressources / "json" / "interventions.json")
    detail = lire(ressources / "json" / "detail-reponse.json")
    objets = [(f"json/interventions.json {o['id']}", o) for o in interventions]
    objets.append((f"json/detail-reponse.json {detail['id']}", detail))

    print("Contrôle des données v1 contre schemas/intervention-v1.schema.json")
    print(f"Lancé le {datetime.date.today().isoformat()} avec Python {platform.python_version()}"
          f" et jsonschema {version('jsonschema')}")
    print()

    print("1. Forme des objets (types, champs obligatoires, valeurs permises)")
    structure = Draft202012Validator(schema)
    total = conformes = 0
    for nom, objet in objets:
        ecarts = sorted(structure.iter_errors(objet), key=lambda e: list(e.path))
        total += len(ecarts)
        conformes += not ecarts
        print(f"   {nom} : {'conforme' if not ecarts else str(len(ecarts)) + ' écart(s)'}")
        for e in ecarts:
            print(f"      {'/'.join(map(str, e.path)) or '(racine)'} : {e.message}")
    print(f"   Bilan : {conformes} objet(s) conforme(s) sur {len(objets)}, {total} écarts.")
    print()

    print("2. Format des dates : ce que jsonschema vérifie vraiment sur ce poste")
    formats = sorted(Draft202012Validator.FORMAT_CHECKER.checkers)
    print("   Formats vérifiés :", ", ".join(formats))
    if "date-time" in formats:
        print("   date-time est vérifié (paquet rfc3339-validator présent).")
    else:
        print("   date-time N'EST PAS vérifié : il manque le paquet rfc3339-validator.")
    avec_formats = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
    for nom, objet in objets:
        valeur = objet.get("createdAt")
        signale = any(list(e.path) == ["createdAt"] for e in avec_formats.iter_errors(objet))
        correct = bool(INSTANT_UTC.match(str(valeur)))
        print(f"   {nom} : createdAt = {valeur!r} ; instant UTC complet : {'oui' if correct else 'NON'}"
              f" ; signalé par jsonschema : {'oui' if signale else 'non'}")
    print("   « instant UTC complet » est contrôlé par ce script (AAAA-MM-JJTHH:MM:SSZ), pour ne pas")
    print("   dépendre de ce que jsonschema vérifie ou non.")
    print()

    print("3. Faits relevés dans json/interventions.json")
    par_tenant = Counter(o["tenantId"] for o in interventions)
    print(f"   Interventions : {len(interventions)} en tout ; par tenant :",
          ", ".join(f"{t} = {n}" for t, n in sorted(par_tenant.items())))
    print("   Type de priority :",
          ", ".join(f"{o['id']} = {o['priority']!r} ({type(o['priority']).__name__})" for o in interventions))
    statuts = sorted({o["status"] for o in interventions})
    print("   Statuts présents :", ", ".join(statuts))
    print("   Statuts du schéma publié :", ", ".join(schema["properties"]["status"]["enum"]))
    print("   Statuts de la fiche produit (P03 R04) :", ", ".join(STATUTS_P03))
    par_date = defaultdict(list)
    for o in interventions:
        par_date[o["createdAt"]].append(o["id"])
    for date, ids in par_date.items():
        if len(ids) > 1:
            print(f"   Même createdAt ({date}) : {', '.join(ids)}")
    for o in interventions:
        if o["revision"] > 1 and o["createdAt"] == o["updatedAt"]:
            print(f"   {o['id']} : révision {o['revision']} alors que updatedAt est égal à createdAt")
    sans = [o["id"] for o in interventions if o["technicianId"] is None]
    print("   technicianId à null :", ", ".join(sans))


if __name__ == "__main__":
    main()
