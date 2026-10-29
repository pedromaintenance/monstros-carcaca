/** Interfaces continentais: vínculos rastreados, jamais arestas cartográficas automáticas. */
export function buildContinentalInterfaces(data,macro,networks,environments){
  if(!data||data.schema_version!=="1.0"||data.aprovacao_autoral!==false||data.altera_canon!==false||data.geometria!=="nao_cartografada")
    throw new Error("Interfaces sem salvaguarda de cânone ou geometria");
  if(!Array.isArray(macro?.setores)||!Array.isArray(macro?.conexoes)||!Array.isArray(networks?.redes)||!Array.isArray(environments?.relacoes))
    throw new Error("Camadas macro insuficientes");
  const setores=new Set(macro.setores.map(s=>s.id));
  const links=new Map(macro.conexoes.map(e=>[e.id,e]));
  const redelinks=new Set(networks.redes.flatMap(n=>n.relacoes.map(r=>r.id)));
  const envlinks=new Map(environments.relacoes.map(e=>[e.id,e]));
  const habitats=new Map(environments.ambientes.map(h=>[h.id,h]));
  const gaps=new Map(environments.lacunas.map(g=>[g.id,g]));
  const naturezas=new Set(["hidrografia","pressao_territorial","migracao","fronteira_movel","mudanca_de_poder",
    "articulacao_politica","sobreposicao_historica","relevo_relativo","verticalidade",
    "contato_litoraneo","profundidade_marinha","submersao_insular","limite_em_aberto"]);
  const estados=new Set(["documentado","documentado_sem_contato_fisico","movel","historico_sem_passagem",
    "topologia_em_revisao","em_aberto"]);
  function paginas(item){
    if(!Array.isArray(item.paginas)||!item.paginas.length||
       item.paginas.some(p=>!Number.isInteger(p)||p<1))
      throw new Error("Interface sem página do manuscrito: "+item.id);
  }
  const ids=new Set();
  for(const x of data.interfaces||[]){
    if(!x.id||ids.has(x.id))throw new Error("Interface duplicada: "+x.id);
    ids.add(x.id);
    paginas(x);
    if(!naturezas.has(x.natureza)||!estados.has(x.estado))throw new Error("Interface sem classificação: "+x.id);
    if(!Array.isArray(x.setores)||!x.setores.length||new Set(x.setores).size!==x.setores.length||
       x.setores.some(s=>!setores.has(s)))throw new Error("Setores inválidos na interface: "+x.id);
    if(x.geometria!==null||x.rota_confirmada!==false)throw new Error("Interface promovida a mapa ou rota: "+x.id);
    if(!x.evidencia||!x.leitura_analitica||!x.limite_de_inferencia)
      throw new Error("Interface sem separação de fonte e inferência: "+x.id);
    if(x.ref_macro){
      const e=links.get(x.ref_macro);
      if(!e||!redelinks.has(e.id))throw new Error("Relação macro inexistente: "+x.id);
      if(e.de!==x.setores[0]||e.para!==x.setores[1])
        throw new Error("Interface aponta para outros setores: "+x.id);
      if(e.estado==="indeterminado"&&x.estado!=="topologia_em_revisao")
        throw new Error("Topologia foi resolvida sem autoria: "+x.id);
      if(e.tipo==="fronteira_maritima"&&x.estado!=="movel")
        throw new Error("Fronteira marítima foi fixada: "+x.id);
    }
    if(x.ref_ambiental){
      const e=envlinks.get(x.ref_ambiental);
      if(!e)throw new Error("Relação ambiental inexistente: "+x.id);
      const envolvidos=[...new Set([...habitats.get(e.de).setores,...habitats.get(e.para).setores])];
      if(envolvidos.some(s=>!x.setores.includes(s)))
        throw new Error("Interface ambiental de outros setores: "+x.id);
      if(e.tipo==="fronteira_movel"&&x.estado!=="movel")
        throw new Error("Limite ambiental móvel tratado como estático: "+x.id);
    }
    if(x.lacuna_id&&!gaps.has(x.lacuna_id))throw new Error("Lacuna de referência inexistente: "+x.id);
    if(x.estado==="em_aberto"&&(!x.lacuna_id||x.ref_macro||x.ref_ambiental))
      throw new Error("Interface em aberto promovida a vínculo: "+x.id);
    if(!x.ref_macro&&!x.ref_ambiental&&x.estado!=="em_aberto")
      throw new Error("Interface sem evidência de vínculo: "+x.id);
  }
  const seenQ=new Set();
  for(const q of data.questoes||[]){
    if(!q.id||seenQ.has(q.id)||q.pendente!==true)throw new Error("Questão resolvida ou duplicada: "+q.id);
    seenQ.add(q.id);
    if(!q.pergunta||!q.setores?.length||q.setores.some(s=>!setores.has(s)))
      throw new Error("Questão com geografia inventada: "+q.id);
    if(q.ref_lacuna&&!gaps.has(q.ref_lacuna))
      throw new Error("Questão sem lacuna correspondente: "+q.id);
  }
  if(ids.size!==13||seenQ.size!==8)throw new Error("Inventário de interfaces incompleto");
  const grupos=Object.groupBy?Object.groupBy(data.interfaces,x=>x.estado):null;
  return {titulo:data.titulo,altera_canon:false,interfaces:data.interfaces,questoes:data.questoes,
    criterio:data.criterio,
    totais:{interfaces:ids.size,questoes:seenQ.size,
      referenciasMacro:data.interfaces.filter(x=>x.ref_macro).length,
      referenciasAmbientais:data.interfaces.filter(x=>x.ref_ambiental).length,
      naoEspaciais:data.interfaces.filter(x=>["documentado_sem_contato_fisico","historico_sem_passagem","topologia_em_revisao","em_aberto"].includes(x.estado)).length}};
}
