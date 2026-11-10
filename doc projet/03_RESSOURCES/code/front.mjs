// Extrait Console Ops 2.4. api et sql sont des dépendances simulées.
export async function load(api, sql, siteId) {
  const response = await api('/api/interventions?page=0&size=20');
  const items = await response.json();
  return items.map(x => ({ ...x, visible: x.siteId === siteId }));
}
export async function fastList(sql, tenant) {
  return sql.query('SELECT * FROM interventions WHERE tenant_id = $1', [tenant]);
}
export async function create(api, form) {
  if (form.title.trim().length < 5) throw new Error('Titre trop court');
  const response = await api('/api/interventions', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: form.title, siteId: form.siteId, priority: 'HIGH' })
  });
  const body = await response.json();
  return body.id;
}
