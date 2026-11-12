// Cherche quel instant peut donner la date « 20/10/2026 10:00 » de l'intervention I101.
//
// Usage : node date_i101.mjs <dossier du kit>
//
// Le script lit le kit et ne modifie rien. Il teste une hypothèse : il ne prouve pas
// ce que le serveur a réellement stocké.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const kit = process.argv[2];
if (!kit) {
  console.error('Usage : node date_i101.mjs <dossier du kit>');
  process.exit(1);
}

const interventions = JSON.parse(
  readFileSync(join(kit, '03_RESSOURCES', 'json', 'interventions.json'), 'utf8'));
const i101 = interventions.find((x) => x.id === 'I101');
const fuseaux = ['Europe/Paris', 'UTC', 'America/New_York', 'Asia/Tokyo'];
const propre = (texte) => texte.replace(/\s/gu, ' ');
const afficher = (instant, fuseau) => propre(new Intl.DateTimeFormat('fr-FR',
  { timeZone: fuseau, dateStyle: 'short', timeStyle: 'short' }).format(new Date(instant)));

console.log('Date de I101 : quel instant peut donner ce texte ?');
console.log(`Lancé le ${new Date().toISOString().slice(0, 10)} avec Node ${process.versions.node}`
  + ` (ICU ${process.versions.icu}, fuseaux ${process.versions.tz})`);
console.log();
console.log(`createdAt de I101 dans le kit : "${i101.createdAt}"`);
console.log();

const instants = [...new Set(interventions.filter((x) => x.id !== 'I101').map((x) => x.createdAt))];
const trouves = [];
console.log('Les autres createdAt du kit, affichés en français dans quatre fuseaux :');
for (const instant of instants) {
  const qui = interventions.filter((x) => x.createdAt === instant).map((x) => x.id).join(', ');
  console.log(`   ${instant} (${qui})`);
  for (const fuseau of fuseaux) {
    const texte = afficher(instant, fuseau);
    const egal = texte === propre(i101.createdAt);
    if (egal) trouves.push(`${instant} affiché en ${fuseau}`);
    console.log(`      ${fuseau.padEnd(17)} ${texte}${egal ? '   <- identique à I101' : ''}`);
  }
}
console.log();
console.log(`Résultat : ${trouves.length ? trouves.join(' ; ') : 'aucun instant du kit ne donne ce texte'}.`);
console.log('Limite : le texte de I101 n\'a ni secondes ni fuseau. L\'hypothèse est compatible');
console.log('avec les données, elle n\'est pas prouvée.');
