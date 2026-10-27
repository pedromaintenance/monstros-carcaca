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
