/** Ciclo XLV: expansão de povoamento com hierarquia epistêmica e ecologia não contável. */
export function buildSettlementExpansion(data,prev,macro,env,horizon,pages){
 const invalid=()=>{throw Error("O lote perdeu o estado de proposta não canônica");};
 if(!data||data.schema_version!=="1.0"||data.estado!=="lote_de_propostas_nao_canonicas"||
  data.aprovacao_autoral!==false||data.altera_canon!==false||data.fase!=="macrorregional_povoamento")invalid();
 if(!Array.isArray(prev?.assentamentos)||!Array.isArray(env?.ambientes)||!Array.isArray(macro?.setores)||
    !Array.isArray(horizon?.frentes)||!Array.isArray(pages?.paginas))
   throw Error("Fontes de povoamento, ecologia ou manuscrito ausentes");
 const pageSet=new Set(pages.paginas.map(p=>p.pagina));
 const allowed=new Set(["rio","eldroth"]),regional=new Set(macro.setores.map(s=>s.id)),
   frontMap=new Map(horizon.frentes.map(f=>[f.id,f])),
   environment=new Map(env.ambientes.map(e=>[e.id,e]));
 const names=new Set(prev.assentamentos.map(x=>x.nome.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()));
 const ids=new Set(prev.assentamentos.map(x=>x.id));
 function checkLocation(x){
  if(!allowed.has(x.setor)||!regional.has(x.setor)||x.frente_id!=="frente:macro:"+x.setor||
    !frontMap.has(x.frente_id)||x.estado!=="proposta_nao_canonica"||
    x.aprovacao_autoral!==false||x.assentamento_coletivo!==true||
    x.geometria!==null||x.rota!==null||x.populacao!==null||
    x.conexao_automatica!==false||!["permanente_proposta","sazonal_proposta"].includes(x.forma_de_ocupacao))
    throw Error("Localidade sem classificação ou com projeção não autorizada: "+x.id);
  const required=["id","nome","tipo","habitantes_propostos","governo_e_organizacao","subsistencia_e_oficios",
    "arquitetura_e_modo_de_habitar","tensao_politica","gancho_social","base_no_manuscrito"];
  if(required.some(k=>typeof x[k]!=="string"||x[k].length<12)||
      !Array.isArray(x.paginas)||!x.paginas.length||x.paginas.some(p=>!pageSet.has(p)))
    throw Error("Localidade sem identidade, conflito ou página autoral: "+x.id);
  if(x.ambiente_id!==(x.setor==="rio"?"amb:rio":"amb:eldroth")||
    !environment.has(x.ambiente_id)||!environment.get(x.ambiente_id).setores.includes(x.setor))
    throw Error("Comunidade fora do seu macroambiente documentado: "+x.id);
  if(ids.has(x.id))throw Error("Identificador duplicado entre lotes: "+x.id);
  const nameKey=x.nome.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  if(names.has(nameKey))throw Error("Assentamento nomeado duas vezes: "+x.nome);
  ids.add(x.id);names.add(nameKey);
 }
 for(const x of data.assentamentos||[])checkLocation(x);
 if(data.assentamentos?.length!==18||
    data.assentamentos.filter(x=>x.setor==="rio").length!==9||
    data.assentamentos.filter(x=>x.setor==="eldroth").length!==9)
  throw Error("Esperadas nove comunidades em cada região e dezoito no lote");
 const ecoIds=new Set(), ecoNames=new Set();
 for(const x of data.habitats||[]){
  if(!x.id||ecoIds.has(x.id)||names.has(x.nome.toLowerCase())||ecoNames.has(x.nome.toLowerCase())||
    !allowed.has(x.setor)||x.status!=="proposta_ecologica"||
    x.conta_como_assentamento!==false||x.vida_sapiente_confirmada!==false||
    x.geometria!==null||x.densidade!==null||
    x.ambiente_id!==(x.setor==="rio"?"amb:rio":"amb:eldroth")||
    !environment.has(x.ambiente_id)||
    !["habitat_organismos","area_reproducao","covil_individual","habitat_fungico","territorio_predatorio","habitat_decompositores","fenomeno_ecologico_magico"].includes(x.categoria)||
    !Array.isArray(x.paginas)||!x.paginas.length||x.paginas.some(p=>!pageSet.has(p))||
    ["nome","organismos_propostos","papel_ecologico_hipotetico","limite"].some(k=>typeof x[k]!=="string"||x[k].length<12))
    throw Error("Habitat contado como vila ou com ecologia indevidamente confirmada: "+x.id);
  ecoIds.add(x.id);ecoNames.add(x.nome.toLowerCase());
 }
 if(data.habitats?.length!==10||data.habitats.filter(x=>x.setor==="rio").length!==5||
    data.habitats.filter(x=>x.setor==="eldroth").length!==5)
  throw Error("Os dez lugares ecológicos não contáveis precisam ser preservados");
 const axes=new Set();
 for(const x of data.premissas_de_rede||[]){
  if(!x.id||axes.has(x.id)||!allowed.has(x.setor)||x.estado!=="eixo_documental_sem_rota"||
    !Array.isArray(x.fonte_paginas)||!x.fonte_paginas.length||
    x.fonte_paginas.some(p=>!pageSet.has(p))||
    !x.observacao||x.observacao.length<40)
    throw Error("Eixo documental confundido com rota ou relação de povoamento: "+x.id);
  axes.add(x.id);
 }
 if(axes.size!==4||!Array.isArray(data.regras)||data.regras.length<8||
    !Array.isArray(data.fontes)||data.fontes.length<4)
  throw Error("Salvaguardas documentais do lote estão incompletas");
 const totals=data.notas_densidade;
 if(totals?.rio_propostas_lote_anterior!==prev.assentamentos.filter(x=>x.setor==="rio").length||
    totals?.eldroth_propostas_lote_anterior!==prev.assentamentos.filter(x=>x.setor==="eldroth").length||
    totals?.novas_rio!==9||totals?.novas_eldroth!==9||
    totals?.total_propostas_rio!==11||totals?.total_propostas_eldroth!==11||
    totals?.total_aprovado!==0||totals?.novos_habitats_nao_contaveis!==10)
  throw Error("Os números das propostas foram apresentados como censo ou aprovados");
 const rows=data.assentamentos.map(x=>({...x,macroambiente_nome:environment.get(x.ambiente_id).nome}));
 const habitats=data.habitats.map(x=>({...x,macroambiente_nome:environment.get(x.ambiente_id).nome}));
 return {titulo:data.titulo,criterio:data.criterio,assentamentos:rows,habitats,
   premissas_de_rede:data.premissas_de_rede,regras:data.regras,aprovacao_autoral:false,
   totais:{lote_atual:18,rio_novos:9,eldroth_novos:9,
     anteriores:prev.assentamentos.length,propostas_acumuladas:prev.assentamentos.length+18,
     rio_acumulado:11,eldroth_acumulado:11,habitats_novos:10,assentamentos_aprovados:0},
   comparacao:horizon.frentes.filter(x=>allowed.has(x.macro_id)).map(f=>({
     regiao:f.macro_id,meta_flexivel:[f.referencia_inferior,f.referencia_superior],
     propostas_nao_aprovadas:prev.assentamentos.filter(x=>x.setor===f.macro_id).length+
       rows.filter(x=>x.setor===f.macro_id).length
   }))};
}
