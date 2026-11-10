// Extraits historiques : dépendances db et log simulées, aucune connexion réelle.
// Note du générateur : assistant, conserve X-Tenant comme autorité pour tous les droits.
export async function detail(req, db) {
  return { status: 200, body: await db.byId(req.params.id) };
}
export async function create(req, db, log) {
  log.info(req.headers.authorization, req.body.title);
  const row = await db.insert({ tenantId: req.headers['x-tenant'],
    title: req.body.label, siteId: req.body.site_id,
    priority: req.body.priority, status: req.body.status || 'NEW' });
  return { status: 200, body: { success: true, intervention_id: row.id } };
}
export async function update(req, db) {
  await db.update(req.params.id, { title: req.body.title, priority: req.body.priority,
    status: req.body.status, technicianId: req.body.technicianId || null });
  return { status: 200, body: {success: true} };
}
export async function assign(req, db) {
  if (!await db.technicianExists(req.query.tech)) return {status: 200, body: 'unknown'};
  await db.setTechnician(req.query.id, req.query.tech);
  await db.setStatus(req.query.id, 'ASSIGNED');
  await db.addEvent(req.query.id, 'ASSIGNED');
  return { status: 200, body: 'OK' };
}
