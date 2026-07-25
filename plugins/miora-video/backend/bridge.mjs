/**
 * Canvas-to-worker bridge contract.
 *
 * The host will start this bridge in a separate Node process and exchange
 * JSON-line messages. The implementation is intentionally isolated from the
 * Canvas web server so provider browser automation cannot access the UI
 * process or another plugin's secrets.
 */
export const bridgeContract = {
  service: 'http://127.0.0.1:5210',
  operations: ['health', 'accounts', 'refreshCredits', 'createTask', 'listTasks']
};

export async function invoke(operation, payload = {}, fetchImpl = fetch) {
  const routes = {
    health: ['GET', '/api/health'],
    accounts: ['GET', '/api/accounts'],
    refreshCredits: ['POST', `/api/accounts/${encodeURIComponent(payload.accountId)}/refresh-credits`],
    createTask: ['POST', '/api/tasks'],
    listTasks: ['GET', '/api/tasks']
  };
  const route = routes[operation];
  if (!route) throw new Error(`Unsupported bridge operation: ${operation}`);
  const [method, path] = route;
  const response = await fetchImpl(`${bridgeContract.service}${path}`, {
    method,
    headers: method === 'POST' ? { 'content-type': 'application/json' } : undefined,
    body: method === 'POST' ? JSON.stringify(payload) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Miora worker returned HTTP ${response.status}`);
  return data;
}
