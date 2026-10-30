/** Ciclo XLIX: viabilidade proposta e malha social sem cartografia inventada. */
const clean=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
export function buildContinentalCoastSettlementLot(data,oldAudit,macroEnvironments,pageIndex,horizon){
 if(data?.schema_version!=="1.0"||data.estado!=="lote_editorial_sem_canonizacao"||
    data.altera_canon!==false||data.aprovacao_autoral!==false)
    throw Error("Lote costeiro perdeu proteção autoral");
 if(!oldAudit?.nenhuma_contagem_documentada_geral||oldAudit.contagens?.comunidades_4_lotes!==82||
    oldAudit.contagens?.habitats_3_lotes!==34||
    !Array.isArray(oldAudit.comunidades)||!Array.isArray(oldAudit.habitats)||
    !Array.isArray(macroEnvironments?.ambientes)||!Array.isArray(horizon?.frentes)||
    !Array.isArray(pageIndex?.paginas)||pageIndex.texto_autoral_incluido!==false)
   throw Error("Índices auditados e fontes de mundo incompatíveis");
 const envs=new Map(macroEnvironments.ambientes.map(x=>[x.id,x]));
 const pages=new Set(pageIndex.paginas.map(x=>x.pagina));
 const front=horizon.frentes.find(x=>x.id==="frente:macro:costa");
 if(!front||front.macro_id!=="costa"||front.unidade!=="assentamentos")
   throw Error("Frente Costa alterada no horizonte");
 const ids=new Set([...oldAudit.comunidades,...oldAudit.habitats].map(x=>x.id));
 const names=new Set(oldAudit.comunidades.map(x=>clean(x.nome)));
 const localIds=new Set();
 const verifyPlace=(x,kind)=>{
  if(!x?.id||!x.nome||x.nome.length<10||ids.has(x.id)||localIds.has(x.id)||
      names.has(clean(x.nome)))
    throw Error("Identidade duplicada ou inexistente do povoamento: "+x?.id);
  localIds.add(x.id);names.add(clean(x.nome));
  if(x.setor!=="costa"||x.frente_id!=="frente:macro:costa"||
      !envs.has(x.ambiente_id)||!envs.get(x.ambiente_id).setores.includes("costa")||
      !["amb:pradarias","amb:penhascos"].includes(x.ambiente_id)||
      !Array.isArray(x.paginas_contexto)||!x.paginas_contexto.length||
      x.paginas_contexto.some(p=>!pages.has(p)))
   throw Error("Localidade sem fonte ou ambiente costeiro continental: "+x.id);
  if(kind==="settlement"){
   if(x.estado!=="proposta_nao_canonica"||x.aprovacao_autoral!==false||
      x.coletivo_habitado!==true||x.pode_ser_classificado_como_costa_continental!==true||
      x.subzona!=="continental_proposta_sem_localizacao"||
      x.localizacao_confirmada!==false||x.rota_confirmada!==false||
      x.viabilidade_hidrica_confirmada!==false||x.viabilidade_alimentar_confirmada!==false||
      x.geometria!==null||x.distancia!==null||x.populacao!==null||x.ligacao_cartografada!==null)
     throw Error("Povoado promovido ao cânone ou localizado sem fonte: "+x.id);
   const keys=["forma","habitantes_propostos","regime_de_autoridade_proposto","subsistencia_condicional",
    "habitacao_hipotetica","conflito_material_e_social","questao_aberta","fundamento_regional_documentado","eixo_socioeconomico"];
   for(const key of keys)if(typeof x[key]!=="string"||x[key].length<(key==="forma"||key==="eixo_socioeconomico"?8:35))
     throw Error("Povoado sem governança, recursos e tensão própria: "+x.id+"."+key);
   if(!Array.isArray(x.povos_mencionados)||!x.povos_mencionados.length)
     throw Error("Povoado sem moradores propostos: "+x.id);
  }else{
   if(x.estado!=="proposta_ecologica"||x.conta_como_assentamento!==false||
      x.sapiencia_confirmada!==false||x.localizacao!==null||x.quantidade!==null)
     throw Error("Habitat tratado como assentamento ou população confirmada: "+x.id);
   const keys=["categoria","organismos_propostos","funcao_ecologica_hipotetica","limite_de_inferencia"];
   for(const key of keys)if(typeof x[key]!=="string"||x[key].length<(key==="categoria"?8:25))
     throw Error("Habitat sem biologia ou salvaguarda: "+x.id+"."+key);
  }
 };
 for(const x of data.assentamentos||[])verifyPlace(x,"settlement");
 for(const x of data.habitats||[])verifyPlace(x,"habitat");
 if(data.assentamentos?.length!==14||data.habitats?.length!==8)
   throw Error("O ciclo XLIX exige 14 comunidades e oito habitats");
 const reg=new Set(data.assentamentos.map(x=>x.forma));
 if(reg.size!==14)throw Error("O ciclo exige 14 regimes de ocupação distintos para romper repetição autoral");
 const communities=new Map(data.assentamentos.map(x=>[x.id,x]));
 const linkIds=new Set();
 for(const e of data.relacoes_hipoteticas||[]){
   if(!e.id||linkIds.has(e.id)||!communities.has(e.origem_id)||
      !communities.has(e.destino_id)||e.origem_id===e.destino_id||
      e.estado!=="hipotese_sem_vinculo_aprovado"||
      e.fluxo_comprovado!==false||e.rota!==false||
      e.distancia!==null||e.quantidade!==null||
      !e.tipo||typeof e.hipotese!=="string"||e.hipotese.length<55)
     throw Error("Relação territorial inventou rotas, fluxos ou acordo: "+e.id);
   linkIds.add(e.id);
 }
 if(linkIds.size!==8||!Array.isArray(data.restricoes)||data.restricoes.length<11||
    !data.restricoes.some(s=>s.includes("água potável"))||
    !data.restricoes.some(s=>s.includes("Abissais marinhos não são demônios")))
   throw Error("Vínculos ou restrições de fonte ausentes");
 const expected={novas_comunidades_continentais_propostas:14,novos_habitats_nao_contaveis:8,
 relacoes_sociais_hipoteticas:8,propostas_comunidades_antes:82,
 propostas_comunidades_apos:96,habitats_antes:34,habitats_apos:42,
 propostas_costa_antes:8,propostas_costa_apos:22,
 propostas_costa_insulares_anteriores:7,propostas_costa_cavernas_anteriores:1,
 comunidades_continentais_novas_sem_localizacao:14,aprovacoes_novas:0};
 for(const [k,value] of Object.entries(expected))
   if(data.balanco?.[k]!==value)throw Error("Soma regional, estatuto ou contagem indevida: "+k);
 if(oldAudit.indicadores?.costa?.insulares!==7||
    oldAudit.indicadores?.costa?.nao_insulares_sem_confirmacao_continental!==1)
   throw Error("A auditoria original da Costa foi alterada");
 const forms=data.assentamentos.map(x=>({id:x.id,nome:x.nome,forma:x.forma,
   poder:x.regime_de_autoridade_proposto,habitantes:x.habitantes_propostos,
   economia:x.subsistencia_condicional,conflito:x.conflito_material_e_social,
   paginas:x.paginas_contexto,ambiente:x.ambiente_id}));
 return {titulo:data.titulo,objetivo:data.objetivo,contexto_documentado:data.contexto_documentado,
  comunidades:data.assentamentos,habitats:data.habitats,
  relacoes:data.relacoes_hipoteticas,restricoes:data.restricoes,
  balanco:expected,formas:forms,aprovadas:0,
  diagnostico:{costa_historica_8_propostas:8,costa_7_insulares:7,
   costa_1_caverna_sem_localizacao_continental:1,
   novas_comunidades_continentais_ainda_sem_posicao:14,
   costa_total_22_propostas:22,relacoes_sem_rota:8,
   fonte:"Capítulo I, páginas 5, 12, 14, 15, 16, 20 e 23, usadas apenas como contexto"},
  confirma_estradas:false,confirma_agua_potavel:false,confirma_canon:false};
}
