/**
 * Atlas autoral da Carcaça. Não mistura fichas mecânicas de D&D e Dungeon World.
 * const atlas = createCarcacaAtlas({baseUrl:
 *   "https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"});
 * const creaturas = await atlas.search({tipoCarcaca:"yokai",regiaoId:"regiao:foz-rio-ancestral"});
 */
export function createCarcacaAtlas({baseUrl,fetchImpl=fetch}={}) {
  if(!baseUrl) throw new TypeError("baseUrl é obrigatório");
  const root=baseUrl.replace(/\/+$/, "");
  const cache=new Map();

  async function load(file) {
    if(!cache.has(file)){
      cache.set(file,(async()=>{
        const result=await fetchImpl(root+"/"+file);
        if(!result.ok) throw new Error("Falha ao carregar "+file+": "+result.status);
        return result.json();
      })().catch(err=>{cache.delete(file);throw err;}));
    }
    return cache.get(file);
  }
  async function getManifest(){return load("manifest.json");}
  async function byKey(key){const m=await getManifest();return load(m.arquivos[key]);}
  async function getCatalog(){return byKey("catalog");}
  async function getIndexes(){return byKey("indexes");}
  async function getRegions(){return byKey("regions");}
  async function getLoreIndex(){return byKey("lore_index");}
  async function getHackMechanicsIndex(){return byKey("hack_mechanics_index");}
  async function getLoreRelations(){return byKey("lore_relations");}
  async function getLoreRelationIndexes(){return byKey("lore_relation_indexes");}
  async function searchLoreRelations({entidadeId,tipo,pagina}={}){
    return (await getLoreRelations()).filter(x=>
      (!entidadeId||x.origem_id===entidadeId||x.destino_id===entidadeId)&&
      (!tipo||x.tipo===tipo)&&
      (pagina===undefined||x.pagina===Number(pagina)));
  }
  async function getSelectedMovements(){return byKey("hack_selected_movements");}
  async function getCompletePilotMovements(){return byKey("hack_complete_pilot_movements");}
  async function getCompletePilotMovementIndexes(){return byKey("hack_complete_pilot_movement_indexes");}
  async function searchCompletePilotMovements({grupo,titulo,marcador,comOpcoes}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getCompletePilotMovements()).filter(x=>
      (!grupo||x.grupo===grupo)&&(!titulo||norm(x.titulo).includes(norm(titulo)))&&
      (!marcador||x.marcador_original===marcador)&&
      (comOpcoes===undefined||(x.opcoes.length>0)===comOpcoes));
  }
  async function getPeopleMovements(){return byKey("hack_people_movements");}
  async function getPeopleMovementIndexes(){return byKey("hack_people_movement_indexes");}
  async function getPeopleMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-povo:"))return null;
    return (await getPeopleMovements()).find(x=>x.id===id)??null;
  }
  async function searchPeopleMovements({grupo,marcador,titulo,query,comOpcoes,paragrafo}={}){
    const normalize=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getPeopleMovements()).filter(m=>
      (!grupo||m.grupo===grupo)&&
      (!marcador||m.marcador_original===marcador)&&
      (!titulo||normalize(m.titulo).includes(normalize(titulo)))&&
      (!query||normalize(m.titulo+" "+m.texto_original).includes(normalize(query)))&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (paragrafo===undefined||m.paragrafo_docx===Number(paragrafo)));
  }
  async function getGargantaRiverSocial(){return byKey("garganta_river_social");}
  async function getGargantaRiverSocialIndexes(){return byKey("garganta_river_social_indexes");}
  async function getGargantaRiverEntity(id){
    if(typeof id!=="string"||!id.startsWith("rio-garganta:"))return null;
    const d=await getGargantaRiverSocial();
    for(const categoria of ["lugares","oficios","pessoas","circuitos","memorias","acordos","cenas","arcos"]){
      const row=d[categoria].find(x=>x.id===id);
      if(row)return {...row,categoria};
    }
    return null;
  }
  async function searchGargantaRiverSocial({categoria,area,setor,movimentoHack,referencia,query}={}){
    const d=await getGargantaRiverSocial();
    const normal=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const rows=["lugares","oficios","pessoas","circuitos","memorias","acordos","cenas","arcos"]
      .flatMap(cat=>d[cat].map(item=>({...item,categoria:cat})));
    return rows.filter(row=>
      (!categoria||row.categoria===categoria)&&
      (!area||row.area===area)&&
      (!setor||row.setor===setor)&&
      (!movimentoHack||(row.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!referencia||(row.vinculos??[]).includes(referencia))&&
      (!query||normal([row.nome,row.vida,row.conflito,row.ancora].filter(Boolean).join(" ")).includes(normal(query))));
  }
  async function getCostaSulSeaPressure(){return byKey("costa_sul_sea_pressure");}
  async function getCostaSulSeaPressureIndexes(){return byKey("costa_sul_sea_pressure_indexes");}
  async function getCostaSulSeaPressureEntity(id){
    if(typeof id!=="string"||!id.startsWith("costa-mar:"))return null;
    const d=await getCostaSulSeaPressure();
    for(const categoria of ["nucleos","oficios","pessoas","impactos","fluxos","acordos","cenas","arcos"]){
      const item=d[categoria].find(x=>x.id===id);
      if(item)return {...item,categoria};
    }
    return null;
  }
  async function searchCostaSulSeaPressure({categoria,territorio,setor,papel,movimentoHack,referencia,query}={}){
    const d=await getCostaSulSeaPressure();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const flat=["nucleos","oficios","pessoas","impactos","fluxos","acordos","cenas","arcos"]
      .flatMap(k=>d[k].map(x=>({...x,categoria:k})));
    return flat.filter(x=>
      (!categoria||x.categoria===categoria)&&
      (!territorio||x.territorio===territorio)&&
      (!setor||x.setor===setor)&&
      (!papel||x.papel===papel)&&
      (!movimentoHack||(x.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!referencia||(x.referencias??[]).includes(referencia))&&
      (!query||norm([x.nome,x.rotina_cotidiana,x.tensao_politica,x.gatilho,x.decisao_central]
        .filter(Boolean).join(" ")).includes(norm(query))));
  }
  async function getMarSangueEconomy(){return byKey("mar_sangue_economy");}
  async function getMarSangueEconomyIndexes(){return byKey("mar_sangue_economy_indexes");}
  async function getMarSangueEconomyEntity(id){
    if(typeof id!=="string"||!id.startsWith("economia-mar:"))return null;
    const d=await getMarSangueEconomy();
    for(const categoria of ["polos","oficios","pessoas","fluxos","tributos","clandestinas","cenas","arcos"]){
      const item=d[categoria].find(x=>x.id===id);
      if(item)return {...item,categoria};
    }
    return null;
  }
  async function searchMarSangueEconomy({categoria,povo,setor,aguas,abuso,movimentoHack,referencia,query}={}){
    const d=await getMarSangueEconomy();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const all=["polos","oficios","pessoas","fluxos","tributos","clandestinas","cenas","arcos"]
      .flatMap(cat=>d[cat].map(x=>({...x,categoria:cat})));
    return all.filter(x=>
      (!categoria||x.categoria===categoria)&&(!povo||x.povo===povo)&&
      (!setor||x.setor===setor)&&(!aguas||x.aguas===aguas)&&
      (!abuso||x.abuso===abuso)&&
      (!movimentoHack||(x.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!referencia||(x.referencias??[]).includes(referencia))&&
      (!query||norm([x.nome,x.rotina,x.conflito].join(" ")).includes(norm(query))));
  }
  async function getMarSangueDiplomacy(){return byKey("mar_sangue_diplomacy");}
  async function getMarSangueDiplomacyIndexes(){return byKey("mar_sangue_diplomacy_indexes");}
  async function getMarSangueDiplomacyEntity(id){
    if(typeof id!=="string"||!id.startsWith("diplomacia-mar:"))return null;
    const d=await getMarSangueDiplomacy();
    for(const categoria of ["polos","casas","pessoas","disputas","tratados","cenas","missoes","arcos"]){
      const result=d[categoria].find(x=>x.id===id);
      if(result)return {...result,categoria};
    }
    return null;
  }
  async function searchMarSangueDiplomacy({categoria,povo,bloco,aguas,movimentoHack,referencia,query}={}){
    const d=await getMarSangueDiplomacy();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const list=["polos","casas","pessoas","disputas","tratados","cenas","missoes","arcos"]
      .flatMap(k=>d[k].map(x=>({...x,categoria:k})));
    return list.filter(x=>
      (!categoria||x.categoria===categoria)&&
      (!povo||x.povo===povo)&&(!bloco||x.bloco===bloco)&&
      (!aguas||x.aguas===aguas)&&
      (!movimentoHack||(x.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!referencia||(x.referencias??[]).includes(referencia))&&
      (!query||norm([x.nome,x.contexto_proposto,x.vida_ordinaria,x.questao_politica].join(" ")).includes(norm(query))));
  }
  async function getMarSangueSocialEcology(){return byKey("mar_sangue_social_ecology");}
  async function getMarSangueSocialEcologyIndexes(){return byKey("mar_sangue_social_ecology_indexes");}
  async function getMarSangueEntity(id){
    if(typeof id!=="string"||!id.startsWith("mar-sangue:"))return null;
    const obj=await getMarSangueSocialEcology();
    for(const categoria of ["zonas","coletivos","pessoas","pactos","fenomenos","cenas","tramas"]){
      const item=obj[categoria].find(x=>x.id===id);
      if(item)return {...item,categoria};
    }
    return null;
  }
  async function searchMarSangueEntities({categoria,povo,aguas,movimentoHack,ligacao,query}={}){
    const d=await getMarSangueSocialEcology();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const all=["zonas","coletivos","pessoas","pactos","fenomenos","cenas","tramas"]
      .flatMap(cat=>d[cat].map(x=>({...x,categoria:cat})));
    return all.filter(x=>
      (!categoria||x.categoria===categoria)&&
      (!povo||x.povo===povo)&&
      (!aguas||x.aguas===aguas)&&
      (!movimentoHack||(x.referencias_hack??[]).includes(movimentoHack))&&
      (!ligacao||(x.ligacoes??[]).includes(ligacao))&&
      (!query||norm([x.nome,x.rotina,x.tensao].join(" ")).includes(norm(query))));
  }
  async function getCostaSulSocialFabric(){return byKey("costa_sul_social_fabric");}
  async function getCostaSulSocialFabricIndexes(){return byKey("costa_sul_social_fabric_indexes");}
  async function getCostaSulEntity(id){
    if(typeof id!=="string"||!id.startsWith("costa-sul:"))return null;
    const d=await getCostaSulSocialFabric();
    for(const categoria of ["espacos","redes","pessoas","praticas","circulacoes","cenas","tramas"]){
      const found=d[categoria].find(x=>x.id===id);
      if(found)return {...found,categoria};
    }
    return null;
  }
  async function searchCostaSulEntities({categoria,escopo,movimentoHack,referencia,localId,query}={}){
    const d=await getCostaSulSocialFabric();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const all=["espacos","redes","pessoas","praticas","circulacoes","cenas","tramas"]
      .flatMap(k=>d[k].map(x=>({...x,categoria:k})));
    return all.filter(x=>
      (!categoria||x.categoria===categoria)&&
      (!escopo||x.escopo===escopo)&&
      (!movimentoHack||(x.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!referencia||(x.referencias??[]).includes(referencia))&&
      (!localId||x.local_id===localId)&&
      (!query||norm([x.nome,x.cotidiano,x.conflito].join(" ")).includes(norm(query))));
  }
  async function getFrontierCaatingaCostaSul(){return byKey("frontier_caatinga_costa_sul");}
  async function getFrontierCaatingaCostaSulIndexes(){return byKey("frontier_caatinga_costa_sul_indexes");}
  async function getFrontierEntity(id){
    if(typeof id!=="string"||!id.startsWith("fronteira:"))return null;
    const d=await getFrontierCaatingaCostaSul();
    for(const kind of ["encontros","pessoas","acordos","fluxos","cenas","tramas"]){
      const obj=d[kind].find(e=>e.id===id);
      if(obj)return {...obj,tipo:kind};
    }
    return null;
  }
  async function searchFrontierEntities({tipo,regiaoId,movimentoHack,encontroId,query}={}){
    const d=await getFrontierCaatingaCostaSul();
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const out=["encontros","pessoas","acordos","fluxos","cenas","tramas"]
      .flatMap(k=>d[k].map(x=>({...x,tipo:k})));
    return out.filter(x=>
      (!tipo||x.tipo===tipo)&&
      (!regiaoId||x.ancora_regional===regiaoId||x.base_regional===regiaoId||
        x.origem_proposta===regiaoId||x.destino_proposto===regiaoId)&&
      (!movimentoHack||(x.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!encontroId||x.id===encontroId||x.encontro_id===encontroId)&&
      (!query||norm([x.nome,x.titulo,x.conceito,x.vida_cotidiana,x.conflito,
        x.objetivo,x.disputa,x.acontecimento_inesperado,x.pergunta_motriz]
        .filter(Boolean).join(" ")).includes(norm(query))));
  }
  async function getCaatingaSocialNetwork(){return byKey("caatinga_social_network");}
  async function getCaatingaSocialIndexes(){return byKey("caatinga_social_indexes");}
  async function getCaatingaEntity(id){
    if(typeof id!=="string"||!id.startsWith("caatinga:"))return null;
    const obj=await getCaatingaSocialNetwork();
    for(const kind of ["comunidades","coletivos","pessoas","pontos_agua","rotas","conflitos","cenas"]){
      const entity=obj[kind].find(x=>x.id===id);
      if(entity)return {...entity,tipo:kind,subtipo_social:entity.tipo??null};
    }
    return null;
  }
  async function searchCaatingaEntities({tipo,tema,movimentoHack,comunidadeId,query}={}){
    const obj=await getCaatingaSocialNetwork();
    const kinds=["comunidades","coletivos","pessoas","pontos_agua","rotas","conflitos","cenas"];
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const flat=kinds.flatMap(k=>obj[k].map(x=>({...x,tipo:k,subtipo_social:x.tipo??null})));
    return flat.filter(e=>
      (!tipo||e.tipo===tipo)&&
      (!tema||(e.tags??[]).includes(tema))&&
      (!movimentoHack||(e.movimentos_inspiradores??[]).includes(movimentoHack))&&
      (!comunidadeId||e.comunidade_id===comunidadeId||
        (e.comunidade_ids??[]).includes(comunidadeId)||e.origem_id===comunidadeId||
        e.destino_id===comunidadeId||(e.conexoes??[]).includes(comunidadeId)||
        (e.ligacoes_propostas??[]).includes(comunidadeId))&&
      (!query||norm(Object.values(e).filter(x=>typeof x==="string").join(" ")).includes(norm(query))));
  }
  async function getRegionalPopulationProposals(){return byKey("regional_population_proposals");}
  async function getRegionalPopulationProposalIndexes(){return byKey("regional_population_proposal_indexes");}
  async function getRegionalPopulationProposal(id){
    if(typeof id!=="string")return null;
    const obj=await getRegionalPopulationProposals();
    return obj.sementes.find(x=>x.id===id)??null;
  }
  async function searchRegionalPopulationProposals({areaId,regiaoAtlasId,tema,movimentoHack,query}={}){
    const obj=await getRegionalPopulationProposals();
    const areas=new Map(obj.areas.map(a=>[a.id,a]));
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return obj.sementes.filter(s=>
      (!areaId||s.area_id===areaId)&&
      (!regiaoAtlasId||areas.get(s.area_id)?.regiao_atlas_id===regiaoAtlasId)&&
      (!tema||s.temas.includes(tema))&&
      (!movimentoHack||s.movimentos_inspiradores.includes(movimentoHack))&&
      (!query||norm([s.titulo,s.habitantes_propostos,s.personagem_central,s.vida_cotidiana,s.conflito_vivo,s.gancho_de_aventura].join(" ")).includes(norm(query))));
  }
  async function getFinalClassMovements(key){
    return byKey(key);
  }
  async function getFinalClassIndexes(key){
    return byKey(key);
  }
  async function searchFinalClassMoves(key,{titulo,query,paragrafo}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await byKey(key)).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (paragrafo===undefined||m.paragrafo_docx===Number(paragrafo)));
  }
  async function getYokaiScribeMovements(){return getFinalClassMovements("hack_yokai_scribe_movements");}
  async function getYokaiScribeMovementIndexes(){return getFinalClassIndexes("hack_yokai_scribe_movement_indexes");}
  async function searchYokaiScribeMovements(filters={}){return searchFinalClassMoves("hack_yokai_scribe_movements",filters);}
  async function getNobleMovements(){return getFinalClassMovements("hack_noble_movements");}
  async function getNobleMovementIndexes(){return getFinalClassIndexes("hack_noble_movement_indexes");}
  async function searchNobleMovements(filters={}){return searchFinalClassMoves("hack_noble_movements",filters);}
  async function getArchaeologistMovements(){return getFinalClassMovements("hack_archaeologist_movements");}
  async function getArchaeologistMovementIndexes(){return getFinalClassIndexes("hack_archaeologist_movement_indexes");}
  async function searchArchaeologistMovements(filters={}){return searchFinalClassMoves("hack_archaeologist_movements",filters);}
  async function getFinalClassMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    for(const key of ["hack_yokai_scribe_movements","hack_noble_movements","hack_archaeologist_movements"]){
      const found=(await byKey(key)).find(m=>m.id===id);
      if(found)return found;
    }
    return null;
  }
  async function getMercenaryMovements(){return byKey("hack_mercenary_movements");}
  async function getMercenaryMovementIndexes(){return byKey("hack_mercenary_movement_indexes");}
  async function getMercenaryMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getMercenaryMovements()).find(m=>m.id===id)??null;
  }
  async function searchMercenaryMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const ix=raizDependencia?await getMercenaryMovementIndexes():null;
    const subtree=raizDependencia?new Set(ix.by_raiz_dependencia[raizDependencia]??[]):null;
    return (await getMercenaryMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!subtree||subtree.has(m.id)));
  }
  async function getMercenaryRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getMercenaryMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const start=byId.get(id);if(!start)return null;
    const owned=new Set(movimentosPossuidos),seen=new Set([id]),chain=[];
    let current=start;
    while(current.requisito_estruturado){
      const required=current.requisito_estruturado.movimento_id;
      if(!byId.has(required)||seen.has(required))throw new Error("REQUER Mercenário sem alvo ou com ciclo");
      seen.add(required);current=byId.get(required);
      chain.push({movimento_id:required,titulo:current.titulo,presente_na_lista:owned.has(required)});
    }
    const present=chain.every(item=>item.presente_na_lista);
    return {movimento_id:id,requisito_literal:start.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:current.id,
      componentes_identificados_presentes:present,
      verificacao_estrutural:!chain.length?"sem_requer_literal":present?"componentes_identificados_presentes":"componentes_ausentes",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER obrigatório mesmo para concessão gratuita; diagnóstico não autoriza compras."};
  }
  async function getArtificerMovements(){return byKey("hack_artificer_movements");}
  async function getArtificerMovementIndexes(){return byKey("hack_artificer_movement_indexes");}
  async function getArtificerMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getArtificerMovements()).find(m=>m.id===id)??null;
  }
  async function searchArtificerMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const ix=raizDependencia?await getArtificerMovementIndexes():null;
    const subtree=raizDependencia?new Set(ix.by_raiz_dependencia[raizDependencia]??[]):null;
    return (await getArtificerMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!subtree||subtree.has(m.id)));
  }
  async function getArtificerRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getArtificerMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const start=byId.get(id);if(!start)return null;
    const held=new Set(movimentosPossuidos),seen=new Set([id]),chain=[];
    let current=start;
    while(current.requisito_estruturado){
      const required=current.requisito_estruturado.movimento_id;
      if(!byId.has(required)||seen.has(required))throw new Error("REQUER ARTÍFICE sem alvo ou com ciclo");
      seen.add(required);current=byId.get(required);
      chain.push({movimento_id:required,titulo:current.titulo,presente_na_lista:held.has(required)});
    }
    return {movimento_id:id,requisito_literal:start.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:current.id,
      componentes_identificados_presentes:chain.every(x=>x.presente_na_lista),
      verificacao_estrutural:!chain.length?"sem_requer_literal":
        chain.every(x=>x.presente_na_lista)?"componentes_identificados_presentes":"componentes_ausentes",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,aplicacao_canonica:false,
      observacao:"REQUER obrigatório, inclusive em concessão gratuita; diagnóstico não autoriza compra nem aplica efeitos."};
  }
  async function getNecromancerMovements(){return byKey("hack_necromancer_movements");}
  async function getNecromancerMovementIndexes(){return byKey("hack_necromancer_movement_indexes");}
  async function getNecromancerMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getNecromancerMovements()).find(m=>m.id===id)??null;
  }
  async function searchNecromancerMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getNecromancerMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getNecromancerRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getNecromancerMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const m=byId.get(id);if(!m)return null;
    const req=m.requisito_estruturado;
    const ids=req?.tipo==="movimento_exato"?[req.movimento_id]:
      req?.tipo==="todos"?req.itens.map(x=>x.movimento_id):[];
    const held=new Set(movimentosPossuidos);
    const checks=ids.map(movimento_id=>{
      const target=byId.get(movimento_id);
      if(!target)throw new Error("REQUER sem alvo em Necromante");
      return {movimento_id,titulo:target.titulo,presente_na_lista:held.has(movimento_id)};
    });
    return {movimento_id:id,requisito_literal:m.requisito_literal,
      requisito_estruturado:req,operador_literal:req?.operador_literal??null,
      componentes_requeridos:checks,
      componentes_identificados_presentes:checks.every(x=>x.presente_na_lista),
      verificacao_estrutural:!req?"sem_requer_literal":
        checks.every(x=>x.presente_na_lista)?"componentes_identificados_presentes":"componentes_ausentes",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER continua obrigatorio inclusive em concessao gratuita; verificacao nao homologa compra."};
  }
  async function getWarlockMovements(){return byKey("hack_warlock_movements");}
  async function getWarlockMovementIndexes(){return byKey("hack_warlock_movement_indexes");}
  async function getWarlockMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getWarlockMovements()).find(m=>m.id===id)??null;
  }
  async function searchWarlockMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const moves=await getWarlockMovements();
    const idx=raizDependencia?await getWarlockMovementIndexes():null;
    const branch=raizDependencia?new Set(idx.by_raiz_dependencia[raizDependencia]??[]):null;
    return moves.filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!branch||branch.has(m.id)));
  }
  async function getWarlockRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getWarlockMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const start=byId.get(id);if(!start)return null;
    const held=new Set(movimentosPossuidos),visited=new Set([id]),chain=[];
    let at=start;
    while(at.requisito_estruturado){
      const target=at.requisito_estruturado.movimento_id;
      if(visited.has(target)||!byId.has(target))throw new Error("Ciclo ou REQUER sem alvo em Bruxo");
      visited.add(target);at=byId.get(target);
      chain.push({movimento_id:target,titulo:at.titulo,presente_na_lista:held.has(target)});
    }
    return {movimento_id:id,requisito_literal:start.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:at.id,
      componentes_identificados_presentes:chain.every(x=>x.presente_na_lista),
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER permanece obrigatório, mesmo em movimentos gratuitos. A presença de movimentos não concede pactos nem autoriza compras."};
  }
  async function getSorcererMovements(){return byKey("hack_sorcerer_movements");}
  async function getSorcererMovementIndexes(){return byKey("hack_sorcerer_movement_indexes");}
  async function getSorcererMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getSorcererMovements()).find(x=>x.id===id)??null;
  }
  async function searchSorcererMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const movimentos=await getSorcererMovements();
    const index=raizDependencia?await getSorcererMovementIndexes():null;
    const branch=raizDependencia?new Set(index.by_raiz_dependencia[raizDependencia]??[]):null;
    return movimentos.filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!branch||branch.has(m.id)));
  }
  async function getSorcererRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getSorcererMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const move=byId.get(id);if(!move)return null;
    const held=new Set(movimentosPossuidos),seen=new Set([id]),chain=[];
    let current=move;
    while(current.requisito_estruturado){
      const parent=current.requisito_estruturado.movimento_id;
      if(seen.has(parent)||!byId.has(parent))throw new Error("Ciclo ou REQUER sem alvo em Feiticeiro");
      seen.add(parent);current=byId.get(parent);
      chain.push({movimento_id:parent,titulo:current.titulo,presente_na_lista:held.has(parent)});
    }
    return {movimento_id:id,requisito_literal:move.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:current.id,
      componentes_identificados_presentes:chain.every(x=>x.presente_na_lista),
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"Diagnostico de REQUER. A presenca de movimentos nao homologa nem autoriza a compra."};
  }
  async function getMageMovements(){return byKey("hack_mage_movements");}
  async function getMageMovementIndexes(){return byKey("hack_mage_movement_indexes");}
  async function getMageMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getMageMovements()).find(x=>x.id===id)??null;
  }
  async function searchMageMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const movimentos=await getMageMovements();
    const index=raizDependencia?await getMageMovementIndexes():null;
    const branch=raizDependencia?new Set(index.by_raiz_dependencia[raizDependencia]??[]):null;
    return movimentos.filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!branch||branch.has(m.id)));
  }
  async function getMageRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getMageMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const move=byId.get(id);if(!move)return null;
    const held=new Set(movimentosPossuidos),seen=new Set([id]),chain=[];
    let current=move;
    while(current.requisito_estruturado){
      const parent=current.requisito_estruturado.movimento_id;
      if(seen.has(parent)||!byId.has(parent))throw new Error("Ciclo ou REQUER sem alvo em Mago");
      seen.add(parent);current=byId.get(parent);
      chain.push({movimento_id:parent,titulo:current.titulo,presente_na_lista:held.has(parent)});
    }
    return {movimento_id:id,requisito_literal:move.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:current.id,
      componentes_identificados_presentes:chain.every(x=>x.presente_na_lista),
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"Diagnostico de REQUER. A presenca de movimentos nao homologa nem autoriza a compra."};
  }
  async function getDruidMovements(){return byKey("hack_druid_movements");}
  async function getDruidMovementIndexes(){return byKey("hack_druid_movement_indexes");}
  async function getDruidMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getDruidMovements()).find(m=>m.id===id)??null;
  }
  async function searchDruidMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getDruidMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getDruidRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getDruidMovements(),byId=new Map(moves.map(m=>[m.id,m]));
    const root=byId.get(id);if(!root)return null;
    const held=new Set(movimentosPossuidos),seen=new Set();
    const requisitos=[];
    function check(m,stack){
      if(stack.has(m.id))throw new Error("Ciclo em REQUER do Druida");
      const req=m.requisito_estruturado;
      if(!req)return;
      const ids=req.tipo==="movimento_exato"?[req.movimento_id]:
        req.tipo==="todos"?req.itens.map(i=>i.movimento_id):null;
      if(!ids)throw new Error("Tipo de REQUER druídico não reconhecido");
      for(const targetId of ids){
        const target=byId.get(targetId);
        if(!target)throw new Error("REQUER druídico sem alvo");
        if(!seen.has(targetId)){
          seen.add(targetId);
          requisitos.push({movimento_id:targetId,titulo:target.titulo,
            presente_na_lista:held.has(targetId)});
          check(target,new Set([...stack,m.id]));
        }
      }
    }
    check(root,new Set());
    return {movimento_id:id,requisito_literal:root.requisito_literal,
      requisito_estruturado:root.requisito_estruturado,
      operador_literal:root.requisito_estruturado?.operador_literal??null,
      componentes_requeridos:requisitos,
      componentes_identificados_presentes:requisitos.every(x=>x.presente_na_lista),
      verificacao_estrutural:!root.requisito_estruturado?"sem_requer_literal":
        requisitos.every(x=>x.presente_na_lista)?"componentes_identificados_presentes":
        "componentes_ausentes",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER permanece obrigatório mesmo se recebido gratuitamente. A prévia não autoriza compra nem aplica efeitos."};
  }
  async function getClericMovements(){return byKey("hack_cleric_movements");}
  async function getClericMovementIndexes(){return byKey("hack_cleric_movement_indexes");}
  async function getClericMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getClericMovements()).find(m=>m.id===id)??null;
  }
  async function searchClericMovements({titulo,query,requer,comRequer,comOpcoes,raizDependencia}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const moves=await getClericMovements();
    const ix=raizDependencia?await getClericMovementIndexes():null;
    const subtree=raizDependencia?new Set(ix.by_raiz_dependencia[raizDependencia]??[]):null;
    return moves.filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!subtree||subtree.has(m.id)));
  }
  async function getClericDependencyChain(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const moves=await getClericMovements();
    const byId=new Map(moves.map(m=>[m.id,m]));
    const start=byId.get(id);if(!start)return null;
    const seen=new Set([id]), held=new Set(movimentosPossuidos), chain=[];
    let current=start;
    while(current.requisito_estruturado){
      const required=current.requisito_estruturado.movimento_id;
      if(seen.has(required)||!byId.has(required))throw new Error("Ciclo ou REQUER sem alvo em Clérigo");
      seen.add(required);current=byId.get(required);
      chain.push({movimento_id:required,titulo:current.titulo,presente_na_lista:held.has(required)});
    }
    return {movimento_id:id,requisito_literal:start.requisito_literal,
      cadeia_imediato_para_raiz:chain,raiz_movimento_id:current.id,
      componentes_identificados_presentes:chain.every(m=>m.presente_na_lista),
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER continua obrigatório; a cadeia é apenas um diagnóstico, sem compra ou efeitos automáticos."};
  }
  async function getPaladinMovements(){return byKey("hack_paladin_movements");}
  async function getPaladinMovementIndexes(){return byKey("hack_paladin_movement_indexes");}
  async function getPaladinMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getPaladinMovements()).find(m=>m.id===id)??null;
  }
  async function searchPaladinMovements({titulo,query,requer,comRequer,comOpcoes,comConcessoes}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getPaladinMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (comConcessoes===undefined||(m.concessoes_gratuitas_literais.length>0)===comConcessoes));
  }
  async function getPaladinRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const m=await getPaladinMovement(id);if(!m)return null;
    const req=m.requisito_estruturado;
    const presente=req?movimentosPossuidos.includes(req.movimento_id):null;
    return {movimento_id:id,requisito_literal:m.requisito_literal,
      requisito_estruturado:req,componente_requerido:req?.movimento_id??null,
      componente_identificado_presente:presente,
      verificacao_estrutural:!req?"sem_requer_literal":
        presente?"componente_identificado_presente":"componente_ausente",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,aplicacao_canonica:false,
      observacao:"REQUER permanece obrigatorio, mesmo em concessao gratuita."};
  }
  async function getPaladinGrantPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const origem=await getPaladinMovement(id);if(!origem)return null;
    return {origem_movimento_id:id,origem_identificada_presente:movimentosPossuidos.includes(id),
      concessoes:origem.concessoes_gratuitas_literais.map(g=>({
        ...g,pre_requisito_identificado_presente:movimentosPossuidos.includes(id),
        atribuicao_automatica:false,habilitado_para_compra:null})),
      aplicacao_canonica:false,observacao:"Concessao literal nao remove REQUER nem aplica efeitos."};
  }
  async function getMartialArtistMovements(){return byKey("hack_martial_artist_movements");}
  async function getMartialArtistMovementIndexes(){return byKey("hack_martial_artist_movement_indexes");}
  async function getMartialArtistMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getMartialArtistMovements()).find(m=>m.id===id)??null;
  }
  async function searchMartialArtistMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getMartialArtistMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getMartialArtistRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const movimento=await getMartialArtistMovement(id);
    if(!movimento)return null;
    const preview=await getClassRequirementPreview(id,{movimentosPossuidos});
    const req=movimento.requisito_estruturado;
    const ids=req?.tipo==="todos"?
      req.itens.filter(x=>x.tipo==="movimento_exato").map(x=>x.movimento_id):
      req?.tipo==="movimento_exato"?[req.movimento_id]:[];
    const present=new Set(movimentosPossuidos);
    const checks=ids.map(movimento_id=>({movimento_id,presente_na_lista:present.has(movimento_id)}));
    return {...preview,especificacao_literal:movimento.requisito_literal,
      requisito_estruturado:req,componentes_requeridos:checks,
      componentes_identificados_presentes:checks.every(x=>x.presente_na_lista),
      verificacao_estrutural:!req?"sem_requer_literal":
        checks.every(x=>x.presente_na_lista)?"componentes_identificados_presentes":
        "componentes_ausentes",
      operador_literal:req?.operador_literal??null,
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"REQUER é obrigatório, inclusive em concessão gratuita. Diagnóstico estrutural não homologa compra nem aplica efeitos."};
  }
  async function getBardMovements(){return byKey("hack_bard_movements");}
  async function getBardMovementIndexes(){return byKey("hack_bard_movement_indexes");}
  async function getBardMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getBardMovements()).find(m=>m.id===id)??null;
  }
  async function searchBardMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getBardMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getBardRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser array");
    const movimento=await getBardMovement(id);
    if(!movimento)return null;
    const requisito=movimento.requisito_estruturado;
    if(requisito?.tipo!=="todos" || !requisito.itens.some(x=>x.tipo==="quantidade_movimentos_grupo")){
      const base=await getClassRequirementPreview(id,{movimentosPossuidos});
      return {...base,requisito_estruturado:requisito,
        habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,aplicacao_canonica:false};
    }
    const explicit=requisito.itens.find(x=>x.tipo==="movimento_exato");
    const group=requisito.itens.find(x=>x.tipo==="quantidade_movimentos_grupo");
    if(!explicit||!group)throw new TypeError("REQUER cardinal inválido");
    const present=new Set(movimentosPossuidos);
    const bardIds=new Set((await getBardMovements()).filter(m=>m.grupo===group.grupo).map(m=>m.id));
    const excluded=new Set(group.excluir_movimentos_ids);
    const outros=[...present].filter(x=>bardIds.has(x)&&!excluded.has(x));
    const arte=present.has(explicit.movimento_id);
    const quantidadeSuficiente=outros.length>=group.quantidade_minima;
    return {movimento_id:id,requisito_literal:movimento.requisito_literal,
      requisito_estruturado:requisito,operador:"todos",
      componentes:[
        {tipo:"movimento_exato",movimento_id:explicit.movimento_id,presente_na_lista:arte},
        {tipo:"quantidade_movimentos_grupo",grupo:group.grupo,
          quantidade_minima:group.quantidade_minima,
          presentes_ids:outros,quantidade_presente:outros.length,
          quantidade_suficiente:quantidadeSuficiente}
      ],
      verificacao_estrutural:arte&&quantidadeSuficiente
        ?"componentes_identificados_presentes"
        :!arte?"arte_arcana_ausente":"outros_movimentos_insuficientes",
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"Prévia não homologa elegibilidade: Arte Arcana e dois OUTROS movimentos distintos de Bardo são obrigatórios, mesmo quando gratuitos."};
  }
  async function getRogueMovements(){return byKey("hack_rogue_movements");}
  async function getRogueMovementIndexes(){return byKey("hack_rogue_movement_indexes");}
  async function getRogueMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getRogueMovements()).find(m=>m.id===id)??null;
  }
  async function searchRogueMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getRogueMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getRogueRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos)||!movimentosPossuidos.every(x=>typeof x==="string"))
      throw new TypeError("movimentosPossuidos deve ser array de identificadores");
    const mov=await getRogueMovement(id);
    if(!mov)return null;
    const req=mov.requisito_estruturado;
    const requisitos=req?.tipo==="movimento_exato"?[req]:
      req?.tipo==="qualquer"?req.itens:[];
    const owned=new Set(movimentosPossuidos);
    const componentes=requisitos.map(item=>({
      tipo:item.tipo,movimento_id:item.movimento_id,
      presente_na_lista:owned.has(item.movimento_id)
    }));
    const resultado=!req?"sem_requer_literal":
      req.tipo==="referencia_sem_alvo"?"referencia_sem_alvo_documentado":
      req.tipo==="qualquer"?
        (componentes.some(x=>x.presente_na_lista)?"uma_alternativa_presente":"nenhuma_alternativa_presente"):
      componentes[0]?.presente_na_lista?"movimento_requerido_presente":"movimento_requerido_ausente";
    return {
      movimento_id:id,requisito_literal:mov.requisito_literal,requisito_estruturado:req,
      componentes,verificacao_estrutural:resultado,
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"Prévia diagnóstica, nunca aquisição automática. Referências sem alvo (Perfil) exigem decisão autoral; REQUER permanece obrigatório inclusive quando concedido gratuitamente."
    };
  }
  async function getHunterMovements(){return byKey("hack_hunter_movements");}
  async function getHunterMovementIndexes(){return byKey("hack_hunter_movement_indexes");}
  async function getHunterMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getHunterMovements()).find(m=>m.id===id)??null;
  }
  async function searchHunterMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito,comCondicaoFiccional}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getHunterMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito)&&
      (comCondicaoFiccional===undefined||m.requisito_estruturado?.itens?.some(
        x=>x.tipo==="condicao_ficcional")===comCondicaoFiccional ||
        (comCondicaoFiccional===false&&!m.requisito_estruturado?.itens?.some(
        x=>x.tipo==="condicao_ficcional"))));
  }
  async function getHunterRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos)||!movimentosPossuidos.every(x=>typeof x==="string"))
      throw new TypeError("movimentosPossuidos deve ser um array de identificadores");
    const movimento=await getHunterMovement(id);
    if(!movimento)return null;
    const req=movimento.requisito_estruturado;
    const itens=req?.tipo==="movimento_exato"?[req]:
                ["todos","qualquer"].includes(req?.tipo)?req.itens:[];
    const owned=new Set(movimentosPossuidos);
    const verificacoes=itens.map(item=>item.tipo==="movimento_exato"?{
      tipo:item.tipo,movimento_id:item.movimento_id,
      presente_na_lista:owned.has(item.movimento_id),
      comprovacao_ficcional:null
    }:{
      tipo:item.tipo,condicao_literal:item.texto_literal,
      presente_na_lista:null,comprovacao_ficcional:"pendente_avaliacao"
    });
    const estados=verificacoes.filter(x=>x.tipo==="movimento_exato").map(x=>x.presente_na_lista);
    let verificacaoEstrutural;
    if(!req)verificacaoEstrutural="sem_requer_literal";
    else if(req.tipo==="todos")verificacaoEstrutural=
      estados.every(Boolean)&&verificacoes.every(x=>x.tipo==="movimento_exato")?
      "componentes_identificados_presentes":"componentes_ausentes_ou_nao_comprovados";
    else if(req.tipo==="qualquer")verificacaoEstrutural=
      estados.some(Boolean)?"alternativa_de_movimento_presente":
      verificacoes.some(x=>x.tipo==="condicao_ficcional")?
      "alternativa_ficcional_pendente":"alternativas_identificadas_ausentes";
    else verificacaoEstrutural=estados[0]?"componente_identificado_presente":"componente_ausente";
    return {
      movimento_id:id,requisito_literal:movimento.requisito_literal,
      operador:req?.tipo??"nenhum",componentes:verificacoes,
      verificacao_estrutural:verificacaoEstrutural,
      habilitado_para_compra:null,necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"Prévia diagnóstica: REQUER nunca é dispensado; reconhecimento de títulos não equivale a homologação ou autorização de seleção."
    };
  }
  async function getBarbarianMovements(){return byKey("hack_barbarian_movements");}
  async function getBarbarianMovementIndexes(){return byKey("hack_barbarian_movement_indexes");}
  async function getBarbarianMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getBarbarianMovements()).find(m=>m.id===id)??null;
  }
  async function searchBarbarianMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getBarbarianMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getBarbarianRequirementPreview(id,{movimentosPossuidos=[]}={}){
    if(!Array.isArray(movimentosPossuidos))throw new TypeError("movimentosPossuidos deve ser um array");
    const mov=await getBarbarianMovement(id);
    if(!mov)return null;
    const preview=await getClassRequirementPreview(id,{movimentosPossuidos});
    const req=mov.requisito_estruturado;
    const ids=req?.tipo==="todos"?req.itens.map(i=>i.movimento_id):
              req?.tipo==="movimento_exato"?[req.movimento_id]:[];
    const possui=new Set(movimentosPossuidos);
    return {...preview,especificacao_literal:mov.requisito_literal,
      requisito_estruturado:req,
      componentes_requeridos:ids.map(movimento_id=>({
        movimento_id,presente_na_lista:possui.has(movimento_id)})),
      componentes_identificados_presentes:ids.every(item=>possui.has(item)),
      habilitado_para_compra:null,
      necessita_avaliacao_do_mestre:true,
      aplicacao_canonica:false,
      observacao:"A verificação dos componentes não autoriza aquisição. REQUER permanece obrigatório, mesmo para movimentos concedidos gratuitamente."};
  }
  async function getWarriorMovements(){return byKey("hack_warrior_movements");}
  async function getWarriorMovementIndexes(){return byKey("hack_warrior_movement_indexes");}
  async function getWarriorMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getWarriorMovements()).find(m=>m.id===id)??null;
  }
  async function searchWarriorMovements({titulo,query,requer,comRequer,comOpcoes,tipoRequisito}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getWarriorMovements()).filter(m=>
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!requer||norm(m.requisito_literal).includes(norm(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (comOpcoes===undefined||(m.opcoes.length>0)===comOpcoes)&&
      (!tipoRequisito||(m.requisito_estruturado?.tipo??"nenhum")===tipoRequisito));
  }
  async function getWarriorRequirementPreview(id,{movimentosPossuidos=[]}={}){
    const mov=await getWarriorMovement(id);
    if(!mov)return null;
    const preview=await getClassRequirementPreview(id,{movimentosPossuidos});
    return {...preview,especificacao_literal:mov.requisito_literal,
      requisito_estruturado:mov.requisito_estruturado,
      aplicacao_canonica:false,
      observacao:"Diagnóstico de dependências, não autorização automática de aquisição."};
  }
  async function getClassMovementInventory(){return byKey("hack_class_movement_inventory");}
  async function getClassMovementIndexes(){return byKey("hack_class_movement_indexes");}
  async function getClassRequirementCandidates(){return byKey("hack_class_requirement_candidates");}
  async function getClassRequirementPending(){return byKey("hack_class_requirement_pending");}
  async function getClassMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-classe:"))return null;
    return (await getClassMovementInventory()).find(x=>x.id===id)??null;
  }
  async function searchClassMovements({grupo,titulo,requer,comRequer,paragrafo}={}){
    const normalize=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getClassMovementInventory()).filter(m=>
      (!grupo||m.grupo===grupo)&&
      (!titulo||normalize(m.titulo).includes(normalize(titulo)))&&
      (!requer||normalize(m.requisito_literal).includes(normalize(requer)))&&
      (comRequer===undefined||Boolean(m.requisito_literal)===comRequer)&&
      (paragrafo===undefined||m.paragrafo_docx===Number(paragrafo)));
  }
  async function getClassRequirementPreview(id,{movimentosPossuidos=[]}={}){
    return previewClassRequirements(id,await getClassMovementInventory(),
      await getClassRequirementCandidates(),await getClassRequirementPending(),
      {movimentosPossuidos});
  }
  async function getHackCoreRules(){return byKey("hack_core_rules");}
  async function getGeneralMovements(){return byKey("hack_general_movements");}
  async function getGeneralMovementIndexes(){return byKey("hack_general_movement_indexes");}
  async function getGeneralMovement(id){
    if(typeof id!=="string"||!id.startsWith("movimento-geral:docx-"))return null;
    return (await getGeneralMovements()).find(x=>x.id===id)??null;
  }
  async function searchGeneralMovements({categoria,quadroId,titulo,query,faixa,comGatilho}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getGeneralMovements()).filter(m=>
      (!categoria||m.categoria===categoria)&&
      (!quadroId||m.quadro_id===quadroId)&&
      (!titulo||norm(m.titulo).includes(norm(titulo)))&&
      (!query||norm(m.titulo+" "+m.texto_original).includes(norm(query)))&&
      (!faixa||m.marcadores_resultado_literais.some(f=>f.faixa===faixa))&&
      (comGatilho===undefined||(m.gatilhos_literais.length>0)===comGatilho));
  }
  async function getDocxTables(){return byKey("hack_docx_tables");}
  async function getDocxTableIndexes(){return byKey("hack_docx_table_indexes");}
  async function searchDocxTables({tipo,titulo}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getDocxTables()).filter(x=>
      (!tipo||x.tipo===tipo)&&(!titulo||norm(x.titulo).includes(norm(titulo))));
  }
  async function getSelectedMovementIndexes(){return byKey("hack_selected_movement_indexes");}
  async function searchSelectedMovements({grupo,categoria,requisito,texto}={}){
    const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (await getSelectedMovements()).filter(x=>
      (!grupo||x.grupo===grupo)&&(!categoria||x.categoria===categoria)&&
      (!requisito||norm(x.requisito_literal).includes(norm(requisito)))&&
      (!texto||norm(x.titulo).includes(norm(texto))));
  }
  async function searchHackMechanicsPages({query,categoria,pagina,comRequer}={}){
    const ix=await getHackMechanicsIndex();
    const normalize=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const search=normalize(query).trim();
    return ix.paginas_indice.filter(p=>
      (!categoria||p.categoria===categoria)&&
      (pagina===undefined||p.pagina===Number(pagina))&&
      (comRequer===undefined||(p.mencoes_requer_na_pagina.length>0)===comRequer)&&
      (!search||p.rotulos_detectados.some(title=>normalize(title).includes(search))||
        p.mencoes_requer_na_pagina.some(req=>normalize(req).includes(search))));
  }
  async function getLoreIndexIndexes(){return byKey("lore_index_indexes");}
  async function getLoreChronology(){return byKey("lore_chronology");}
  async function getLoreReviewNotes(){return byKey("lore_review_notes");}
  async function getLoreAtlasLinks(){return byKey("lore_atlas_links");}
  async function getLoreAtlasLinkIndexes(){return byKey("lore_atlas_link_indexes");}
  async function searchLoreAtlasLinks({regiaoId,perguntaId,entradaLoreId,parecer}={}){
    return (await getLoreAtlasLinks()).filter(p=>
      (!regiaoId||p.regiao_atlas_id===regiaoId)&&
      (!perguntaId||p.pergunta_curadoria_id===perguntaId)&&
      (!entradaLoreId||p.entrada_lore_id===entradaLoreId)&&
      (!parecer||p.parecer===parecer));
  }
  async function getLoreEntity(id){
    if(typeof id!=="string"||!id.startsWith("lore-hack:"))return null;
    return (await getLoreIndex()).find(e=>e.id===id)??null;
  }
  async function searchLore({query,tipo,pagina}={}){
    const norm=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const text=norm(query).trim();
    return (await getLoreIndex()).filter(entry=>
      (!tipo||entry.tipo===tipo)&&
      (pagina==null||entry.paginas.includes(Number(pagina)))&&
      (!text||norm([entry.nome,entry.descricao,...entry.aliases].join(" ")).includes(text)));
  }
  async function getRegionalDossiers(){return byKey("regional_dossiers");}
  async function getResearchBacklog(){return byKey("research_backlog");}
  async function getResearchBacklogIndexes(){return byKey("research_backlog_indexes");}
  async function getResearchBacklogItem(id){
    if(typeof id!=="string"||!id.startsWith("pendencia:"))return null;
    return (await getResearchBacklog()).find(p=>p.id===id)??null;
  }
  async function searchResearchBacklog({regiaoId,tema,estado,faixaPrioridade,
                                      priorizada,dependeDePergunta,artefatoPotencial}={}){
    return (await getResearchBacklog()).filter(p=>
      (!regiaoId||p.regiao_id===regiaoId)&&
      (!tema||p.tema===tema)&&
      (!estado||p.estado===estado)&&
      (!faixaPrioridade||p.faixa_prioridade===faixaPrioridade)&&
      (priorizada===undefined||(p.ordem_editorial!==null)===priorizada)&&
      (!dependeDePergunta||p.depende_de_perguntas.includes(dependeDePergunta))&&
      (!artefatoPotencial||p.artefatos_potenciais.includes(artefatoPotencial)));
  }
  async function getRegionalDossierIndexes(){return byKey("regional_dossier_indexes");}
  async function getRegionalDossier(id){
    if(typeof id!=="string"||!id.startsWith("dossie-regional:"))return null;
    return (await getRegionalDossiers()).find(d=>d.id===id)??null;
  }
  async function searchRegionalDossiers({regiaoId,temaPergunta,semAssentamentosCurados,
                                        dinamicaId}={}){
    return (await getRegionalDossiers()).filter(d=>
      (!regiaoId||d.regiao_id===regiaoId)&&
      (!temaPergunta||d.perguntas.some(p=>p.tema===temaPergunta))&&
      (semAssentamentosCurados===undefined||
       (d.inventario.assentamentos.length===0)===semAssentamentosCurados)&&
      (!dinamicaId||d.inventario.dinamicas_territoriais.some(x=>x.id===dinamicaId)));
  }
  async function getTerritorialLabels(){return byKey("territorial_labels");}
  async function getTerritorialDynamics(){return byKey("territorial_dynamics");}
  async function getTerritorialIndexes(){return byKey("territorial_indexes");}
  async function getTerritorialDynamic(id){
    if(typeof id!=="string"||!id.startsWith("dinamica:"))return null;
    return (await getTerritorialDynamics()).find(d=>d.id===id)??null;
  }
  async function searchTerritorialDynamics({origemRegiaoId,destinoRegiaoId,rotuloId,tipo,dimensao}={}){
    return (await getTerritorialDynamics()).filter(d=>
      (!origemRegiaoId||d.origem_regiao_id===origemRegiaoId)&&
      (!destinoRegiaoId||d.destino_regiao_id===destinoRegiaoId)&&
      (!rotuloId||d.rotulos_territoriais.includes(rotuloId))&&
      (!tipo||d.tipo===tipo)&&
      (!dimensao||d.dimensoes_possivelmente_afetadas.includes(dimensao)));
  }
  async function getPlaces(){return byKey("places");}
  async function getFactions(){return byKey("factions");}
  async function getFronts(){return byKey("fronts");}
  async function getSettlements(){return byKey("settlements");}
  async function getSettlementLabels(){return byKey("settlement_labels");}
  async function getSettlementIndexes(){return byKey("settlement_indexes");}
  async function getPeoples(){return byKey("peoples");}
  async function getFlows(){return byKey("flows");}
  async function getMaterialDependencies(){return byKey("material_dependencies");}
  async function getMaterialBalances(){return byKey("material_balances");}
  async function getSupportProfiles(){return byKey("support_profiles");}
  async function getInfrastructureProfiles(){return byKey("infrastructure_profiles");}
  async function getInfrastructureIndexes(){return byKey("infrastructure_indexes");}
  async function getInfrastructureProfile(id){
    if(typeof id!=="string"||!id.startsWith("infraestrutura:"))return null;
    return (await getInfrastructureProfiles()).find(p=>p.id===id)??null;
  }
  async function searchInfrastructureProfiles({assentamentoId,natureza,setorId,estadoSetor}={}){
    return (await getInfrastructureProfiles()).filter(p=>
      (!assentamentoId||p.assentamento_id===assentamentoId)&&
      (!natureza||p.natureza===natureza)&&
      (!setorId||p.setores.some(s=>s.id===setorId&&(!estadoSetor||s.estado===estadoSetor)))&&
      (setorId||!estadoSetor||p.setores.some(s=>s.estado===estadoSetor))
    );
  }
  async function getSupportIndexes(){return byKey("support_indexes");}
  async function getSupportProfile(id){
    if(typeof id!=="string"||!id.startsWith("suporte:"))return null;
    return (await getSupportProfiles()).find(p=>p.id===id)??null;
  }
  async function searchSupportProfiles({assentamentoId,natureza,mobilidadeSazonal}={}){
    return (await getSupportProfiles()).filter(p=>
      (!assentamentoId||p.assentamento_id===assentamentoId)&&
      (!natureza||p.natureza_territorial===natureza)&&
      (!mobilidadeSazonal||p.demografia.mobilidade_sazonal===mobilidadeSazonal)
    );
  }
  async function getMaterialBalanceIndexes(){return byKey("material_balance_indexes");}
  async function getEcologicalPressures(){return byKey("ecological_pressures");}
  async function getEcologicalPressureIndexes(){return byKey("ecological_pressure_indexes");}
  async function searchMaterialBalances({assentamentoId,tipoRecurso,recursoId,sazonalidade}={}){
    return (await getMaterialBalances()).filter(b=>
      (!assentamentoId||b.assentamento_id===assentamentoId)&&
      (!tipoRecurso||b.tipo_recurso===tipoRecurso)&&
      (!recursoId||b.recurso_id===recursoId)&&
      (!sazonalidade||b.sazonalidade.tipo===sazonalidade));
  }
  async function searchEcologicalPressures({assentamentoId,dependenciaId,tipo}={}){
    return (await getEcologicalPressures()).filter(p=>
      (!assentamentoId||p.assentamento_id===assentamentoId)&&
      (!dependenciaId||p.dependencias_ids.includes(dependenciaId))&&
      (!tipo||p.tipo===tipo));
  }
  async function getMaterialDependencyIndexes(){return byKey("material_dependency_indexes");}
  async function searchMaterialDependencies({assentamentoId,fluxoId,tipo,estadoEvidencia}={}){
    return (await getMaterialDependencies()).filter(item=>
      (!assentamentoId||item.assentamento_id===assentamentoId)&&
      (!fluxoId||item.fluxo_id===fluxoId)&&
      (!tipo||item.tipo===tipo)&&
      (!estadoEvidencia||item.estado_evidencia===estadoEvidencia));
  }
  async function getSettlementScenarios(){return byKey("settlement_scenarios");}
  async function getSettlementScenario(id){
    if(typeof id!=="string"||!id.startsWith("cenario:"))return null;
    return (await getSettlementScenarios()).find(item=>item.id===id)??null;
  }
  async function searchSettlementScenarios({assentamentoId,movimentoDw}={}){
    return (await getSettlementScenarios()).filter(item=>
      (!assentamentoId||item.assentamentos.includes(assentamentoId))&&
      (!movimentoDw||item.movimento_dw===movimentoDw)
    );
  }
  async function getSettlement(id){
    if(typeof id!=="string"||!id.startsWith("assentamento:"))return null;
    return (await getSettlements()).find(item=>item.id===id)??null;
  }
  async function searchSettlements({regiaoId,rotuloId,povoId,natureza}={}){
    const all=await getSettlements();
    return all.filter(item=>
      (!regiaoId||item.regiao_id===regiaoId)&&
      (!rotuloId||item.rotulos_carcaca.some(x=>x.id===rotuloId))&&
      (!povoId||item.habitantes.some(x=>x.povo_id===povoId))&&
      (!natureza||item.natureza===natureza)
    );
  }
  async function getTypes(){return byKey("types");}
  async function get(id) {
    if(typeof id!=="string"||!id.startsWith("carcaca:criatura:"))return null;
    return (await byKey("creatures")).find(item=>item.id===id)??null;
  }
  const norm=(s)=>String(s??"").normalize("NFKD")
     .replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  async function search({query="",tipoCarcaca,tipoDnd,regiaoId,lugarId,faccaoId,
                         estado,ndMin,ndMax,limit=50,offset=0}={}) {
    if(!Number.isInteger(limit)||limit<0||limit>500)throw new RangeError("limit deve ser de 0 a 500");
    if(!Number.isInteger(offset)||offset<0)throw new RangeError("offset inválido");
    const rows=await getCatalog();
    const q=norm(query);
    return rows.filter(row=>
      (!q||norm(row.nome).includes(q)||norm(row.id).includes(q))&&
      (!tipoCarcaca||row.tipo_carcaca===tipoCarcaca)&&
      (!tipoDnd||row.tipo_dnd===tipoDnd)&&
      (!regiaoId||row.regioes.includes(regiaoId))&&
      (!lugarId||row.lugares.includes(lugarId))&&
      (!faccaoId||row.faccoes.includes(faccaoId))&&
      (!estado||row.estado===estado)&&
      (ndMin==null||(row.nd_dnd!=null&&row.nd_dnd>=ndMin))&&
      (ndMax==null||(row.nd_dnd!=null&&row.nd_dnd<=ndMax))
    ).slice(offset,offset+limit);
  }
  return {getManifest,getCatalog,getIndexes,getRegions,
          getLoreIndex,getLoreIndexIndexes,getLoreChronology,getLoreReviewNotes,
          getHackMechanicsIndex,searchHackMechanicsPages,
          getLoreRelations,getLoreRelationIndexes,searchLoreRelations,
          getSelectedMovements,getSelectedMovementIndexes,searchSelectedMovements,
          getCompletePilotMovements,getCompletePilotMovementIndexes,searchCompletePilotMovements,
          getDocxTables,getDocxTableIndexes,searchDocxTables,
          getGeneralMovements,getGeneralMovement,getGeneralMovementIndexes,searchGeneralMovements,
          getHackCoreRules,
          getPeopleMovements,getPeopleMovement,getPeopleMovementIndexes,searchPeopleMovements,
          getClassMovementInventory,getClassMovement,getClassMovementIndexes,searchClassMovements,
          getWarriorMovements,getWarriorMovement,getWarriorMovementIndexes,searchWarriorMovements,
          getHunterMovements,getHunterMovement,getHunterMovementIndexes,searchHunterMovements,
          getRogueMovements,getRogueMovement,getRogueMovementIndexes,searchRogueMovements,
          getBardMovements,getBardMovement,getBardMovementIndexes,searchBardMovements,
          getMartialArtistMovements,getMartialArtistMovement,getMartialArtistMovementIndexes,searchMartialArtistMovements,
          getPaladinMovements,getPaladinMovement,getPaladinMovementIndexes,searchPaladinMovements,
          getPaladinRequirementPreview,getPaladinGrantPreview,
          getClericMovements,getClericMovement,getClericMovementIndexes,
          searchClericMovements,getClericDependencyChain,
          getDruidMovements,getDruidMovement,getDruidMovementIndexes,
          searchDruidMovements,getDruidRequirementPreview,
          getMageMovements,getMageMovement,getMageMovementIndexes,
          searchMageMovements,getMageRequirementPreview,
          getSorcererMovements,getSorcererMovement,getSorcererMovementIndexes,
          searchSorcererMovements,getSorcererRequirementPreview,
          getNecromancerMovements,getNecromancerMovement,getNecromancerMovementIndexes,
          searchNecromancerMovements,getNecromancerRequirementPreview,
          getArtificerMovements,getArtificerMovement,getArtificerMovementIndexes,
          searchArtificerMovements,getArtificerRequirementPreview,
          getMercenaryMovements,getMercenaryMovement,getMercenaryMovementIndexes,
          searchMercenaryMovements,getMercenaryRequirementPreview,
          getYokaiScribeMovements,getYokaiScribeMovementIndexes,searchYokaiScribeMovements,
          getNobleMovements,getNobleMovementIndexes,searchNobleMovements,
          getArchaeologistMovements,getArchaeologistMovementIndexes,searchArchaeologistMovements,
          getFinalClassMovement,
          getRegionalPopulationProposals,getRegionalPopulationProposalIndexes,
          getRegionalPopulationProposal,searchRegionalPopulationProposals,
          getCaatingaSocialNetwork,getCaatingaSocialIndexes,getCaatingaEntity,searchCaatingaEntities,
          getFrontierCaatingaCostaSul,getFrontierCaatingaCostaSulIndexes,
          getFrontierEntity,searchFrontierEntities,
          getCostaSulSocialFabric,getCostaSulSocialFabricIndexes,
          getCostaSulEntity,searchCostaSulEntities,
          getMarSangueSocialEcology,getMarSangueSocialEcologyIndexes,
          getMarSangueEntity,searchMarSangueEntities,
          getMarSangueDiplomacy,getMarSangueDiplomacyIndexes,
          getMarSangueDiplomacyEntity,searchMarSangueDiplomacy,
          getMarSangueEconomy,getMarSangueEconomyIndexes,
          getMarSangueEconomyEntity,searchMarSangueEconomy,
          getCostaSulSeaPressure,getCostaSulSeaPressureIndexes,
          getCostaSulSeaPressureEntity,searchCostaSulSeaPressure,
          getGargantaRiverSocial,getGargantaRiverSocialIndexes,
          getGargantaRiverEntity,searchGargantaRiverSocial,
          getWarlockMovements,getWarlockMovement,getWarlockMovementIndexes,
          searchWarlockMovements,getWarlockRequirementPreview,
          getBardRequirementPreview,
          getMartialArtistRequirementPreview,
          getRogueRequirementPreview,
          getHunterRequirementPreview,
          getBarbarianMovements,getBarbarianMovement,getBarbarianMovementIndexes,
          searchBarbarianMovements,getBarbarianRequirementPreview,
          getWarriorRequirementPreview,
          getClassRequirementCandidates,getClassRequirementPending,getClassRequirementPreview,
          getLoreAtlasLinks,getLoreAtlasLinkIndexes,searchLoreAtlasLinks,
          getLoreEntity,searchLore,
          getRegionalDossiers,getRegionalDossier,getRegionalDossierIndexes,
          getResearchBacklog,getResearchBacklogItem,getResearchBacklogIndexes,
          searchResearchBacklog,
          searchRegionalDossiers,
          getTerritorialLabels,getTerritorialDynamics,getTerritorialIndexes,
          getTerritorialDynamic,searchTerritorialDynamics,
          getPlaces,getFactions,
          getFronts,getSettlements,getSettlementLabels,getSettlementIndexes,
          getPeoples,getFlows,getMaterialDependencies,getMaterialDependencyIndexes,
          getMaterialBalances,getMaterialBalanceIndexes,getSupportProfiles,
          getSupportIndexes,getSupportProfile,searchSupportProfiles,
          getInfrastructureProfiles,getInfrastructureIndexes,getInfrastructureProfile,
          searchInfrastructureProfiles,getEcologicalPressures,
          getEcologicalPressureIndexes,searchMaterialBalances,searchEcologicalPressures,
          searchMaterialDependencies,getSettlement,searchSettlements,
          getSettlementScenarios,getSettlementScenario,searchSettlementScenarios,
          getTypes,get,search};
}

