// Fait tourner les extraits de code du kit ATLAS (code/back.mjs et code/front.mjs)
// avec de fausses dépendances, pour voir ce que ce code permet.
//
// Usage : node reproduire_extraits.mjs <dossier du kit>
//
// C'est une SIMULATION. La base, le journal et le réseau sont des doublures écrites ici.
// Le script montre ce que les extraits fournis laissent passer. Il ne prouve pas ce que
// fait le vrai serveur, que personne ne peut interroger. Il lit le kit et ne modifie rien.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inspect } from 'node:util';

const kit = process.argv[2];
if (!kit) {
  console.error('Usage : node reproduire_extraits.mjs <dossier du kit>');
  process.exit(1);
}
const ressources = join(kit, '03_RESSOURCES');
const lireJson = (chemin) => JSON.parse(readFileSync(join(ressources, chemin), 'utf8'));
const back = await import(pathToFileURL(join(ressources, 'code', 'back.mjs')).href);
const front = await import(pathToFileURL(join(ressources, 'code', 'front.mjs')).href);
const techniciens = lireJson('json/techniciens.json');
const montrer = (valeur) => inspect(valeur, { depth: 4, breakLength: Infinity });

// Doublure de la base. Deux choix sont des hypothèses, écrites ici :
// - update ne touche pas un champ reçu à undefined ;
// - technicianExists dit seulement si l'identifiant existe (ticket INC-07).
function fausseBase() {
  const lignes = new Map(lireJson('json/interventions.json').map((x) => [x.id, { ...x }]));
  let prochain = 104;
  return {
    lignes,
    evenements: [],
    panne: null,
    async byId(id) { return lignes.get(id) ?? null; },
    async insert(valeurs) {
      const ligne = { id: `I${prochain++}`, ...valeurs };
      lignes.set(ligne.id, ligne);
      return ligne;
    },
    async update(id, valeurs) {
      this.dernierUpdate = valeurs;
      const ligne = lignes.get(id);
      for (const [cle, valeur] of Object.entries(valeurs)) if (valeur !== undefined) ligne[cle] = valeur;
    },
    async technicianExists(id) { return techniciens.some((t) => t.id === id); },
    async setTechnician(id, tech) { lignes.get(id).technicianId = tech; },
    async setStatus(id, statut) {
      if (this.panne === 'setStatus') throw new Error('panne simulée pendant setStatus');
      lignes.get(id).status = statut;
    },
    async addEvent(...recu) { this.evenements.push(recu); },
  };
}
const fauxJournal = () => ({ lignes: [], info(...recu) { this.lignes.push(recu); } });
const resume = (l) => l && ({ id: l.id, tenantId: l.tenantId, siteId: l.siteId, title: l.title,
  priority: l.priority, status: l.status, technicianId: l.technicianId });

let numero = 0;
function cas(titre) { numero += 1; console.log(`\nCas ${numero} — ${titre}`); }
const ligne = (texte) => console.log(`   ${texte}`);

console.log('Simulation des extraits code/back.mjs et code/front.mjs, avec des doublures');
console.log(`Lancé le ${new Date().toISOString().slice(0, 10)} avec Node ${process.versions.node}`);
console.log('Ce script montre ce que le code fourni permet, pas ce que fait le vrai serveur.');

cas('detail : Lina (C01) demande I200, qui est à C02');
{
  const db = fausseBase();
  const avec = await back.detail({ params: { id: 'I200' },
    headers: { authorization: 'Bearer DEMO-U01-C01', 'x-tenant': 'C01' } }, db);
  const sans = await back.detail({ params: { id: 'I200' },
    headers: { authorization: 'Bearer DEMO-U01-C01' } }, db);
  ligne(`avec X-Tenant: C01 -> statut ${avec.status}, tenantId reçu : ${avec.body.tenantId}`);
  ligne(`sans X-Tenant      -> statut ${sans.status}, tenantId reçu : ${sans.body.tenantId}`);
  ligne('Le résultat est le même : detail ne lit ni l\'identité ni X-Tenant.');
}

cas('create : le tenant et le statut viennent de la requête');
{
  const db = fausseBase();
  await back.create({ headers: { authorization: 'Bearer DEMO-U01-C01', 'x-tenant': 'C02' },
    body: { label: 'Demande test', site_id: 'S01', status: 'DONE' } }, db, fauxJournal());
  ligne(`ligne créée : ${montrer(resume(db.lignes.get('I104')))}`);
  ligne('Jeton de Lina (C01), mais tenant C02, statut DONE, et un site de C01.');
}

cas('create depuis le formulaire de la console (front.create puis back.create)');
{
  const db = fausseBase();
  const journal = fauxJournal();
  let envoye;
  const api = async (url, options) => {
    envoye = JSON.parse(options.body);
    const reponse = await back.create({ headers: { authorization: 'Bearer DEMO-U02-C01',
      'x-tenant': 'C01' }, body: envoye }, db, journal);
    return { json: async () => reponse.body };
  };
  const retour = await front.create(api,
    { title: 'Climatisation salle réunion', siteId: 'S01', priority: 'NORMAL' });
  ligne(`saisi dans le formulaire : priorité NORMAL ; envoyé : ${montrer(envoye)}`);
  ligne(`ligne créée : ${montrer(resume(db.lignes.get('I104')))}`);
  ligne(`numéro rendu à l'écran : ${retour}`);
  ligne('Le titre et le site sont perdus, la priorité est forcée, le numéro est undefined.');
  cas('create : ce qui part dans le journal');
  ligne(`journal : ${montrer(journal.lignes)}`);
  ligne('Le jeton et le titre complet sont écrits dans le journal.');
}

