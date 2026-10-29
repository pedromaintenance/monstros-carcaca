
/*
 * Atlas hierárquico exploratório da Carcaça.
 * Fonte x localização x estatuto NÃO são intercambiáveis:
 * todo setor não registrado no catálogo oficial é uma pasta editorial de navegação.
 */
export const PLACE_TYPES=[
 ["assentamento","Assentamentos e comunidades","house"],
 ["bioma","Biomas e territórios naturais","trees"],
 ["fortaleza","Fortalezas e defesas","shield"],
 ["poder","Locais de poder e santuários","sparkles"],
 ["masmorra","Masmorras, arquivos e covis","skull"],
 ["ruina","Ruínas e memória","landmark"],
 ["rota","Rios, passagens e infraestrutura","route"],
 ["nucleo","Microespaços propostos","draft"],
 ["ambito","Sem local individualizado","circle-help"]
];
export const CONTENT_TYPES=[
 ["povos","Povos e comunidades"],
 ["culturas","Culturas, práticas e tradições"],
 ["personagens","Personagens e figuras"],
 ["criaturas","Monstros e ameaças"],
 ["fauna","Fauna fantástica"],
 ["flora","Flora e fungos"],
 ["itens","Itens mágicos e relíquias"],
 ["faccoes","Facções e instituições"],
 ["divindades","Divindades e cultos"],
 ["conceitos","Memória, eventos e conceitos"]
];
const regionDefs=[
 ["garganta","Garganta · Extremo Leste","Crânio, escavações, ocupação e culto solar corrompido",null],
 ["rio","Rio Ancestral · Drakport","Eixo fluvial, circulação, servidão e Templo da Lua",null],
 ["costa","Costa Sul · Mar de Sangue","Portomonte, comunidades insulares, cavernas e águas rubras","regiao:costa-sul"],
 ["caatinga","Caatinga · Além Sul","Terras áridas, exilados, orcs e disputas de água","regiao:caatinga"],
 ["eldroth","Eldroth · Vandar","Floresta sob Sylara, ruínas e ocupação dos mortos","regiao:eldroth"],
 ["thargrid","Thargrid · Ironwood","Montanhas e resistência; não implica a mesma jurisdição",null],
 ["foz","Foz · Boca do Abismo","Abismo, Gualápolis e Arquivo dos Mortos Afogados","regiao:foz-rio-ancestral"],
 ["shadar","Shadar-Riverie · Corte","Centro aristocrático; relação geográfica com Gualápolis em revisão",null],
 ["grama","Grama-Cortada","Condado e comunidades hobbits agrícolas",null],
 ["cauda","Cauda · Templo do Crepúsculo","Palácio de Sarastra na cauda de Golzdov",null],
 ["azuis","Águas azuis · Periferia marítima","Povos marinhos além da frente do Mar de Sangue",null],
 ["transversal","Referências sem localização precisa","Panteões, povos e conceitos que não devem ser situados por suposição",null]
];
const placeDefs={
 "abismo":["foz","bioma"],"arquivo-mortos-afogados":["foz","masmorra"],
 "boca-do-abismo":["foz","fortaleza"],"drakport":["rio","assentamento"],
 "garganta":["garganta","assentamento"],"grama-cortada":["grama","assentamento"],
 "gualapolis":["foz","ruina"],"ilhas-monasticas":["costa","assentamento"],
 "ironwood":["thargrid","bioma"],"mar-de-sangue":["costa","bioma"],
 "portomonte":["costa","assentamento"],"reino-sob-montanha":["thargrid","fortaleza"],
 "rio-ancestral":["rio","rota"],"shadar-riverie":["shadar","assentamento"],
 "templo-da-lua":["rio","poder"],"templo-das-sombras":["foz","ruina"],
 "templo-demeter":["costa","poder"],"templo-do-crepusculo":["cauda","poder"],
 "templo-yolskaariin":["garganta","poder"],"vandar":["eldroth","ruina"]
};
const extraPlaces=[
 ["floresta-eldroth","eldroth","bioma","Floresta de Eldroth","lugar:eldroth","data/lugares_carcaca.json","Floresta sob ocupação shadow fey."],
 ["cavernas-kuo-toa","costa","assentamento","Cavernas e cidades kuo-toa (conjunto regional)","lugar:cavernas-kuo-toa","data/lugares_carcaca.json","Habitat coletivo documentado; cavernas e cidades submarinas não equivalem a uma cidade única."],
 ["caatinga-bioma","caatinga","bioma","Terras áridas da Caatinga","lore-hack:caatinga","data/lore/hack-carcaca-dw-indice-tematico.json","Recorte territorial, não povoado inventado."],
 ["montanhas-thargrid","thargrid","bioma","Montanhas de Thargrid","lore-hack:thargrid","data/lore/hack-carcaca-dw-indice-tematico.json","Território montanhoso; limites e cidades individuais em estudo."],
 ["aguas-azuis","azuis","bioma","Águas azuis","lore-hack:oceanos-azuis","data/lore/hack-carcaca-dw-indice-tematico.json","Cidades de tritões e sereias referidas sem nomes e coordenadas."],
 ["sede-eldroth","eldroth","ambito","Ocorrências regionais sem sítio confirmado","regional:eldroth","data/propostas/eldroth-ecologia-monstruosa-dw.json","Associação ecológica ampla, sem covil individual comprovado."],
 ["povos-do-rio","rio","ambito","Referências ao eixo fluvial (sem local exato)","regional:rio","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-da-costa","costa","ambito","Referências ao litoral (sem local exato)","regional:costa","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-da-caatinga","caatinga","ambito","Referências regionais (sem local exato)","regional:caatinga","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-de-thargrid","thargrid","ambito","Referências montanhosas (sem local exato)","regional:thargrid","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-de-foz","foz","ambito","Referências da foz (sem local exato)","regional:foz","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-de-shadar","shadar","ambito","Referências da Corte (sem local exato)","regional:shadar","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-globais","transversal","ambito","Sem residência regional confirmada","regional:transversal","data/lore/hack-carcaca-dw-indice-tematico.json","Pasta técnica, não um território da Carcaça."],
 ["povos-de-garganta","garganta","ambito","Referências do leste (sem local exato)","regional:garganta","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui assentamento."],
 ["povos-de-grama","grama","ambito","Tradições do Condado (sem local exato)","regional:grama","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui povoado individual."],
 ["povos-da-cauda","cauda","ambito","Referências da cauda (sem local exato)","regional:cauda","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui povoado individual."],
 ["povos-das-azuis","azuis","ambito","Referências marítimas (sem local exato)","regional:azuis","data/lore/hack-carcaca-dw-indice-tematico.json","Não constitui cidade submarina individual."]
];
const curatedPlaces={
 "lugar:arquivo-dos-mortos-afogados":"arquivo-mortos-afogados",
 "lugar:boca-do-abismo":"boca-do-abismo",
 "lugar:gualapolis":"gualapolis",
 "lugar:portomonte":"portomonte",
 "lugar:eldroth":"floresta-eldroth",
 "lugar:ilhas-costa-sul":"ilhas-monasticas",
 "lugar:cavernas-kuo-toa":"cavernas-kuo-toa",
 "lugar:vandar":"vandar"
};
const seedRegions={garganta:"garganta",rio:"rio",costa:"costa",caatinga:"caatinga",eldroth:"eldroth",thargrid:"thargrid",foz:"foz",shadar:"shadar"};
const peopleAssignments={
 "abissais-marinhos":["mar-de-sangue"],
 "anoes-thargrid":["reino-sob-montanha"],
 "draconatos-thargrid":["montanhas-thargrid"],
 "druidas-eldroth":["floresta-eldroth"],
 "elfos-floresta":["floresta-eldroth","ironwood"],
 "feericos":["povos-globais"],
 "gigantes-fogo":["montanhas-thargrid"],
 "gigantes-gelo":["montanhas-thargrid"],
 "gigantes-pedra":["montanhas-thargrid"],
 "gigantes-thargrid":["montanhas-thargrid"],
 "gnomos":["povos-globais"],
 "gnomos-floresta":["povos-globais"],
 "gnomos-rochas":["povos-globais"],
 "hobbits":["grama-cortada"],
 "humanos":["povos-globais"],
 "kuo-toa":["cavernas-kuo-toa"],
 "meio-demonios":["povos-globais"],
 "orcs-caatinga":["povos-da-caatinga"],
 "rangers-ironwood":["fortaleza-ranger-ironwood"],
 "sereias":["aguas-azuis"],
 "shadow-fey":["shadar-riverie"],
 "svirfneblin":["povos-globais"],
 "tabaxis":["ilhas-monasticas"],
 "tortles":["ilhas-monasticas"],
 "tritoes":["aguas-azuis"],
 "yokai-antigos":["povos-de-foz"]
};
const actors={
 "alquam":"povos-de-foz","birka-uln-shayr":"shadar-riverie",
 "damaris-blackthorn":"vandar","elara-stormoak":"fortaleza-ranger-ironwood",
 "mammon":"povos-de-foz","menelau-folha-seca":"grama-cortada",
 "morwen-nightshade":"drakport","rayquaza":"povos-de-thargrid",
 "sarastra-aestruum":"templo-do-crepusculo","severina-shadowbloom":"templo-da-lua",
 "sylara-nightwhisper":"floresta-eldroth","trelohim-uln-shayr":"povos-globais",
 "ulorian-uln-shayr":"boca-do-abismo","varys-duskveil":"garganta",
 "voragar":"povos-de-thargrid","xandros-gloomspire":"templo-das-sombras"
};
const actorNotes={
 "alquam":"Ameaça demoníaca associada ao Abismo; localização pessoal não confirmada.",
 "mammon":"Influência demoníaca na invasão do Abismo; não indica residência individual.",
 "rayquaza":"Associação histórica a Thargrid; destino atual desconhecido.",
 "voragar":"Referência histórica; nenhuma presença atual confirmada.",
 "xandros-gloomspire":"Vínculo histórico ao Templo das Sombras, posteriormente abandonado.",
 "trelohim-uln-shayr":"Sem fixação de residência por inferência familiar.",
 "ulorian-uln-shayr":"Fortaleza da Boca do Abismo; relação geográfica com Shadar em revisão."
};
const factionAssignments={
 "casa-shayr":"shadar-riverie",
 "confederacao-ossos":"povos-de-garganta",
 "corte-feerica":"shadar-riverie",
 "resistencia":"povos-globais"
};
const concepts={
 "agricultura-hobbit":["grama-cortada","flora"],
 "ateismo-arcano":["povos-globais","culturas"],
 "memoria-oral-sereias":["aguas-azuis","culturas"],
 "cartografia-gnomica":["povos-globais","culturas"],
 "devocao-ancestral":["povos-globais","culturas"],
 "culto-rainha-noite":["templo-do-crepusculo","divindades"],
 "tributacao-abissais":["mar-de-sangue","culturas"],
 "direito-de-nomear":["povos-globais","culturas"],
 "druidas-rangers":["povos-de-thargrid","culturas"],
 "producao-thargrid":["montanhas-thargrid","culturas"],
 "guerrilha-ironwood":["ironwood","culturas"],
 "fronteira-mar-aguas":["mar-de-sangue","conceitos"],
 "viagem-tabaxi":["ilhas-monasticas","culturas"],
 "pactos-juramentos-feericos":["shadar-riverie","culturas"],
 "kanji-ossos":["povos-globais","culturas"],
 "ossos-sacralidade":["povos-globais","culturas"],
 "lingua-yokai":["povos-de-foz","culturas"],
 "economia-resistencia":["povos-globais","culturas"],
 "mosteiros-tortles":["ilhas-monasticas","culturas"],
 "mudanca-oceano":["mar-de-sangue","conceitos"],
 "autonomia-cidades-marinhas":["aguas-azuis","culturas"],
 "natureza-demonica-unica":["povos-globais","conceitos"],
 "ordenamento-gigantes":["montanhas-thargrid","culturas"],
 "limite-ordenamento":["montanhas-thargrid","culturas"],
 "resistencia-hobbit":["grama-cortada","culturas"],
 "patrulhas-tritoes":["aguas-azuis","culturas"],
 "ecologia-ocupada-eldroth":["floresta-eldroth","conceitos"],
 "teocracia-kuo-toa":["cavernas-kuo-toa","culturas"],
 "pluralidade-panteoes":["povos-globais","culturas"]
};
const specificDivinities={"demeter":"templo-demeter","daegon":"cavernas-kuo-toa","yolskaariin":"templo-yolskaariin"};
const sourceUrl=p=>"https://github.com/pedromaintenance/monstros-carcaca/blob/main/"+p;
const req=(obj,k,df=[])=>obj&&Array.isArray(obj[k])?obj[k]:df;
export function buildAtlasTree(d){
  const list=[],ids=new Set(),placeByKey=new Map(),categories=new Map();
  const make=(o)=>{
    if(ids.has(o.id))throw new Error("Nó duplicado: "+o.id);
    ids.add(o.id);list.push(o);return o;
  };
  make({id:"carcaca",parentId:null,kind:"mundo",label:"A Carcaça",status:"manuscrito",
    summary:"Continente formado sobre o corpo de Golzdov. Geografia e política se cruzam em ocupação, resistência e memória.",source:"data/lore/hack-carcaca-dw-indice-tematico.json"});
  const regionKeys=new Map();
  for(const [key,name,subtitle,canonical] of regionDefs){
    const id="regiao-visual:"+key;
    make({id,parentId:"carcaca",kind:"regiao",label:name,status:canonical?"catalogado":"organizador",
      summary:subtitle+" · Setor de navegação, não nova delimitação política.",
      source:canonical?"data/regioes_carcaca.json":"data/lore/hack-carcaca-dw-indice-tematico.json",
      canonicalRegionId:canonical,regionKey:key});
    regionKeys.set(key,id);
  }
  const placeNames=new Set();
  const addPlace=(key,region,type,name,status,summary,source,sourceId,pages=[],extra={})=>{
    if(placeByKey.has(key))throw new Error("Lugar duplicado: "+key);
    const bucket="grupo-lugar:"+region+":"+type;
    if(!ids.has(bucket)){
      const label=PLACE_TYPES.find(p=>p[0]===type)?.[1]||type;
      make({id:bucket,parentId:regionKeys.get(region),kind:"tipo",label,status:"organizador",summary:"Classe de lugar para navegação territorial.",regionKey:region,type});
    }
    const id="lugar-visual:"+key;
    make({id,parentId:bucket,kind:"lugar",label:name,status,summary,source,sourceId,pages,regionKey:region,placeType:type,...extra});
    placeByKey.set(key,id);placeNames.add(key);return id;
  };
  // Uma localidade pode pertencer a outro lugar — e pode conter localidades por sua vez.
  // O parentesco espacial é explícito; nenhum vínculo narrativo implica hierarquia geográfica.
  const addNestedPlace=(key,parentKey,type,name,status,summary,source,sourceId,pages=[],extra={})=>{
    if(placeByKey.has(key))throw new Error("Localidade duplicada: "+key);
    const parentId=placeByKey.get(parentKey);
    const parent=list.find(n=>n.id===parentId);
    if(!parent)throw new Error("Lugar pai inexistente: "+parentKey);
    const id="lugar-visual:"+key;
    make({id,parentId,kind:"localidade",label:name,status,summary,source,sourceId,pages,
      regionKey:parent.regionKey,placeType:type,localidadeInterna:true,...extra});
    placeByKey.set(key,id);placeNames.add(key);return id;
  };
  const reparentTo=(key,parentKey)=>{
    const child=list.find(n=>n.id===placeByKey.get(key));
    const parent=list.find(n=>n.id===placeByKey.get(parentKey));
    if(!child||!parent)throw new Error("Subordinação territorial impossível: "+key+" → "+parentKey);
    if(child.regionKey!==parent.regionKey)throw new Error("Vínculo espacial cruza setor: "+key);
    child.parentId=parent.id;
    child.kind="localidade";
    child.localidadeInterna=true;
  };
  const markUnspecifiedSettlements=(parentKey)=>{
    const parentId=placeByKey.get(parentKey);
    make({id:"lacuna-localidades:"+parentKey,parentId,kind:"lacuna_localidades",
      label:"Outras vilas e cidades — ainda não individualizadas",status:"organizador",
      summary:"Reserva de estrutura para assentamentos futuros. As fontes atuais não confirmam nomes, quantidade, posição ou existência de vilas adicionais nesta área.",
      regionKey:list.find(n=>n.id===parentId)?.regionKey,empty:true});
  };
  const getBucket=(key,contentType)=>{
    const pid=placeByKey.get(key);
    if(!pid)throw new Error("Lugar ausente para categoria: "+key);
    const id=pid+"::"+contentType;
    if(!ids.has(id)){
      const label=CONTENT_TYPES.find(c=>c[0]===contentType)?.[1]||contentType;
      make({id,parentId:pid,kind:"categoria",contentType,label,status:"organizador",
        summary:"Categoria de registros. Quando não existem entradas, é uma lacuna de catalogação."});
    }
    return id;
  };
  const addEntry=(key,contentType,e)=>{
    const bucket=getBucket(key,contentType);
    make({id:"registro:"+e.sourceId+"@"+key+"#"+contentType,parentId:bucket,kind:"registro",
      label:e.name,status:e.status,summary:e.description||"",source:e.source||"",
      sourceId:e.sourceId,pages:e.pages||[],recordType:contentType,
      ...e.extra});
  };
  const fromLore=x=>({sourceId:x.id,name:x.nome,status:"manuscrito",
    description:x.descricao,pages:x.paginas,
    source:"data/lore/hack-carcaca-dw-indice-tematico.json",
    extra:{evidence:x.evidencia||"afirmado_no_rascunho"}});
  const lore=req(d.lore,"entradas");
  for(const x of lore.filter(x=>x.tipo==="lugar")){
    const slug=x.id.slice("lore-hack:".length);
    const p=placeDefs[slug];
    if(!p)throw new Error("Lugar do manuscrito sem setor: "+slug);
    addPlace(slug,p[0],p[1],x.nome,"manuscrito",x.descricao,
      "data/lore/hack-carcaca-dw-indice-tematico.json",x.id,x.paginas);
  }
  for(const [key,region,type,label,sourceId,source,description] of extraPlaces)
    addPlace(key,region,type,label,key.startsWith("povos-")||key==="sede-eldroth"?"organizador":"manuscrito",
      description,source,sourceId);
  // Exemplos comprováveis de profundidade cinco: um lugar abrange outro.
  // A forte posição ranger é um núcleo de Ironwood, NÃO uma nova cidade inventada.
  addNestedPlace("fortaleza-ranger-ironwood","ironwood","assentamento",
    "Fortaleza ranger — núcleo de Ironwood","manuscrito",
    "Núcleo defensivo documentado da resistência de Ironwood; não é um segundo município nem atesta outras aldeias.",
    "data/lore/hack-carcaca-dw-indice-tematico.json","lore-hack:ironwood",[],{derivadoDe:"lore-hack:ironwood"});
  // Estes vínculos são explícitos no manuscrito; não se inferem rotas ou distâncias.
  for(const [child,parent] of [
    ["reino-sob-montanha","montanhas-thargrid"],
    ["templo-demeter","portomonte"],
    ["templo-yolskaariin","garganta"],
    ["arquivo-mortos-afogados","gualapolis"],
    ["templo-da-lua","rio-ancestral"]
  ])reparentTo(child,parent);
  // Microespaços anteriores de Ironwood, expressamente NÃO confirmados.
  // Se vierem a ser aprovados, podem tornar-se refúgios, bairros ou vilas sem mudar o modelo.
  for(const loc of req(d.ironwoodLocales,"lugares")
       .filter(x=>x.ancora_canonica==="Ironwood"&&x.local_confirmado===false)){
    const key="ironwood-proposta-"+loc.id.split(":").at(-1);
    addNestedPlace(key,"ironwood","nucleo",loc.nome,"proposta",
      loc.rotina_cotidiana+" Tensão possível: "+loc.tensao_social,
      "data/propostas/ironwood-eldroth-resistencia-hack.json",loc.id,[],
      {approval:false,precisao:"microespaco_nao_confirmado"});
  }
  // Posição na árvore é reserva de expansão; não confirma outras cidades.
  for(const key of ["ironwood","reino-sob-montanha","grama-cortada","ilhas-monasticas","drakport"])
    markUnspecifiedSettlements(key);
  for(const p of req(d.places,"lugares")){
    const key=curatedPlaces[p.id];
    if(key){
      const id=placeByKey.get(key),n=list.find(x=>x.id===id);
      if(n){n.curatedPlaceId=p.id;n.curatedStatus=p.estado||"documentado";}
    }
  }
  // Sempre mostre todas as categorias dentro de cada lugar. Pastas vazias são lacunas, não dados inventados.
  for(const key of placeNames)for(const [ct] of CONTENT_TYPES)getBucket(key,ct);
  for(const x of lore){
    if(x.tipo==="povo")for(const key of peopleAssignments[x.id.slice(10)]||["povos-globais"])
      addEntry(key,"povos",fromLore(x));
    if(x.tipo==="personagem"){
      const slug=x.id.slice(10),key=actors[slug]||"povos-globais";
      const e=fromLore(x);
      if(actorNotes[slug])e.description+=" Nota de localização: "+actorNotes[slug];
      addEntry(key,"personagens",e);
    }
    if(x.tipo==="faccao")addEntry(factionAssignments[x.id.slice(10)]||"povos-globais","faccoes",fromLore(x));
    if(x.tipo==="divindade")addEntry(specificDivinities[x.id.slice(10)]||"povos-globais","divindades",fromLore(x));
    if(x.tipo==="conceito"){
      const assigned=concepts[x.id.slice(10)]||["povos-globais","conceitos"];
      addEntry(assigned[0],assigned[1],fromLore(x));
    }
  }
  // Monstros formalizados são ocorrências do Arquivo; nunca se espalham automaticamente para o continente.
  for(const x of Array.isArray(d.creatures)?d.creatures:[]){
    const place=(x.ocorrencias||[]).find(o=>o.lugar_id==="lugar:arquivo-dos-mortos-afogados");
    if(place){
      const isDwStats=x.dungeon_world?.estatisticas?.pv!=null;
      addEntry("arquivo-mortos-afogados","criaturas",{sourceId:x.id,name:x.nome,status:"catalogado",
        description:"Ocorrência associada ao Arquivo. "+(x.dungeon_world?.instinto||"")+
          (isDwStats?" · Estatísticas DW em revisão.":" · Estatísticas DW não homologadas."),
        source:"curadoria/criaturas/arquivo-dos-mortos-afogados.json",
        extra:{canonicalOccurrence:true,dwStatus:x.dungeon_world?.estado,habitat:x.ecologia?.habitat||null}});
    }
  }
  // Ecologia de Eldroth: são hipóteses, não ocorrências exatas nem novos monstros canonizados.
  const dwEntries=new Set(req(d.statblocks,"fichas").map(x=>x.criatura_origem_id));
  for(const x of req(d.ecology,"criaturas")){
    const biological=x.id.includes("cardos")?"flora":x.id.includes("micelio")?"flora":
      ["coruja","besouros","cervo","cao-de-esporos"].some(s=>x.id.includes(s))?"fauna":"criaturas";
    addEntry("floresta-eldroth",biological,{sourceId:x.id,name:x.nome,status:"proposta",
      description:"Organismo/criatura proposto para a ecologia de Eldroth, sem covil específico confirmado."+
        (dwEntries.has(x.id)?" Ficha DW candidata disponível no Ciclo XIII.":""),
      source:"data/propostas/eldroth-ecologia-monstruosa-dw.json",
      extra:{dwDraft:dwEntries.has(x.id),precisao:"regional_proposta"}});
  }
  // Microespaços do Ciclo de Povoamento: não promovidos a assentamentos nem endereços reais.
  for(const x of req(d.seeds,"sementes")){
    const region=seedRegions[x.area_id?.replace("area-proposta:","")];
    if(!region)continue;
    const key="semente-"+x.id.slice("povoamento-proposto:".length);
    addPlace(key,region,"nucleo",x.titulo,"proposta",
      (x.local_proposto||"")+". "+(x.vida_cotidiana||""),
      "data/propostas/povoamento-regional-hack-carcaca.json",x.id,[],
      {precisao:"microespaco_nao_canonico",approval:false});
    // Só localizar abaixo de outro lugar quando o próprio enunciado indicar interioridade.
    if(x.id==="povoamento-proposto:conselho-dos-juramentos")
      reparentTo(key,"reino-sob-montanha");
    if(x.id==="povoamento-proposto:turno-das-escavadoras")
      reparentTo(key,"templo-yolskaariin");
    if(x.id==="povoamento-proposto:cartorio-das-portas-raspadas")
      reparentTo(key,"garganta");
    addEntry(key,"personagens",{sourceId:x.id+":personagem",name:x.personagem_central||"Figura proposta",
      status:"proposta",description:"Personagem e cena não canônicos vinculados à proposta.",
      source:"data/propostas/povoamento-regional-hack-carcaca.json"});
    addEntry(key,"culturas",{sourceId:x.id+":cotidiano",name:"Práticas cotidianas propostas",
      status:"proposta",description:x.vida_cotidiana||"Sem detalhes.",
      source:"data/propostas/povoamento-regional-hack-carcaca.json"});
    addEntry(key,"conceitos",{sourceId:x.id+":conflito",name:"Tensão local proposta",
      status:"proposta",description:x.conflito_vivo||"Sem detalhes.",
      source:"data/propostas/povoamento-regional-hack-carcaca.json"});
  }
  // Conteúdos das localidades hipotéticas: não transmitem estatuto factual ao seu lugar-pai.
  for(const loc of req(d.ironwoodLocales,"lugares")
       .filter(x=>x.ancora_canonica==="Ironwood"&&x.local_confirmado===false)){
    const key="ironwood-proposta-"+loc.id.split(":").at(-1);
    addEntry(key,"culturas",{sourceId:loc.id+":rotina",name:"Prática cotidiana hipotética",
      status:"proposta",description:loc.rotina_cotidiana,
      source:"data/propostas/ironwood-eldroth-resistencia-hack.json"});
    addEntry(key,"conceitos",{sourceId:loc.id+":tensao",name:"Tensão social hipotética",
      status:"proposta",description:loc.tensao_social,
      source:"data/propostas/ironwood-eldroth-resistencia-hack.json"});
  }
  // Dados de assentamentos coletivos: nunca calcular população, riqueza ou defesa.
  for(const x of Array.isArray(d.settlements)?d.settlements:[]){
    const site=curatedPlaces[x.lugar_id];
    if(site){
      addEntry(site,"conceitos",{sourceId:x.id,name:"Ficha de assentamento: "+x.nome,status:"catalogado",
        description:"Registro em rascunho factual. População, defesas e prosperidade DW não determinadas.",
        source:"curadoria/assentamentos/"+(x.id.includes("portomonte")?"portomonte":x.id.includes("cavernas")?"rede-cavernas-kuo-toa":"comunidades-insulares-costa-sul")+".json",
        extra:{dwPopulation:null,dwProsperity:null}});
    }
  }
  addEntry("arquivo-mortos-afogados","itens",{
    sourceId:"item:lanca-da-perdicao:referencia",name:"Lança da Perdição (referência narrativa)",
    status:"manuscrito",description:"Artefato disputado nas fontes do Arquivo. Não há localização de câmara, propriedades mágicas, raridade ou estatísticas DW homologadas nesta árvore.",
    source:"curadoria/frentes/disputa-pela-lanca.json",
    extra:{itemCompleto:false}
  });
  // A flora de Grama-Cortada documenta grupos agrícolas, não espécies botânicas nomeadas.
  addEntry("grama-cortada","flora",{sourceId:"ecologia:grama-cortada:agricultura",name:"Pomares, hortas, cereais e raízes (categorias)",
    status:"manuscrito",description:"Conjuntos agrícolas mencionados pelo Hack; espécies botânicas e cultivares não identificados.",
    source:"data/lore/hack-carcaca-dw-indice-tematico.json"});
  // Relações explícitas via referência textual, sem implicar conexão topológica.
  const relations=[
    ["templo-demeter","portomonte","Local de poder associado ao assentamento"],
    ["templo-yolskaariin","garganta","Templo localizado em Garganta"],
    ["arquivo-mortos-afogados","gualapolis","Biblioteca antiga associada a Gualápolis"],
    ["shadar-riverie","gualapolis","Relação espacial e histórica em revisão; não fixar coordenadas"],
    ["boca-do-abismo","gualapolis","Fortaleza erguida sobre área da antiga cidade"],
    ["templo-da-lua","rio-ancestral","Templo em ilha do rio, posição precisa desconhecida"],
    ["templo-do-crepusculo","templo-das-sombras","Novo palácio após abandono do templo anterior"],
    ["ironwood","floresta-eldroth","Povos e resistência relacionados; não são o mesmo lugar"]
  ];
  for(const [a,b,label] of relations){
    const nodeA=list.find(x=>x.id===placeByKey.get(a));
    const nodeB=list.find(x=>x.id===placeByKey.get(b));
    if(nodeA&&nodeB){
      (nodeA.relations||=[]).push({to:nodeB.id,label});
    }
  }
  // Reordena filhos sem trocar IDs e prepara estatísticas e visibilidade dos vazios.
  const children=new Map();
  for(const n of list){if(n.parentId){const a=children.get(n.parentId)||[];a.push(n.id);children.set(n.parentId,a)}}
  const byId=new Map(list.map(n=>[n.id,n]));
  const weight={mundo:0,regiao:1,tipo:2,lugar:3,localidade:4,lacuna_localidades:5,categoria:6,registro:7};
  const collator=new Intl.Collator("pt-BR",{sensitivity:"base"});
  for(const arr of children.values())arr.sort((a,b)=>(weight[byId.get(a).kind]-weight[byId.get(b).kind])||collator.compare(byId.get(a).label,byId.get(b).label));
  function descendants(id){
    let count=0,leafCount=0;
    for(const child of children.get(id)||[]){count++;const n=byId.get(child);
      if(n.kind==="registro")leafCount++;
      else leafCount+=descendants(child).leafCount;
    }
    const n=byId.get(id);n.directChildren=(children.get(id)||[]).length;n.leafCount=leafCount;
    if(n.kind==="categoria"&&leafCount===0)n.empty=true;
    return {count,leafCount};
  }
  descendants("carcaca");
  const stats={
    areas:regionDefs.length,
    setoresGeograficos:regionDefs.length-1,
    regioesOficiais:regionDefs.filter(x=>x[3]).length,
    lugaresManuscrito:lore.filter(x=>x.tipo==="lugar").length,
    povosManuscrito:lore.filter(x=>x.tipo==="povo").length,
    personagensManuscrito:lore.filter(x=>x.tipo==="personagem").length,
    criaturasCatalogadas:(d.creatures||[]).length,
    ecologiaProposta:req(d.ecology,"criaturas").length,
    microespacosPropostos:req(d.seeds,"sementes").length,
    localidadesInternas:list.filter(x=>x.kind==="localidade").length,
    folhas:list.filter(x=>x.kind==="registro").length,
    categoriasVazias:list.filter(x=>x.kind==="categoria"&&x.empty).length
  };
  return {schema_version:"1.1",titulo:"Árvore da Carcaça",nodes:list,stats,
    aviso:"Setores de navegação não são novos territórios canônicos. Referências ao manuscrito, catálogo estruturado e propostas são estados diferentes.",
    links:{repositorio:"https://github.com/pedromaintenance/monstros-carcaca",
      leituraDoHack:"data/lore/hack-carcaca-dw-indice-tematico.json"}};
}
