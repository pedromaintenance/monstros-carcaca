/**
 * Camada MACRO do Atlas da Carcaça.
 * Percorre o atlas existente, sem duplicar a taxonomia ou homologar fatos novos.
 */
export function buildMacroIndex(data, tree) {
  if (!data || data.schema_version !== "1.0" || data.altera_canon !== false ||
      data.aprovacao_autoral !== false) throw new Error("Camada macro sem proteção autoral");
  if (!tree || !Array.isArray(tree.nodes)) throw new Error("Atlas hierárquico ausente");
  const nodes = new Map(tree.nodes.map(n=>[n.id,n]));
  if (nodes.size !== tree.nodes.length) throw new Error("Árvore com IDs duplicados");
  const regionMap = new Map(tree.nodes.filter(n=>n.kind==="regiao").map(n=>[n.regionKey,n]));
  const regions = Array.isArray(data.setores)?data.setores:[];
  if (regions.length !== 11) throw new Error("Esperados 11 setores geográficos");
  const seen = new Set();
  const assembled = [];
  const types = new Set(["manuscrito","referencia_politica","indeterminado"]);
  for(const sector of regions) {
    if(!sector.id || seen.has(sector.id))throw new Error("Setor repetido: "+sector.id);
    seen.add(sector.id);
    const region = regionMap.get(sector.id);
    if(!region)throw new Error("Setor inexistente na árvore: "+sector.id);
    if(!Array.isArray(sector.ancoras)||sector.ancoras.length===0)throw new Error("Setor sem âncoras: "+sector.id);
    if(!Array.isArray(sector.macro_pendencias)||sector.macro_pendencias.length===0)throw new Error("Setor sem lacunas: "+sector.id);
    if(!Array.isArray(sector.paginas)||sector.paginas.some(p=>!Number.isInteger(p)||p<=0))throw new Error("Páginas não verificáveis em "+sector.id);
    const anchors = sector.ancoras.map(a=>{
      const item = nodes.get(a.lugar_id);
      if(!item || !["lugar","localidade"].includes(item.kind))throw new Error("Âncora ausente: "+a.lugar_id);
      if(item.regionKey !== sector.id)throw new Error("Âncora de outra região: "+a.lugar_id);
      if(a.estado!=="documentado")throw new Error("Âncora promovida sem curadoria: "+a.lugar_id);
      if(item.status==="proposta")throw new Error("Proposta marcada como âncora documentada: "+a.lugar_id);
      return {...a,label:item.label,kind:item.kind,sourceId:item.sourceId};
    });
    if(new Set(anchors.map(a=>a.lugar_id)).size!==anchors.length)throw new Error("Âncora duplicada");
    const all = tree.nodes.filter(n=>n.regionKey===sector.id);
    const places = all.filter(n=>["lugar","localidade"].includes(n.kind)&&n.placeType!=="ambito");
    const proposals = places.filter(n=>n.status==="proposta");
    const baseline = places.filter(n=>n.status!=="proposta");
    const contents = all.filter(n=>n.kind==="registro");
    const tags={};
    for(const n of contents)tags[n.recordType]=(tags[n.recordType]||0)+1;
    assembled.push({
      ...sector,
      macro_id:"atlas-macro:"+sector.id,
      regionNodeId:region.id,
      ancoras:anchors,
      cobertura:{
        lugaresReferenciados:baseline.length,
        microespacosPropostos:proposals.length,
        lacunasDeSubdivisao:all.filter(n=>n.kind==="lacuna_localidades").length,
        registrosDeConteudo:contents.length,
        porTipo:tags
      }
    });
  }
  if(regionMap.size!==12||seen.has("transversal"))throw new Error("Setor transversal não é território físico");
  const connections = Array.isArray(data.conexoes)?data.conexoes:[];
  for(const e of connections){
    if(!seen.has(e.de)||!seen.has(e.para))throw new Error("Conexão com setor desconhecido: "+e.id);
    if(!types.has(e.estado))throw new Error("Conexão sem estatuto: "+e.id);
    if(!Array.isArray(e.paginas)||e.paginas.length===0)throw new Error("Conexão sem página: "+e.id);
    if(e.de===e.para)throw new Error("Conexão macro-reflexiva: "+e.id);
  }
  const ids=new Set(connections.map(e=>e.id));
  if(ids.size!==connections.length)throw new Error("Conexão duplicada");
  return {
    schema_version:data.schema_version,
    title:data.titulo,
    estado:data.estado,
    altera_canon:false,
    setores:assembled,
    conexoes:connections,
    eixos:data.eixos,
    observacoes:data.observacoes,
    totais:{
      setores:assembled.length,
      ancoras:assembled.reduce((a,s)=>a+s.ancoras.length,0),
      conexoes:connections.length,
      lacunasRegioes:assembled.reduce((a,s)=>a+s.macro_pendencias.length,0),
      lugaresReferenciados:assembled.reduce((a,s)=>a+s.cobertura.lugaresReferenciados,0),
      microespacosPropostos:assembled.reduce((a,s)=>a+s.cobertura.microespacosPropostos,0)
    }
  };
}
