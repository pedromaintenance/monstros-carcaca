/**
 * Geografia qualitativa: cruzamentos de fonte sem projeção cartográfica.
 */
export function buildPhysicalGeography(data,macro,atlas){
  if(!data||data.schema_version!=="1.0"||data.altera_canon!==false||data.aprovacao_autoral!==false)
    throw new Error("Geografia física sem salvaguardas de autoria");
  if(!macro?.setores||!atlas?.nodes)throw new Error("Catálogos macro incompletos");
  const areas=new Set(macro.setores.map(s=>s.id));
  const places=new Map(atlas.nodes.map(n=>[n.id,n]));
  const points=new Map();
  const statuses=new Set(["documentado","documentado_com_conflito","documentado_sem_posicao","historico_sem_local_individual"]);
  const dirs=new Set(["leste","oeste","norte","sul","sul-relativo","norte-relativo","atravessa","nao_fixado","alem_abismo","alem-mar"]);
  for(const p of data.pontos||[]){
    if(!p.id||points.has(p.id))throw new Error("Marco físico repetido ou sem ID: "+p.id);
    if(!statuses.has(p.estado)||!dirs.has(p.orientacao))throw new Error("Classificação física desconhecida: "+p.id);
    if(!Array.isArray(p.paginas)||!p.paginas.length||p.paginas.some(n=>!Number.isInteger(n)||n<1))
      throw new Error("Sem evidência paginada: "+p.id);
    if(!Array.isArray(p.setores))throw new Error("Setor malformado: "+p.id);
    p.setores.forEach(s=>{if(!areas.has(s))throw new Error("Setor inventado: "+p.id+" / "+s)});
    if(p.lugar_id){
      const n=places.get(p.lugar_id);
      if(!n||!["lugar","localidade"].includes(n.kind))throw new Error("Lugar ausente: "+p.lugar_id);
      if(n.status==="proposta")throw new Error("Proposta promovida ao macro: "+p.lugar_id);
      if(p.setores.length!==1||n.regionKey!==p.setores[0])throw new Error("Lugar de outro setor: "+p.id);
    }
    if(p.setores.length===0&&p.lugar_id)throw new Error("Marco não setorizado com âncora precisa: "+p.id);
    points.set(p.id,{...p});
  }
  const knownTypes=new Set(["referencia_cardinal","desagua","margem","sobreposicao_historica","posicao_relativa","alem_de","ilha_no_rio","litoral","topologia_contestada","associacao_anatomica"]);
  const relations=[];
  const relIds=new Set();
  for(const e of data.relacoes||[]){
    if(relIds.has(e.id))throw new Error("Relação física repetida: "+e.id);
    relIds.add(e.id);
    if(!points.has(e.de)||!points.has(e.para))throw new Error("Relação com marco inexistente: "+e.id);
    if(e.de===e.para)throw new Error("Relação do mesmo marco: "+e.id);
    if(!knownTypes.has(e.tipo))throw new Error("Relação física sem tipo: "+e.id);
    if(!["documentado_sem_geometria","revisao_autoral"].includes(e.estado))
      throw new Error("Relação não curada: "+e.id);
    if(e.tipo==="topologia_contestada"&&e.estado!=="revisao_autoral")
      throw new Error("Topologia contestada foi considerada resolvida: "+e.id);
    if(!e.paginas?.length)throw new Error("Relação sem fonte: "+e.id);
    relations.push({...e});
  }
  const questions=data.questoes||[];
  if(new Set(questions.map(q=>q.id)).size!==questions.length)throw new Error("Pergunta geográfica repetida");
  for(const q of questions){
    if(q.resolvida!==false||q.estado!=="aguarda_decisao_autoral")throw new Error("Pergunta resolvida sem autoria: "+q.id);
    if(!q.paginas?.length)throw new Error("Questão sem fonte: "+q.id);
    for(const s of q.setores||[])if(!areas.has(s))throw new Error("Questão com região inventada: "+q.id);
  }
  if(!points.size||!relations.length||!questions.length)throw new Error("Camada física vazia");
  const types=["anatomia","relevo","hidrografia","margem","maritimo","localizacao_pendente","assentamento_historico","fortaleza"];
  if([...points.values()].some(p=>!types.includes(p.tipo)))throw new Error("Tipo de marco sem registro de interface");
  return {schema_version:data.schema_version,titulo:data.titulo,altera_canon:false,
    observacao:data.observacao,pontos:[...points.values()],relacoes:relations,questoes:questions,
    regras:data.regras,
    totais:{marcos:points.size,relacoes:relations.length,questoes:questions.length,
      semDirecao:[...points.values()].filter(p=>p.orientacao==="nao_fixado").length,
      semSetor:[...points.values()].filter(p=>!p.setores.length).length}
  };
}
