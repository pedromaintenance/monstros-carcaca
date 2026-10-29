/** Inventário de referências: nunca computar a quantidade de documentos como cidades. */
export function buildSettlementInventory(inventory,lot,horizon,macro){
 if(!inventory||inventory.schema_version!=="1.0"||
    inventory.estado!=="inventario_de_referencias_sem_censo_total"||
    inventory.altera_canon!==false||inventory.aprovacao_autoral!==false||
    lot?.estado!=="propostas_editoriais_de_povoamento_sem_canonizacao"||
    lot?.altera_canon!==false||lot?.aprovacao_autoral!==false||
    horizon?.altera_canon!==false||!horizon?.povoamento_criaturas?.inclusao_obrigatoria)
  throw Error("Inventário ou lote perderam proteção autoral");
 if(!Array.isArray(macro?.setores)||!Array.isArray(horizon?.frentes))
  throw Error("Setores e frentes de povoamento ausentes");
 const sectors=new Set(macro.setores.map(s=>s.id)), fronts=new Map(horizon.frentes.map(x=>[x.id,x]));
 const ids=new Set(), unique=(id)=>{if(!id||ids.has(id))throw Error("Identificador ausente ou duplicado: "+id);ids.add(id)};
 const macroAnchors=new Set();
 for(const x of inventory.ancoras_macro||[]){
   unique("macro:"+x.lugar_id);
   if(!sectors.has(x.setor)||!x.categoria_inventario)throw Error("Âncora sem setor ou categoria");
   macroAnchors.add(x.lugar_id);
 }
 const places=new Set();
 for(const x of inventory.lugares_catalogados||[]){
   unique("lugar:"+x.id);
   if(!x.tipo||!x.nome)throw Error("Lugar catalogado sem classificação");
   places.add(x.id);
 }
 const formal=new Set();
 for(const x of inventory.registros_formais||[]){
   unique("formal:"+x.id);
   if(!x.natureza||!x.referencia||x.novo_assentamento_gerado!==false)
     throw Error("Registro de assentamento contado como lugar novo");
   formal.add(x.id);
 }
 for(const x of inventory.sementes_narrativas||[]){
   unique("semente:"+x.id);
   if(x.conta_como_assentamento!==false||x.categoria!=="semente_de_cena_ou_microespaco")
     throw Error("Cena ou microespaço indevidamente contado como vila");
 }
 for(const x of inventory.criaturas_ecologicas_propostas||[]){
   unique("criatura:"+x.id);
   if(x.conta_como_assentamento!==false)throw Error("Espécie ecológica indevidamente contada como assentamento");
 }
 const proposed=new Set();
 for(const x of inventory.comunidades_novas_propostas||[]){
   unique("proposta:"+x.id);
   if(!fronts.has(x.frente_id)||!sectors.has(x.setor)||x.status!=="proposta_nao_canonica"||
     x.conta_como_aprovado!==false)throw Error("Proposta aprovada sem revisão");
   proposed.add(x.id);
 }
 const assigned=new Set();
 for(const x of lot.assentamentos||[]){
   if(!proposed.has(x.id)||assigned.has(x.id)||!fronts.has(x.frente_id)||
      !(fronts.get(x.frente_id).setores_possiveis||[fronts.get(x.frente_id).macro_id]).includes(x.setor)||
      x.aprovacao_autoral!==false||x.estado!=="proposta_nao_canonica"||
      x.proposta_de!=="assentamento_coletivo"||
      x.localizacao_exata!==null||x.rota_acesso!==null||x.geometria!==null||
      x.populacao!==null||x.distancia!==null)
     throw Error("Localidade nova não validada, duplicada ou recebeu coordenadas: "+x.id);
   const prose=["nome","habitantes_descritos","organizacao","subsistencia_hipotetica",
     "habitat_e_arquitetura","conflito_editorial","ancora_de_ambientacao","nao_inferir"];
   if(prose.some(k=>typeof x[k]!=="string"||x[k].length<18)||
      !Array.isArray(x.criaturas_e_povos)||!x.criaturas_e_povos.length)
     throw Error("Localidade fantástica sem identidade e ecologia: "+x.id);
   if(!["permanente_proposta","recorrente_sazonal_proposta"].includes(x.permanencia))
     throw Error("Duração da ocupação não classificada");
   assigned.add(x.id);
 }
 if(assigned.size!==14)throw Error("O primeiro lote perdeu uma das 14 comunidades");
 const groups=new Set();
 for(const group of inventory.equivalencias_para_deduplicacao||[]){
   if(!group.grupo||groups.has(group.grupo)||!group.nota||
      !Array.isArray(group.refs)||group.refs.length<2)
     throw Error("Grupo de equivalência incompleto");
   groups.add(group.grupo);
   for(const id of group.refs)
     if(!macroAnchors.has(id)&&!places.has(id)&&!formal.has(id))
       throw Error("Referência de equivalência ausente: "+id);
 }
 if(groups.size!==7)throw Error("Os sete grupos de deduplicação não foram preservados");
 const counts={ancoras_macro:inventory.ancoras_macro.length,
   lugares_catalogados:inventory.lugares_catalogados.length,
   registros_formais_assentamento:inventory.registros_formais.length,
   redacoes_sementes:inventory.sementes_narrativas.length,
   propostas_de_criaturas_ecologicas:inventory.criaturas_ecologicas_propostas.length,
   novos_assentamentos_propostos:assigned.size,novos_assentamentos_aprovados:0,
   grupos_equivalencia_revisados:groups.size};
 for(const [k,v] of Object.entries(counts)){
   if(inventory.totais?.[k]!==v)throw Error("Contagem editorial incoerente: "+k);
 }
 const expected={ancoras_macro:26,lugares_catalogados:8,registros_formais_assentamento:3,
   redacoes_sementes:16,propostas_de_criaturas_ecologicas:8,novos_assentamentos_propostos:14,
   novos_assentamentos_aprovados:0,grupos_equivalencia_revisados:7};
 for(const [k,n] of Object.entries(expected))if(counts[k]!==n)throw Error("Corpus alterado sem nova auditoria: "+k);
 if(!inventory.criterio?.includes("não o total de povoados")||
    !Array.isArray(inventory.advertencias)||inventory.advertencias.length<7)
   throw Error("A auditoria perdeu suas ressalvas contra dupla contagem");
 const frontRows=horizon.frentes.map(f=>({...f,
    propostas:lot.assentamentos.filter(x=>x.frente_id===f.id)}));
 return {titulo:inventory.titulo,criterio:inventory.criterio,totais:counts,altera_canon:false,
  fontes:inventory.fontes,ancoras_macro:inventory.ancoras_macro,
  lugares_catalogados:inventory.lugares_catalogados,
  registros_formais:inventory.registros_formais,
  sementes_narrativas:inventory.sementes_narrativas,
  criaturas_ecologicas_propostas:inventory.criaturas_ecologicas_propostas,
  equivalencias:inventory.equivalencias_para_deduplicacao,advertencias:inventory.advertencias,
  lote:lot.assentamentos,frentes:frontRows,
  qualidade:horizon.portoes_de_qualidade};
}
