/** Ciclo XLVIII — auditoria derivada diretamente dos quatro lotes e do inventário. */
const norm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").trim();
const dictionary=[
 ["Humanos",/\bhuman(?:o|a|os|as)\b/i],
 ["Elfos",/\belfos?\b|\belficas?\b|\belficos?\b/i],
 ["Anões",/\ban[aã]os?\b|\banoes\b|\banões\b/i],
 ["Gnomos",/\bgnom[oa]s?\b/i],
 ["Goblins e goblinoides",/\bgoblins?\b|\bgoblinoides?\b/i],
 ["Orcs",/\borcs?\b/i],
 ["Kobolds",/\bkobolds?\b/i],
 ["Feéricos e fadas",/\bfadas?\b|\bfeeric[oa]s?\b|\bfe[eé]ric[oa]s?\b|\bshadow fey\b/i],
 ["Svirfneblin",/\bsvirfneblin\b/i],
 ["Gigantes",/\bgigantes?\b/i],
 ["Draconatos",/\bdraconatos?\b/i],
 ["Tortles",/\btortles?\b/i],
 ["Tabaxis",/\btabaxis?\b/i],
 ["Kuo-Toa",/\bkuo.toa\b/i],
 ["Abissais marinhos",/\babissais?\b/i],
 ["Tritões",/\btrit[oõ]es?\b/i],
 ["Sereias",/\bsereias?\b/i],
 ["Miconídeos",/\bmicon[ií]deos?\b/i],
 ["Mortos-vivos",/\bmortos?.vivos?\b/i],
 ["Meio-demônios",/\bmeio.dem[oô]nios?\b/i],
 ["Elementais",/\belementais?\b/i],
 ["Sociedades vegetais ou minerais propostas",/\barvores conscientes\b|\bplantas sapientes\b|\bcriaturas vegetais\b|\bcactaceas sencientes\b|\barvores? conscientes\b|\belementais de pedra\b|\bcriaturas de calcario\b|\bcriaturas de argila\b|\bcorais sapientes\b/i],
 ["Sociedades animais propostas",/\baranhas inteligentes\b|\bmorcegos sapientes\b|\binsetoides sapientes\b|\bcorvideos inteligentes\b|\bpolvos inteligentes\b|\bcrustaceos sapientes\b|\bcorvide[oa]s?\b/i]
];
const getFirst=(obj,fields)=>fields.map(k=>obj[k]).find(v=>typeof v==="string"&&v.trim())||"";
export function buildSettlementDensityAudit(config,horizon,inventory,l1,l2,l3,l4){
 if(config?.schema_version!=="1.0"||config.estado!=="auditoria_editorial_sem_homologacao"||
    config.altera_canon!==false||config.aprovacao_autoral!==false||
    config.proibe_percentual_de_conclusao!==true||
    horizon?.altera_canon!==false||inventory?.altera_canon!==false||
    ![l1,l2,l3,l4].every(x=>x?.altera_canon===false&&x.aprovacao_autoral===false))
    throw Error("A auditoria perdeu a separação entre propostas e cânone");
 if(!Array.isArray(horizon.frentes)||horizon.frentes.length!==10||
    !Array.isArray(config.frentes)||config.frentes.length!==10||
    !Array.isArray(config.sem_faixa_numerica)||config.sem_faixa_numerica.length!==4)
    throw Error("As frentes da macroescala não correspondem ao plano editorial");
 const all=[
  ...l1.assentamentos.map(x=>({...x,lote:"lote01"})),
  ...l2.assentamentos.map(x=>({...x,lote:"lote02"})),
  ...l3.assentamentos.map(x=>({...x,lote:"lote03"})),
  ...l4.comunidades_insulares.map(x=>({...x,lote:"lote04_insular"})),
  ...l4.comunidades_submersas.map(x=>({...x,lote:"lote04_submerso"})),
  ...l4.comunidades_cauda.map(x=>({...x,lote:"lote04_cauda"}))
 ];
 const seen=new Set(),names=new Set(),frontMap=new Map(horizon.frentes.map(x=>[x.id,x]));
 const list=all.map(x=>{
  if(!x.id||seen.has(x.id)||!x.nome||names.has(norm(x.nome))||!frontMap.has(x.frente_id)||
    x.aprovacao_autoral!==false||x.estado!=="proposta_nao_canonica"||
    x.populacao!==null||
    (x.geometria!==undefined&&x.geometria!==null)||
    (x.localizacao!==undefined&&x.localizacao!==null)||
    (x.localizacao_exata!==undefined&&x.localizacao_exata!==null)||
    (x.rota!==undefined&&x.rota!==null)||
    (x.rotas!==undefined&&x.rotas!==null)||
    (x.rota_acesso!==undefined&&x.rota_acesso!==null))
    throw Error("Comunidade ausente, duplicada ou com estado/geografia não autorizados: "+x.id);
  seen.add(x.id);names.add(norm(x.nome));
  const people=x.habitantes_propostos||x.habitantes_descritos||x.criaturas_e_povos?.join(", ")||"";
  const govern=getFirst(x,["governo_proposto","governo_e_organizacao","organizacao"]);
  const sustain=getFirst(x,["sustento_hipotetico","subsistencia_e_oficios","subsistencia_hipotetica"]);
  const housing=getFirst(x,["modo_de_habitar","arquitetura_e_modo_de_habitar","habitacao_proposta","habitat_e_arquitetura"]);
  const conflict=getFirst(x,["tensao_politica","tensao_social","conflito_editorial"]);
  if([people,govern,sustain,housing,conflict].some(y=>typeof y!=="string"||y.length<12))
    throw Error("Povoado proposto sem descrição social/ecológica: "+x.id);
  const taxa=dictionary.filter(([name,re])=>re.test(norm(people))).map(([name])=>name);
  const island=Boolean(x.ilha_id)||(x.lote==="lote01"&&x.nome==="O Mosteiro das Tartarugas de Vidro");
  const submerged=x.frente_id==="frente:macro:submersos";
  const flags={
   governo_colegiado:/conselh|assembleia|colegiad|circulo|colegio|camara de mestres/.test(norm(govern)),
   alimentacao_hidrologia_verificada:false,
   topologia_aprovada:false,
   identidade_e_estrutura_descritiva:true,
   estatuto_canonicamente_aprovado:false
  };
  return {id:x.id,nome:x.nome,lote:x.lote,frente_id:x.frente_id,setor:x.setor,
   subzona:island?"insular":submerged?(x.setor==="azuis"?"oceano_azul":"mar_de_sangue"):x.frente_id==="frente:macro:costa"?"costa_nao_insular_nao_localizada":"regional",
   habitantes:people,governo:govern,sustento:sustain,habitacao:housing,conflito:conflict,
   tags_de_mencao:taxa,flags};
 });
 const islandIds=new Set();
 for(const x of l4.ilhas){
  if(!x.id||islandIds.has(x.id)||x.conta_como_assentamento!==false||
    x.aprovacao_autoral!==false||x.prova_ilha_existente!==false||
    x.localizacao!==null||x.coordenadas!==null)
    throw Error("Ilhas geográficas indevidamente convertidas em localidades aprovadas");
  islandIds.add(x.id);
 }
 const eco=[
  ...l2.habitats.map(x=>({...x,lote:"lote02",frente_id:"frente:macro:"+x.setor})),
  ...l3.habitats.map(x=>({...x,lote:"lote03"})),
  ...l4.habitats.map(x=>({...x,lote:"lote04",frente_id:"frente:macro:"+(x.frente==="ilhas"?"ilhas":x.frente)}))
 ];
 const ecoIds=new Set();
 for(const x of eco){
  if(!x.id||ecoIds.has(x.id)||!frontMap.has(x.frente_id)||x.conta_como_assentamento!==false)
    throw Error("Habitat repetido ou contado como comunidade: "+x.id);
  ecoIds.add(x.id);
 }
 const expected=config.contagens_esperadas;
 const check={comunidades_4_lotes:list.length,habitats_3_lotes:eco.length,
  ilhas_fisicas_propostas:islandIds.size,
  comunidades_vinculadas_a_ilhas_novas:l4.comunidades_insulares.length,
  propostas_aprovadas:0,
  registros_formais_inventario:inventory.registros_formais.length,
  grupos_equivalencia:inventory.equivalencias_para_deduplicacao.length};
 for(const [key,count] of Object.entries(check))
  if(expected?.[key]!==count)throw Error("A auditoria recebeu contagem incoerente: "+key);
 if(![...list,...eco].every(x=>typeof x.frente_id==="string"))
  throw Error("Há categoria regional ausente");
 const frames=config.frentes.map(conf=>{
   const target=frontMap.get(conf.id);if(!target)throw Error("Frente ausente do horizonte: "+conf.id);
   const proposals=list.filter(x=>x.frente_id===target.id);
   const habitats=eco.filter(x=>x.frente_id===target.id);
   const physical=target.unidade==="ilhas"?islandIds.size:0;
   const taxa=[...new Set(proposals.flatMap(x=>x.tags_de_mencao))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
   const bySub=Object.fromEntries([...new Set(proposals.map(x=>x.subzona))]
       .map(k=>[k,proposals.filter(x=>x.subzona===k).length]));
   const byOrigin=Object.fromEntries([...new Set(proposals.map(x=>x.lote))]
       .map(k=>[k,proposals.filter(x=>x.lote===k).length]));
   return {...conf,unidade:target.unidade,referencia:[target.referencia_inferior,target.referencia_superior],
    propostas:proposals.length,ilhas_fisicas_propostas:physical,habitats:habitats.length,
    diversidade_mencoes:taxa,subzonas:bySub,lotes:byOrigin,
    governo_colegiado_mencoes:proposals.filter(x=>x.flags.governo_colegiado).length,
    fontes_sem_individualizacao:conf.id==="frente:macro:costa"?"Portomonte e duas redes/coletivos catalogados, sem censo continental":null,
    status:"apenas_densidade_editorial_nao_canonica",aprovadas_novas:0};
 });
 const allIds=new Set(frames.map(x=>x.id));
 if(allIds.size!==10||frames.reduce((a,f)=>a+f.propostas,0)!==82||
   frames.reduce((a,f)=>a+f.habitats,0)!==34||
   frames.reduce((a,f)=>a+f.ilhas_fisicas_propostas,0)!==10)
   throw Error("A distribuição entre frentes apresenta perda ou dupla contagem");
 const coast=frames.find(x=>x.id==="frente:macro:costa");
 const coastSplit={insulares:coast.subzonas.insular||0,
    nao_insulares_sem_confirmacao_continental:coast.subzonas.costa_nao_insular_nao_localizada||0};
 if(coastSplit.insulares!==7||coastSplit.nao_insulares_sem_confirmacao_continental!==1)
   throw Error("A auditoria perdeu a concentração insular das propostas costeiras");
 const ocean=frames.find(x=>x.id==="frente:macro:submersos");
 if(ocean.subzonas.mar_de_sangue!==7||ocean.subzonas.oceano_azul!==7)
   throw Error("A auditoria misturou mares rubro e azul");
 const sumAssembly=list.filter(x=>x.flags.governo_colegiado).length;
 return {titulo:config.titulo,nota_epistemica:config.nota_epistemica,
   politica_numerica:config.politica_numerica,contagens:check,frentes:frames,
   comunidades:list,habitats:eco.map(x=>({id:x.id,nome:x.nome,frente_id:x.frente_id,lote:x.lote})),
   ilhas:l4.ilhas.map(x=>({id:x.id,nome:x.nome,habitacao_vinculada:x.comunidades_associadas.length>0})),
   focos_sem_meta:config.sem_faixa_numerica,qualidade:config.eixos_qualidade,
   prioridades:config.prioridade_proximo_ciclo,
   indicadores:{mencoes_de_governo_colegiado:sumAssembly,
    descricoes_sociais_preenchidas:list.length,viabilidade_material_verificada:0,
    topologia_homologada:0,propostas_nao_canonicas:list.length,
    costa:coastSplit,submersos:{mar_de_sangue:7,oceanos_azuis:7}},
   nenhuma_contagem_documentada_geral:true};
}
