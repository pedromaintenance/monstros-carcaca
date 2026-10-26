/**
 * Cliente estático para a Carcaça; sem dependências.
 * Uso:
 * const bestiary = createBestiary({
 *   baseUrl: "https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist"
 * });
 * const lista = await bestiary.search({ query: "dragon", edition: "2024" });
 * const ficha = await bestiary.get(lista[0].id);
 */
export function createBestiary({ baseUrl, fetchImpl = fetch }) {
  if (!baseUrl) throw new TypeError("baseUrl é obrigatório");
  const root = baseUrl.replace(/\/+$/, "");
  let manifest;
  let catalog;
  let indexes;
  const segments = new Map();

  async function load(path) {
    const result = await fetchImpl(root + "/" + path);
    if (!result.ok) throw new Error("Falha carregando " + path + ": " + result.status);
    return result.json();
  }
  async function getManifest() {
    return manifest ??= await load("manifest.json");
  }
  async function getCatalog() {
    return catalog ??= await load("catalog.json");
  }
  async function getIndexes() {
    return indexes ??= await load("indexes.json");
  }
  async function getGameData(game = "peren") {
    const m = await getManifest();
    const entry = m.games?.[game];
    if (!entry) return null;
    return load(entry.records);
  }
  async function getPerenLinks() {
    const m = await getManifest();
    return m.games?.peren ? load(m.games.peren.links) : [];
  }

  async function get(id) {
    if (typeof id !== "string" || !id.includes(":")) return null;
    const source = id.split(":")[0];
    const m = await getManifest();
    const filename = m.files[source];
    if (!filename) return null;
    if (!segments.has(source)) segments.set(source, load(filename));
    const records = await segments.get(source);
    return records.find(row => row.id === id) ?? null;
  }
  async function search({ query = "", type, edition, source, crMin, crMax, limit = 50, offset = 0 } = {}) {
    const rows = await getCatalog();
    const norm = text => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const q = norm(query).trim();
    return rows.filter(row =>
      (!q || norm(row.name).includes(q) || norm(row.key).includes(q)) &&
      (!type || row.type === type) &&
      (!edition || row.edition === String(edition)) &&
      (!source || row.source_id === source) &&
      (crMin == null || row.cr >= crMin) &&
      (crMax == null || row.cr <= crMax)
    ).slice(offset, offset + limit);
  }
  return { getManifest, getCatalog, getIndexes, getGameData, getPerenLinks, get, search };
}

/** Rascunho não-balanceado: valores próprios de Peren permanecem em branco. */
export function toPerenDraft(monster) {
  if (!monster?.id) throw new TypeError("Criatura inválida");
  return {
    id: "mob-" + monster.key,
    nome: monster.name,
    categoria: monster.classification?.type_pt ?? monster.classification?.type,
    referencia: monster.name,
    nivel_desafio_dnd: monster.challenge?.rating,
    nivel_jogo: null,
    hp: null, ataque: null, defesa: null, xp: null, ouro: null,
    origem: monster.source?.id,
    origem_id: monster.id,
    icone: null,
    drop_tipo: null,
    necessita_balanceamento: true
  };
}