/**
 * Prévia deliberadamente SEM EFEITOS de um cenário DW.
 * O mestre confirma manualmente pré-condições; o método não aplica rótulos
 * nem escreve dados do atlas ou estado de campanha.
 */
export function previewSettlementScenario(cenario,{condicoesConfirmadas=[]}={}){
  if(!cenario||cenario.estado!=="hipotese_nao_acontecida"||cenario.mutacao_canonica!==false){
    throw new TypeError("Somente cenários hipotéticos, sem mutação canônica");
  }
  if(!Array.isArray(condicoesConfirmadas)){
    throw new TypeError("condicoesConfirmadas deve ser array de descrições");
  }
  const confirmadas=new Set(condicoesConfirmadas);
  const pendentes=cenario.condicoes_nao_confirmadas.filter(item=>!confirmadas.has(item));
  return {
    id:cenario.id, movimento_dw:cenario.movimento_dw,
    estado:"simulacao_sem_mutacao",
    pronto_para_adjudicacao:pendentes.length===0,
    condicoes_pendentes:pendentes,
    resultados_possiveis:[...cenario.resultados_possiveis],
    pergunta_ao_mestre:cenario.pergunta_ao_mestre,
    observacao:"Não altera tags DW, dados canônicos ou saves; decisões e efeitos ficam a cargo do mestre."
  };
}

