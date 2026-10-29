/**
 * Projeções macro de redes e história: a presença num setor é uma classificação
 * editorial, NÃO uma coordenada, soberania automática, rota ou terreno visitável.
 */
export function buildMacroNetworks(data,macro){
  if(!data||data.schema_version!=="1.0"||data.aprovacao_autoral!==false||
    data.altera_canon!==false||data.alteracao_regras_dw!==false)
    throw new Error("Proteções autorais ausentes nas redes");
  if(!macro||!Array.isArray(macro.setores)||!Array.isArray(macro.conexoes))
    throw new Error("Atlas macro de referência indisponível");
  const sectors=new Map(macro.setores.map(x=>[x.id,x]));
  const base=new Map(macro.conexoes.map(x=>[x.id,x]));
  const requirePages=(item)=>{
    if(!Array.isArray(item.paginas)||!item.paginas.length||
      item.paginas.some(p=>!Number.isInteger(p)||p<1))
      throw new Error("Registro sem páginas válidas: "+item.id);
  };
  const requireSector=(s,id)=>{
    if(!sectors.has(s))throw new Error("Setor inexistente em "+id+": "+s);
  };
  function validateUnique(array,label){
    if(!Array.isArray(array))throw new Error("Coleção ausente: "+label);
    const ids=array.map(x=>x.id);
    if(new Set(ids).size!==ids.length)throw new Error("IDs duplicados: "+label);
    return array;
  }
  const networks=validateUnique(data.redes,"redes").map(n=>{
    requirePages(n);
    if(n.estado!=="sintese_documental"||n.conexao_espacial_automatica!==false)
      throw new Error("Rede canoniza relação espacial: "+n.id);
    if(!Array.isArray(n.setores)||!n.setores.length||new Set(n.setores).size!==n.setores.length)
      throw new Error("Rede sem setores ou repetida: "+n.id);
    n.setores.forEach(x=>requireSector(x,n.id));
    const links=(n.relacao_ids||[]).map(id=>{
      const e=base.get(id);
      if(!e)throw new Error("Relação macro inexistente: "+id);
      if(!n.setores.includes(e.de)||!n.setores.includes(e.para))
        throw new Error("Relação externa à rede: "+id);
      return {...e};
    });
    return {...n,setores_referenciados:n.setores.map(s=>({id:s,titulo:sectors.get(s).titulo})),relacoes:links};
  });
  const influences=validateUnique(data.esferas,"esferas").map(x=>{
    requirePages(x);requireSector(x.setor,x.id);
    if(x.estado!=="sintese_de_fonte"||x.fronteira_definida!==false)
      throw new Error("Esfera promove fronteira: "+x.id);
    return {...x,setor_titulo:sectors.get(x.setor).titulo};
  });
  const timeline=validateUnique(data.cronologia,"cronologia").map(x=>{
    requirePages(x);
    if(x.estado!=="cronologia_do_manuscrito"||x.tipo!=="fato_historico"||
       !Number.isInteger(x.ano_ec)||x.ano_ec<0)
      throw new Error("Evento cronológico inválido: "+x.id);
    if(!Array.isArray(x.setores))throw new Error("Evento sem lista de setores: "+x.id);
    x.setores.forEach(s=>requireSector(s,x.id));
    if(new Set(x.setores).size!==x.setores.length)throw new Error("Setor duplicado no marco: "+x.id);
    return {...x};
  }).sort((a,b)=>a.ano_ec-b.ano_ec);
  const uncertainties=validateUnique(data.lacunas_estruturais,"lacunas").map(x=>{
    requirePages(x);
    if(x.estado!=="questao_autoral_aberta"||x.resolvida!==false)
      throw new Error("Lacuna declarada resolvida: "+x.id);
    if(!Array.isArray(x.setores)||!x.setores.length)throw new Error("Lacuna sem região: "+x.id);
    x.setores.forEach(s=>requireSector(s,x.id));
    return {...x};
  });
  for(let i=1;i<timeline.length;i++){
    if(timeline[i].ano_ec<timeline[i-1].ano_ec)
      throw new Error("Cronologia não ordenável");
  }
  return {
    schema_version:data.schema_version,
    titulo:data.titulo,
    altera_canon:false,
    redes:networks,
    esferas:influences,
    cronologia:timeline,
    lacunas_estruturais:uncertainties,
    regras:data.regras,
    totais:{redes:networks.length,esferas:influences.length,
      marcos:timeline.length,lacunas:uncertainties.length}
  };
}
