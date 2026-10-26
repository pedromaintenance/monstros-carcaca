/**
 * Atlas autoral da Carcaça. Não mistura fichas mecânicas de D&D e Dungeon World.
 * const atlas = createCarcacaAtlas({baseUrl:
 *   "https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"});
 * const creaturas = await atlas.search({tipoCarcaca:"yokai",regiaoId:"regiao:foz-rio-ancestral"});
 */
export function createCarcacaAtlas({baseUrl,fetchImpl=fetch}={}) {
  if(!baseUrl) throw new TypeError("baseUrl é obrigatório");
  const root=baseUrl.replace(/\/+$/, "");
  const cache=new Map();

  async function load(file) {
    if(!cache.has(file)){
      cache.set(file,(async()=>{
        const result=await fetchImpl(root+"/"+file);
        if(!result.ok) throw new Error("Falha ao carregar "+file+": "+result.status);
        return result.json();
      })().catch(err=>{cache.delete(file);throw err;}));
    }
    return cache.get(file);
  }
  async function getManifest(){return load("manifest.json");}
  async function byKey(key){const m=await getManifest();return load(m.arquivos[key]);}
  async function getCatalog(){return byKey("catalog");}
  async function getIndexes(){return byKey("indexes");}
  async function getRegions(){return byKey("regions");}
  async function getPlaces(){return byKey("places");}
  async function getFactions(){return byKey("factions");}
  async function getFronts(){return byKey("fronts");}
  async function getSettlements(){return byKey("settlements");}
  async function getTypes(){return byKey("types");}
  async function get(id) {
    if(typeof id!=="string"||!id.startsWith("carcaca:criatura:"))return null;
    return (await byKey("creatures")).find(item=>item.id===id)??null;
  }
  const norm=(s)=>String(s??"").normalize("NFKD")
     .replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  async function search({query="",tipoCarcaca,tipoDnd,regiaoId,lugarId,faccaoId,
                         estado,ndMin,ndMax,limit=50,offset=0}={}) {
    if(!Number.isInteger(limit)||limit<0||limit>500)throw new RangeError("limit deve ser de 0 a 500");
    if(!Number.isInteger(offset)||offset<0)throw new RangeError("offset inválido");
    const rows=await getCatalog();
    const q=norm(query);
    return rows.filter(row=>
      (!q||norm(row.nome).includes(q)||norm(row.id).includes(q))&&
      (!tipoCarcaca||row.tipo_carcaca===tipoCarcaca)&&
      (!tipoDnd||row.tipo_dnd===tipoDnd)&&
      (!regiaoId||row.regioes.includes(regiaoId))&&
      (!lugarId||row.lugares.includes(lugarId))&&
      (!faccaoId||row.faccoes.includes(faccaoId))&&
      (!estado||row.estado===estado)&&
      (ndMin==null||(row.nd_dnd!=null&&row.nd_dnd>=ndMin))&&
      (ndMax==null||(row.nd_dnd!=null&&row.nd_dnd<=ndMax))
    ).slice(offset,offset+limit);
  }
  return {getManifest,getCatalog,getIndexes,getRegions,getPlaces,getFactions,
          getFronts,getSettlements,getTypes,get,search};
}