/**
 * Prévia ficcional de interrupção de uma dependência material, sem transição DW.
 * Percorre apenas relações explicitamente curadas como depende_de_id.
 * NÃO deduz fome, mortes, prejuízo de Prosperidade ou eventos canônicos.
 */
export function previewMaterialInterruption(dependencias,id){
  if(!Array.isArray(dependencias))throw new TypeError("dependencias deve ser array");
  const byId=new Map(dependencias.map(item=>[item.id,item]));
  const root=byId.get(id);
  if(!root)throw new RangeError("Dependência não encontrada: "+id);
  const found=[];
  const visited=new Set([id]);
  const queue=[id];
  while(queue.length){
    const current=queue.shift();
    for(const child of dependencias.filter(dep=>dep.depende_de_id===current)){
      if(visited.has(child.id))continue;
      visited.add(child.id);
      found.push({
        dependencia_id:child.id,
        assentamento_id:child.assentamento_id,
        efeito_hipotetico:child.consequencia_hipotetica,
        desconhecidos:[...child.desconhecidos],
        status:"exposicao_potencial_nao_confirmada"
      });
      queue.push(child.id);
    }
  }
  return {
    estado:"simulacao_sem_mutacao",
    mutacao_canonica:false,
    processo_inicial:id,
    assentamento_id:root.assentamento_id,
    condicao_inicial_hipotetica:"Interrupção do processo: "+root.fato,
    impactos_potenciais:found,
    efeitos_dw_aplicados:[],
    observacao:"Grafo apenas sugere exposição material. O mestre avalia eventos locais; nenhum dado canônico ou de campanha é alterado."
  };
}

