/** Ciclo XLVII: ilhas geográficas, assentamentos e habitats têm contagens distintas. */
export function buildMarineTailSettlements(data,old1,old2,old3,macro,environment,horizon,pageIndex) {
 const deny=reason=>{throw Error(reason)};
 if(data?.schema_version!=="1.0"||data.estado!=="proposta_editorial_nao_canonica"||
    data.aprovacao_autoral!==false||data.altera_canon!==false)
  deny("XLVII perdeu sua natureza de proposta");
 if(!Array.isArray(old1?.assentamentos)||!Array.isArray(old2?.assentamentos)||
   !Array.isArray(old3?.assentamentos)||!Array.isArray(macro?.setores)||
   !Array.isArray(environment?.ambientes)||!Array.isArray(horizon?.frentes)||
   !Array.isArray(pageIndex?.paginas)||pageIndex.texto_autoral_incluido!==false)
  deny("Faltam fontes de classificação ou índice público não autoral");
 const sectors=new Set(macro.setores.map(s=>s.id));
 const fronts=new Map(horizon.frentes.map(f=>[f.id,f]));
 const env=new Map(environment.ambientes.map(e=>[e.id,e]));
 const pages=new Set(pageIndex.paginas.map(x=>x.pagina));
 const existing=[...old1.assentamentos,...old2.assentamentos,...old3.assentamentos];
 if(existing.length!==56)deny("Histórico de três lotes divergente");
 const norm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").trim();
 const ids=new Set(existing.map(x=>x.id)),names=new Set(existing.map(x=>norm(x.nome)));
 function unique(x){
  if(!x?.id||!x?.nome||x.nome.length<9||ids.has(x.id)||names.has(norm(x.nome)))
    deny("ID ou nome inexistente/duplicado entre lotes: "+x?.id);
  ids.add(x.id);names.add(norm(x.nome));
 }
 function context(x,sector,envId){
  if(!sectors.has(sector)||!env.has(envId)||!env.get(envId).setores.includes(sector)||
     !Array.isArray(x.paginas_contexto)||!x.paginas_contexto.length||
     x.paginas_contexto.some(p=>!pages.has(p)))deny("Ambiente, setor ou páginas indevidas: "+x.id);
 }
 function prose(x,keys){
  for(const k of keys)if(typeof x[k]!=="string"||x[k].length<(["categoria","forma"].includes(k)?7:16))
    deny("Identidade social/ecológica incompleta: "+x.id+"."+k);
 }
 const islands=new Map();
 for(const x of data.ilhas||[]){
  unique(x);context(x,"costa","amb:ilhas");
  if(x.macro_id!=="costa"||x.estado!=="ilha_individual_proposta_nao_canonica"||
     x.aprovacao_autoral!==false||x.prova_ilha_existente!==false||
     x.localizacao!==null||x.coordenadas!==null||x.conta_como_assentamento!==false||
     typeof x.permite_comunidade_proposta!=="boolean"||!Array.isArray(x.comunidades_associadas))
    deny("Ilha fictícia foi canonizada, posicionada ou contada como cidade: "+x.id);
  prose(x,["categoria","ocupantes_possiveis","papel_regional_hipotetico","ecologia_hipotetica","conflito_potencial","limite_de_inferencia"]);
  islands.set(x.id,x);
 }
 if(islands.size!==10)deny("É necessário manter dez ilhas propostas distintas");
 const proposed=[...(data.comunidades_insulares||[]),...(data.comunidades_submersas||[]),...(data.comunidades_cauda||[])];
 for(const x of proposed){
  unique(x);
  if(!fronts.has(x.frente_id)||x.estado!=="proposta_nao_canonica"||
      x.aprovacao_autoral!==false||x.conta_como_comunidade_proposta!==true||
      x.geometria!==null||x.rota!==null||x.populacao!==null||
      x.proximidade_confirmada!==false)
   deny("Assentamento canonizado ou com geografia fictícia: "+x.id);
  context(x,x.setor,x.ambiente_id);
  prose(x,["forma","habitantes_propostos","governo_proposto","sustento_hipotetico","modo_de_habitar","tensao_politica"]);
 }
 const refs=new Map();
 for(const x of data.comunidades_insulares||[]){
   if(x.frente_id!=="frente:macro:costa"||x.setor!=="costa"||
      x.ambiente_id!=="amb:ilhas"||!islands.has(x.ilha_id))
    deny("Comunidade insular sem ilha proposta ou classificada como ilha geográfica: "+x.id);
   const arr=refs.get(x.ilha_id)||[];arr.push(x.id);refs.set(x.ilha_id,arr);
 }
 for(const island of islands.values()){
   const linked=refs.get(island.id)||[];
   if(JSON.stringify(linked)!==JSON.stringify(island.comunidades_associadas)||
     island.permite_comunidade_proposta!==(linked.length>0))
     deny("Assentamento/ilha incompatível ou ilha vazia artificialmente povoada: "+island.id);
 }
 const underwater=data.comunidades_submersas||[];
 for(const x of underwater){
  if(x.frente_id!=="frente:macro:submersos"||!["costa","azuis"].includes(x.setor)||
    !["amb:abissais-mar","amb:cavernas-kuotoa","amb:mar-rubro","amb:azuis","amb:recifes"].includes(x.ambiente_id))
   deny("Povoado submarino confundiu mares ou fronteira: "+x.id);
 }
 for(const x of data.comunidades_cauda||[]){
  if(x.frente_id!=="frente:macro:cauda"||x.setor!=="cauda"||
     x.ambiente_id!=="amb:cauda"||x.passagem_abismo_confirmada!==false)
   deny("Povoado da Cauda ganhou passagem fictícia pelo Abismo: "+x.id);
 }
 if(proposed.length!==26||data.comunidades_insulares?.length!==6||
   underwater.length!==12||underwater.filter(x=>x.setor==="costa").length!==6||
   underwater.filter(x=>x.setor==="azuis").length!==6||
   data.comunidades_cauda?.length!==8)
  deny("Os 26 núcleos habitados não foram preservados por frente");
 const habitats=data.habitats||[];
 for(const x of habitats){
   unique(x);context(x,x.setor,x.ambiente_id);
   if(!["ilhas","submersos","cauda"].includes(x.frente)||
      x.frente==="ilhas"&&!(x.setor==="costa"&&x.ambiente_id==="amb:ilhas")||
      x.frente==="cauda"&&!(x.setor==="cauda"&&x.ambiente_id==="amb:cauda")||
      x.frente==="submersos"&&!["costa","azuis"].includes(x.setor)||
      x.estado!=="proposta_ecologica_nao_canonica"||
      x.conta_como_assentamento!==false||x.prova_geografia!==false||
      x.localizacao!==null||x.quantidade!==null)
    deny("Habitat foi convertido em assentamento ou fato cartográfico: "+x.id);
   prose(x,["categoria","organismos_propostos","papel_ecologico_hipotetico","limite_de_inferencia"]);
 }
 if(habitats.length!==12||habitats.filter(x=>x.frente==="ilhas").length!==3||
     habitats.filter(x=>x.frente==="submersos").length!==6||
     habitats.filter(x=>x.frente==="cauda").length!==3)
   deny("Os 12 habitats não contáveis foram alterados");
 const totals=data.balanco;
 const expected={ilhas_novas_propostas:10,comunidades_insulares_propostas:6,
   comunidades_submersas_propostas:12,comunidades_cauda_propostas:8,
   comunidades_novas_propostas:26,habitats_nao_contaveis:12,
   propostas_anteriores:56,comunidades_acumuladas:82,
   habitats_anteriores:22,habitats_acumulados:34,aprovacoes_novas:0};
 for(const [key,value] of Object.entries(expected))
   if(totals?.[key]!==value)deny("Balanço de povoamento forjado ou incompleto: "+key);
 if(!Array.isArray(data.restricoes)||data.restricoes.length<12||
    !data.restricoes.some(x=>x.includes("Abissais marinhos são povo anfíbio não demoníaco"))||
    !data.restricoes.some(x=>x.includes("não está documentada uma ponte")))
   deny("Salvaguardas de mar, Abismo e cânone ausentes");
 const categories={ilhas:10,insulares:6,submersos_rubros:6,submersos_azuis:6,cauda:8,habitats:12};
 return {titulo:data.titulo,politica:data.politica,ilhas:data.ilhas,
   comunidades_insulares:data.comunidades_insulares,
   comunidades_submersas:data.comunidades_submersas,
   comunidades_cauda:data.comunidades_cauda,
   comunidades:proposed,habitats,
   restricoes:data.restricoes,totais:expected,categorias:categories,
   aprovacao_autoral:false,altera_canon:false,
   horizonte:horizon.frentes.filter(f=>["frente:macro:ilhas","frente:macro:submersos","frente:macro:cauda"].includes(f.id)).map(f=>({
      id:f.id,titulo:f.titulo,unidade:f.unidade,faixa:[f.referencia_inferior,f.referencia_superior]
   }))};
}