cas('update : Nora corrige seulement le titre de I101');
{
  const db = fausseBase();
  ligne(`avant : ${montrer(resume(db.lignes.get('I101')))}`);
  const reponse = await back.update({ params: { id: 'I101' },
    body: { title: 'Climatisation salle réunion étage' } }, db);
  ligne(`valeurs passées à la base : ${montrer(db.dernierUpdate)}`);
  ligne(`après : ${montrer(resume(db.lignes.get('I101')))}`);
  ligne(`réponse : ${reponse.status} ${montrer(reponse.body)}`);
  ligne('Le technicien passe à null. I101 reste ASSIGNED sans technicien.');
}

cas('update et create : aucune règle métier côté serveur');
{
  const db = fausseBase();
  await back.update({ params: { id: 'I103' }, body: { status: 'NEW' } }, db);
  ligne(`I103 était DONE ; après update avec status NEW : ${db.lignes.get('I103').status}`);
  await back.create({ headers: { 'x-tenant': 'C01' }, body: { label: '     ', site_id: 'S01' } },
    db, fauxJournal());
  ligne(`création avec un titre de cinq espaces : ${montrer(resume(db.lignes.get('I104')))}`);
  ligne('Une intervention terminée repart. Un titre fait d\'espaces est accepté, sans priorité par défaut.');
}

cas('assign : technicien d\'un autre client, inactif, inconnu');
for (const tech of ['T02', 'T03', 'T99']) {
  const db = fausseBase();
  const reponse = await back.assign({ query: { id: 'I100', tech } }, db);
  const fiche = techniciens.find((t) => t.id === tech);
  const qui = fiche ? `tenant ${fiche.tenantId}, actif : ${fiche.active}` : 'absent du référentiel';
  ligne(`tech=${tech} (${qui}) -> ${reponse.status} ${montrer(reponse.body)} ; I100 : technicien `
    + `${db.lignes.get('I100').technicianId}, statut ${db.lignes.get('I100').status}`);
}
ligne('T02 (autre client) et T03 (inactif) sont acceptés. Un inconnu reçoit 200 et un texte.');

cas('assign : deux appels identiques, puis une panne au milieu');
{
  const db = fausseBase();
  await back.assign({ query: { id: 'I100', tech: 'T01' } }, db);
  await back.assign({ query: { id: 'I100', tech: 'T01' } }, db);
  ligne(`événements après deux appels identiques : ${montrer(db.evenements)}`);
  ligne('Deux événements pour une seule décision, et aucun acteur dans l\'événement.');
  const db2 = fausseBase();
  db2.panne = 'setStatus';
  let erreur = 'aucune';
  try { await back.assign({ query: { id: 'I102', tech: 'T01' } }, db2); } catch (e) { erreur = e.message; }
  ligne(`panne à la 2e écriture (${erreur}) : I102 a le technicien `
    + `${db2.lignes.get('I102').technicianId}, le statut ${db2.lignes.get('I102').status}, `
    + `${db2.evenements.length} événement`);
  ligne('La demande a un technicien mais reste NEW, sans trace : les écritures ne sont pas liées.');
}

cas('update : deux écrans partent de la même révision de I100');
{
  const db = fausseBase();
  const lue = db.lignes.get('I100').revision;
  const r1 = await back.update({ params: { id: 'I100' },
    body: { title: 'Porte bloquée accueil', priority: 'HIGH' } }, db);
  const r2 = await back.update({ params: { id: 'I100' },
    body: { title: 'Porte accueil à réparer', priority: 'NORMAL' } }, db);
  ligne(`révision lue par les deux écrans : ${lue}`);
  ligne(`écran 1 (priorité HIGH) -> ${r1.status} ; écran 2 (priorité NORMAL) -> ${r2.status}`);
  ligne(`à la fin : priorité ${db.lignes.get('I100').priority}, révision ${db.lignes.get('I100').revision}`);
  ligne('La priorité HIGH est perdue et personne n\'est prévenu. L\'extrait ne compare aucune révision.');
}

cas('front.load : la console lit la liste capturée dans http/liste.http');
{
  const capture = readFileSync(join(ressources, 'http', 'liste.http'), 'utf8').trim().split(/\r?\n/);
  const enveloppe = JSON.parse(capture.at(-1));
  let resultat;
  try {
    resultat = await front.load(async () => ({ json: async () => enveloppe }), null, 'S01');
  } catch (e) { resultat = `${e.name} : ${e.message}`; }
  ligne(`réponse capturée : ${montrer(enveloppe)}`);
  ligne(`front.load -> ${montrer(resultat)}`);
  const lignesSeules = await front.load(async () => ({ json: async () => enveloppe.data }), null, 'S01');
  ligne(`même appel avec le tableau seul, filtre S01 -> ${montrer(lignesSeules)}`);
  ligne('La console plante sur l\'enveloppe. Et sans siteId dans les lignes, le filtre cache tout.');
}

cas('front.fastList : la console interroge la base elle-même');
{
  const sql = { query: (texte, valeurs) => ({ texte, valeurs }) };
  ligne(`appel avec C02 -> ${montrer(await front.fastList(sql, 'C02'))}`);
  ligne('Le tenant est choisi par l\'appelant. La requête est paramétrée : ce n\'est pas une injection.');
}