/**
 * Checagem informativa: NUNCA libera compra de movimento.
 * REQUER é obrigatório mecanicamente, mas 14 expressões compostas/sem título
 * aguardam revisão semântica; links exatos também são candidatos, não homologações.
 */
export function previewClassRequirements(id,movimentos,candidatas,pendentes,
                                         {movimentosPossuidos=[]}={}){
  if(!Array.isArray(movimentos)||!Array.isArray(candidatas)||
     !Array.isArray(pendentes)||!Array.isArray(movimentosPossuidos)){
    throw new TypeError("Esperados quatro arrays de movimentos, relações e posse.");
  }
  const registro=movimentos.find(m=>m.id===id);
  if(!registro)return null;
  const possui=new Set(movimentosPossuidos);
  const edges=candidatas.filter(e=>e.origem_movimento_id===id);
  const naoResolvidas=pendentes.filter(e=>e.origem_movimento_id===id);
  return {
    movimento_id:id,
    titulo:registro.titulo,
    requisito_literal:registro.requisito_literal,
    vinculos_candidatos:edges.map(e=>({
      movimento_id:e.requisito_movimento_id,
      requisito_literal:e.requisito_literal,
      status:e.status,
      presente_na_lista:possui.has(e.requisito_movimento_id)
    })),
    expressoes_nao_resolvidas:naoResolvidas.map(p=>({
      requisito_literal:p.requisito_literal, motivo:p.motivo,
      candidatos_ids:[...p.candidatos_ids]
    })),
    todos_candidatos_presentes:edges.every(e=>possui.has(e.requisito_movimento_id)),
    habilitado_para_compra:null,
    necessita_avaliacao_do_mestre:true,
    aplicacao_canonica:false,
    observacao:"Candidatos não validados; REQUER sempre obrigatório, mesmo quando o movimento é concedido gratuitamente."
  };
}
