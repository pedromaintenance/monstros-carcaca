/** Ciclo XLVI — validação de comunidades e habitats não canônicos. */
export function buildFourFrontierSettlementLot(data,lot1,lot2,macro,environments,horizon,pageIndex){
 if(!data||data.schema_version!=="1.0"||data.estado!=="propostas_nao_canonicas"||
    data.aprovacao_autoral!==false||data.altera_canon!==false)throw Error("Proteção autoral do lote XLVI ausente");
 if(!Array.isArray(lot1?.assentamentos)||!Array.isArray(lot2?.assentamentos)||
    !Array.isArray(macro?.setores)||!Array.isArray(environments?.ambientes)||
    !Array.isArray(horizon?.frentes)||!Array.isArray(pageIndex?.paginas)||
    pageIndex.texto_autoral_incluido!==false)
    throw Error("Uma ou mais fontes editoriais estão ausentes ou expõem o manuscrito");
 const fronts=["caatinga","garganta-entorno","thargrid-montanhas","ironwood"];
 const byFront=new Map(horizon.frentes.map(f=>[f.id,f]));
 const byEnvironment=new Map(environments.ambientes.map(e=>[e.id,e]));
 const macroIds=new Set(macro.setores.map(s=>s.id));
 const publicPages=new Set(pageIndex.paginas.map(p=>p.pagina));
 const seenIds=new Set(),seenNames=new Set();
 const nameKey=x=>String(x).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").trim();
 for(const x of [...lot1.assentamentos,...lot2.assentamentos]){
   if(!x.id||!x.nome||seenIds.has(x.id)||seenNames.has(nameKey(x.nome)))
      throw Error("Duplicidade preexistente no povoamento");
   seenIds.add(x.id);seenNames.add(nameKey(x.nome));
 }
 function validateIdentity(row,kind){
   if(typeof row.id!=="string"||!row.id||seenIds.has(row.id)||
      typeof row.nome!=="string"||row.nome.length<8||seenNames.has(nameKey(row.nome)))
     throw Error("Identidade duplicada ou incompleta: "+row?.id);
   seenIds.add(row.id);seenNames.add(nameKey(row.nome));
   if(!fronts.includes(row.frente_id?.replace("frente:macro:","")))
     throw Error("Frente de povoamento desconhecida: "+row.id);
   const front=byFront.get(row.frente_id);
   if(!front||!macroIds.has(front.macro_id)||!row.ambiente_id||
      !byEnvironment.has(row.ambiente_id)||!byEnvironment.get(row.ambiente_id).setores.includes(front.macro_id))
     throw Error("Ambiente ou macrorregião incompatível: "+row.id);
   if(!Array.isArray(row.paginas_contexto)||!row.paginas_contexto.length||
      row.paginas_contexto.some(p=>!publicPages.has(p)))
     throw Error("Página de sustentação desconhecida: "+row.id);
   if(kind==="assentamento"){
     if(row.setor!==front.macro_id||row.estado!=="proposta_nao_canonica"||
        row.aprovacao_autoral!==false||row.comunidade_coletiva!==true||
        row.localizacao!==null||row.rotas!==null||row.populacao!==null||
        row.fronteiras!==null||row.efeito_canonico!==false)
       throw Error("Povoado canonizado ou recebeu geografia inventada: "+row.id);
     for(const key of ["forma","habitantes_propostos","governo_proposto","sustento_hipotetico",
       "habitacao_proposta","tensao_social","pergunta_autoral"])
       if(typeof row[key]!=="string"||row[key].length<23)
         throw Error("Povoado sem vida social, ecologia ou dilema: "+row.id+"."+key);
   }else{
     if(row.estado!=="proposta_ecologica"||row.conta_como_assentamento!==false||
        row.sapiencia_confirmada!==false||row.geometria!==null||row.quantidade!==null)
       throw Error("Habitat contado como vila ou tratado como espécie confirmada: "+row.id);
     for(const key of ["categoria","habitantes_ou_organismos_propostos","papel_ecologico_hipotetico","limite_de_inferencia"])
       if(typeof row[key]!=="string"||row[key].length<16)
         throw Error("Habitat sem função ou ressalva ecológica: "+row.id);
   }
 }
 for(const row of data.assentamentos||[])validateIdentity(row,"assentamento");
 for(const row of data.habitats||[])validateIdentity(row,"habitat");
 if(data.assentamentos?.length!==24||data.habitats?.length!==12)
    throw Error("O lote não preserva 24 comunidades e 12 habitats");
 for(const front of fronts){
   const id="frente:macro:"+front;
   if(data.assentamentos.filter(x=>x.frente_id===id).length!==6||
      data.habitats.filter(x=>x.frente_id===id).length!==3)
     throw Error("A distribuição regional perdeu seis comunidades ou três habitats: "+front);
 }
 const t=data.meta;
 if(t?.novos_assentamentos_propostos!==24||t?.novos_habitats_nao_contaveis!==12||
    t?.propostas_anteriores!==lot1.assentamentos.length+lot2.assentamentos.length||
    t?.propostas_acumuladas!==lot1.assentamentos.length+lot2.assentamentos.length+24||
    t?.aprovacoes_novas!==0)
    throw Error("Resumo editorial tenta inflar ou aprovar o povoamento");
 for(const front of fronts)
   if(t.distribuicao?.[front]!==6)throw Error("Soma regional incompatível: "+front);
 if(!Array.isArray(data.restricoes)||data.restricoes.length<9||
    !data.restricoes.some(x=>x.includes("Locais ecológicos não contam como assentamento"))||
    !data.restricoes.some(x=>x.includes("não é autoridade")))
   throw Error("Restrições do cânone e ecologia foram retiradas");
 const frontRows=fronts.map(id=>{
   const f=byFront.get("frente:macro:"+id);
   const previous=[...lot1.assentamentos.filter(x=>x.frente_id===f.id),
                   ...lot2.assentamentos.filter(x=>x.frente_id===f.id)].length;
   return {id:f.id,nome:f.titulo,macro_id:f.macro_id,referencia:[f.referencia_inferior,f.referencia_superior],
    novas:data.assentamentos.filter(x=>x.frente_id===f.id),
    habitats:data.habitats.filter(x=>x.frente_id===f.id),
    propostas_previas:previous,propostas_acumuladas:previous+6,aprovadas_neste_lote:0};
 });
 return {titulo:data.titulo,estado:data.estado,restricoes:data.restricoes,frentes:frontRows,
  assentamentos:data.assentamentos,habitats:data.habitats,
  totais:{novos_assentamentos:24,novos_habitats:12,previos:lot1.assentamentos.length+lot2.assentamentos.length,
   propostos_acumulados:lot1.assentamentos.length+lot2.assentamentos.length+24,
   habitats_acumulados:lot2.habitats.length+12,novos_aprovados:0},
  dataSource:"data/propostas/povoamento-quatro-frentes-ciclo46.json"};
}
