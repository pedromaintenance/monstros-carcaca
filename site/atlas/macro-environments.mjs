/** Macroambientes: cruzamento obrigatório com regiões e locais já existentes. */
export function buildMacroEnvironments(data, macro, atlas) {
  if(!data||data.schema_version!=="1.0"||data.aprovacao_autoral!==false||data.altera_canon!==false)
    throw new Error("Macroambientes sem salvaguardas autorais");
  if(!Array.isArray(macro?.setores)||!Array.isArray(atlas?.nodes))throw new Error("Fontes territoriais ausentes");
  const sectors=new Map(macro.setores.map(s=>[s.id,s]));
  const places=new Map(atlas.nodes.map(n=>[n.id,n]));
  const families=new Map();
  for(const f of data.familias||[]){
    if(!f.id||!f.nome||families.has(f.id))throw new Error("Família de ambiente repetida");
    families.set(f.id,f);
  }
  const states=new Set(["documentado","historico_sem_local","transversal","clima_indeterminado"]);
  const habitats=new Map();
  const pages=(x)=>{if(!Array.isArray(x.paginas)||!x.paginas.length||x.paginas.some(p=>!Number.isInteger(p)||p<1))throw new Error("Páginas de fonte inválidas: "+x.id)};
  for(const h of data.ambientes||[]){
    pages(h);
    if(!h.id||habitats.has(h.id))throw new Error("Macroambiente duplicado: "+h.id);
    if(!families.has(h.familia)||!states.has(h.estado))throw new Error("Macroambiente sem família ou status: "+h.id);
    if(!Array.isArray(h.setores))throw new Error("Setores ausentes: "+h.id);
    if(new Set(h.setores).size!==h.setores.length)throw new Error("Setor duplicado: "+h.id);
    for(const s of h.setores)if(!sectors.has(s))throw new Error("Setor desconhecido: "+s);
    if(h.setores.length>1)throw new Error("Macroambiente não pode inventar fronteira inter-regional: "+h.id);
    if(!h.setores.length&&h.lugar_id)throw new Error("Ambiente sem setor com lugar específico: "+h.id);
    if(h.lugar_id){
      const place=places.get(h.lugar_id);
      if(!place||!["lugar","localidade"].includes(place.kind))throw new Error("Lugar associado inexistente: "+h.id);
      if(place.status==="proposta")throw new Error("Ambiente aprovado com localidade proposta: "+h.id);
      if(place.regionKey!==h.setores[0])throw new Error("Região incompatível com lugar: "+h.id);
    }
    habitats.set(h.id,{...h,nome_familia:families.get(h.familia).nome});
  }
  const relationTypes=new Set(["termina_em","ao_norte_de","inclui","acima_de","profundidade_relativa","subambiente","conflito_de_borda","paisagens_costeiras","abaixo_em_parte","contato_costeiro","profundidades","fronteira_movel","contem"]);
  const edges=new Map();
  for(const e of data.relacoes||[]){
    pages(e);
    if(!e.id||edges.has(e.id))throw new Error("Relação duplicada: "+e.id);
    if(!habitats.has(e.de)||!habitats.has(e.para)||e.de===e.para)throw new Error("Relação ambiental com marco inválido: "+e.id);
    if(!relationTypes.has(e.tipo)||!["documentado_sem_geometria","fronteira_sem_geometria"].includes(e.estado))
      throw new Error("Relação não classificada: "+e.id);
    if(e.tipo==="fronteira_movel"&&e.estado!=="fronteira_sem_geometria")throw new Error("Fronteira móvel petrificada: "+e.id);
    edges.set(e.id,e);
  }
  const gaps=new Map();
  for(const x of data.lacunas||[]){
    pages(x);
    if(!x.id||gaps.has(x.id))throw new Error("Lacuna ambiental duplicada");
    if(x.resolvida!==false||x.estado!=="pendente")throw new Error("Lacuna ambiental resolvida sem revisão: "+x.id);
    for(const s of x.setores||[])if(!sectors.has(s))throw new Error("Setor inexistente em lacuna: "+x.id);
    gaps.set(x.id,x);
  }
  if(families.size!==8||sectors.size!==11||!habitats.size||!gaps.size)
    throw new Error("Cobertura macroambiental incompleta");
  const coverage=macro.setores.map(s=>{
    const local=[...habitats.values()].filter(x=>x.setores.includes(s.id));
    return {setor:s.id,nome:s.titulo,ambientes:local.length,
      familias:[...new Set(local.map(x=>x.familia))],semAmbienteDescrito:local.length===0,
      lacunas:[...gaps.values()].filter(g=>g.setores.includes(s.id)).length};
  });
  return {schema_version:data.schema_version,titulo:data.titulo,altera_canon:false,
    familias:[...families.values()],ambientes:[...habitats.values()],
    relacoes:[...edges.values()],lacunas:[...gaps.values()],cobertura:coverage,
    observacoes:data.observacoes,totais:{
      familias:families.size,ambientes:habitats.size,relacoes:edges.size,lacunas:gaps.size,
      semLocalizacao:[...habitats.values()].filter(x=>!x.setores.length).length,
      setoresSemDescricao:coverage.filter(x=>x.semAmbienteDescrito).length
    }
  };
}
