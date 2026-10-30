/** Ciclo L — auditoria material sem transformar hipóteses em fatos de cânone. */
export function buildCoastMaterialViability(config,coast,places,pageIndex,audit){
 const fail=m=>{throw Error(m)};
 if(config?.schema_version!=="1.0"||config.estado!=="auditoria_material_sem_viabilidade_homologada"||
    config.altera_canon!==false||config.aprovacao_autoral!==false||
    coast?.altera_canon!==false||coast.aprovacao_autoral!==false||
    !audit?.nenhuma_contagem_documentada_geral||
    pageIndex?.texto_autoral_incluido!==false)
   fail("Perda de separação entre fonte documentada e propostas");
 if(!Array.isArray(places?.lugares)||!places.lugares.some(x=>x.id==="lugar:portomonte"&&x.estado==="documentado")||
    !Array.isArray(coast?.assentamentos)||coast.assentamentos.length!==14||
    !Array.isArray(config?.comunidades)||config.comunidades.length!==14||
    !Array.isArray(config.eixos)||config.eixos.length!==6||
    !Array.isArray(pageIndex.paginas)||!Array.isArray(config.cenarios)||config.cenarios.length!==6||
    audit.contagens?.comunidades_4_lotes!==82||
    coast.balanco?.propostas_comunidades_apos!==96||
    coast.balanco?.habitats_apos!==42)
   fail("Fontes do ciclo não conferem com o recorte territorial");
 const validPage=new Set(pageIndex.paginas.map(x=>x.pagina));
 const keys=["agua","alimento","energia","materiais","trabalho","acesso"];
 if(keys.some((k,i)=>config.eixos[i]?.id!==k||!config.eixos[i].nome))
   fail("Eixos de recursos não preservados");
 const ids=new Set(),siteById=new Map(coast.assentamentos.map(x=>[x.id,x]));
 const allowedStatuses=new Set(["efeito_local_documentado_sem_potabilidade",
   "agricultura_local_documentada_sem_quantificacao",
   "pendente","contexto_geologico_documentado_insumos_pendentes",
   "atividades_regionais_documentadas_sem_censo",
   "centralidade_comercial_documentada_sem_rotas"]);
 function checkAxes(item,port){
   if(!Array.isArray(item.eixos)||item.eixos.length!==6)fail("Eixos de auditoria incompletos: "+item.id);
   for(let i=0;i<keys.length;i++){
     const x=item.eixos[i];
     if(x?.eixo!==keys[i]||x.rotulo!==config.eixos[i].nome||
       x.demonstracao_material!==false||x.disponibilidade_garantida!==false||
       typeof x.analise!=="string"||x.analise.length<65||
       typeof x.pergunta_a_resolver!=="string"||x.pergunta_a_resolver.length<25)
       fail("Recurso material convertido em evidência ou sem análise: "+item.id+"."+keys[i]);
     if(port?!allowedStatuses.has(x.estado):x.estado!=="necessidade_hipotetica_nao_verificada")
       fail("Evidência atribuída à comunidade sem fonte: "+item.id+"."+keys[i]);
   }
 }
 function checkCommon(x){
  if(!x.id||ids.has(x.id)||!x.nome||x.localizacao!==null||
    x.capacidade_populacional!==null||x.quantidade_recursos!==null||
    x.dependencia_confirmada!==false||x.viabilidade_comprovada!==false||
    !Array.isArray(x.exposicoes)||!x.exposicoes.length||
    !Array.isArray(x.perguntas_criticas)||x.perguntas_criticas.length<2)
   fail("Localidade material quantificada, repetida ou sem perguntas: "+x?.id);
  ids.add(x.id);
 }
 const p=config.ancora_portomonte;
 checkCommon(p);checkAxes(p,true);
 if(p.id!=="viabilidade:l:portomonte"||p.lugar_documentado_id!=="lugar:portomonte"||
   p.nome!=="Portomonte"||p.estado!=="ancora_canonica_contextual_sem_balanco_material"||
   p.revisao_autoral!=="documentado_apenas_no_contexto"||
   !Array.isArray(p.paginas_contexto)||p.paginas_contexto.join(",")!=="5,12,23"||
   p.paginas_contexto.some(v=>!validPage.has(v))||
   p.eixos[0].estado!=="efeito_local_documentado_sem_potabilidade"||
   p.eixos[1].estado!=="agricultura_local_documentada_sem_quantificacao"||
   p.eixos[5].estado!=="centralidade_comercial_documentada_sem_rotas"||
   !p.eixos[0].analise.includes("Potabilidade"))
   fail("Portomonte confundida com abastecimento comprovado");
 const rows=config.comunidades.map((x,i)=>{
  checkCommon(x);checkAxes(x,false);
  const prev=coast.assentamentos[i];
  if(x.id!=="viabilidade:l:costa:"+String(i+1).padStart(2,"0")||
    x.comunidade_id!==prev?.id||x.nome!==prev?.nome||
    x.estado!=="auditoria_de_proposta_nao_canonica"||
    x.revisao_autoral!=="pendente"||
    prev.aprovacao_autoral!==false||
    prev.viabilidade_hidrica_confirmada!==false||
    prev.viabilidade_alimentar_confirmada!==false||
    prev.localizacao_confirmada!==false)
    fail("Auditoria não corresponde a assentamento proposto de XLIX: "+x.id);
  return {...x,ambiente_id:prev.ambiente_id,regime:prev.forma,
    habitantes:prev.habitantes_propostos};
 });
 const sid=new Set();
 const tags=new Set(["agua","colheita","demeter","acesso","incursoes","materiais","extracao","ecologia","conflito","tributo"]);
 for(const item of [p,...config.comunidades])
  if(item.exposicoes.some(t=>!tags.has(t)))
   fail("Tag de dependência não rastreável: "+item.id);
 const sims=config.cenarios.map(s=>{
  if(!s.id||sid.has(s.id)||!s.titulo||s.titulo.length<12||
    !tags.has(s.exposicao_primaria)||
    !Array.isArray(s.tags_de_sensibilidade)||!s.tags_de_sensibilidade.length||
    s.tags_de_sensibilidade.some(x=>!tags.has(x))||
    s.evento_confirmado!==false||s.probabilidade!==null||
    s.impacto_quantificado!==null||
    typeof s.mecanismo_condicional!=="string"||s.mecanismo_condicional.length<80||
    typeof s.limite!=="string"||s.limite.length<60)
   fail("Cenário probabilístico ou sem salvaguarda: "+s?.id);
  sid.add(s.id);
  const relevant=[p,...rows].filter(item=>item.exposicoes.some(t=>s.tags_de_sensibilidade.includes(t)));
  return {...s,expostos_por_tag:relevant.map(x=>({id:x.id,nome:x.nome})),
    contagem_de_mencoes_condicionais:relevant.length,
    risco_real_quantificado:false};
 });
 if(sid.size!==6)fail("Faltam cenários de sensibilidade");
 const expected={portomonte_ancora_documentada:1,comunidades_propostas_analisadas:14,
    eixos_por_local:6,celulas_de_auditoria:90,cenarios_qualitativos:6,
    dependencias_canonicas_comprovadas:0,recursos_quantificados:0,
    locais_com_viabilidade_homologada:0,comunidades_propostas_anteriores:96,
    habitats_propostos_anteriores:42,novos_assentamentos:0,aprovacoes_novas:0};
 for(const [key,value] of Object.entries(expected))
  if(config.balanco?.[key]!==value)fail("Balanço material indevidamente validado: "+key);
 if(!Array.isArray(config.advertencias)||config.advertencias.length<10||
    !config.advertencias.some(x=>x.includes("potabilidade"))||
    !config.advertencias.some(x=>x.includes("não são demônios"))||
    !config.advertencias.some(x=>x.includes("não prova"))) 
   fail("Salvaguardas da fonte ou dos povos foram retiradas");
 return {titulo:config.titulo,principio:config.principio,recorte:config.recorte,
   eixos:config.eixos,portomonte:p,comunidades:rows,cenarios:sims,
   balanco:expected,advertencias:config.advertencias,proximo_ciclo:config.proximo_ciclo,
   validacao_hidrica:0,validacao_alimentar:0,validacao_logistica:0,
   dados_canonicos_nao_quantificados:true,alteracao_canonica:false};
}
