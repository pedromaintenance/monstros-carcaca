import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildAtlasTree,CONTENT_TYPES} from "../site/atlas/atlas-tree.mjs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf-8"));
const d={
  lore:read("data/lore/hack-carcaca-dw-indice-tematico.json"),
  regions:read("data/regioes_carcaca.json"),
  places:read("data/lugares_carcaca.json"),
  peoples:read("data/povos_carcaca.json"),
  factions:read("data/faccoes_carcaca.json"),
  settlements:read("dist/carcaca/settlements.json"),
  creatures:read("dist/carcaca/creatures.json"),
  seeds:read("data/propostas/povoamento-regional-hack-carcaca.json"),
  ecology:read("data/propostas/eldroth-ecologia-monstruosa-dw.json"),
  statblocks:read("data/propostas/eldroth-fichas-dw-ciclo13.json"),
  ironwoodLocales:read("data/propostas/ironwood-eldroth-resistencia-hack.json"),
  thargridSocial:read("data/propostas/thargrid-resistencia-cotidiano-hack.json"),
  gargantaSocial:read("data/propostas/garganta-rio-ancestral-social-hack.json"),
  caatingaSocial:read("data/propostas/caatinga-rede-social-hack.json"),
  hierarchy:read("data/atlas/aninhamento-territorial.json")
};
const t=buildAtlasTree(d);
const lookup=new Map(t.nodes.map(n=>[n.id,n]));
const anc=n=>{
  const out=[];let v=n;
  while(v){out.push(v);v=lookup.get(v.parentId)}
  return out;
};
const members=(key)=>t.nodes.filter(n=>anc(n).some(x=>x.id==="lugar-visual:"+key));
test("atlas: contém todas as menções de lugares e os quatro IDs regionais oficiais",()=>{
  assert.equal(t.stats.lugaresManuscrito,20);
  assert.equal(t.stats.regioesOficiais,4);
  assert.equal(t.stats.setoresGeograficos,11);
  assert.equal(t.stats.povosManuscrito,26);
  assert.equal(t.stats.personagensManuscrito,16);
  assert.equal(t.stats.criaturasCatalogadas,7);
  assert.equal(t.stats.ecologiaProposta,8);
  assert.equal(t.stats.microespacosPropostos,16);
  assert.equal(t.nodes.filter(n=>n.kind==="regiao").length,12);
  assert.equal(t.nodes.filter(n=>["lugar","localidade"].includes(n.kind)&&n.sourceId?.startsWith("lore-hack:")&&n.pages?.length>0).length,20);
  assert.equal(lookup.get("lugar-visual:shadar-riverie").regionKey,"shadar");
  assert.equal(lookup.get("lugar-visual:templo-do-crepusculo").regionKey,"cauda");
});
test("atlas: todos os vínculos pai-filho existem, sem ciclo ou IDs duplicados",()=>{
  assert.equal(t.nodes.length,lookup.size);
  for(const n of t.nodes){
    if(n.parentId)assert.ok(lookup.has(n.parentId),n.id);
    const a=anc(n);
    assert.ok(a.length<10,n.id);
    assert.equal(a.at(-1).id,"carcaca");
  }
});
test("atlas: categorias de um lugar permanecem vazias quando falta conhecimento",()=>{
  const expected=CONTENT_TYPES.map(x=>x[0]);
  const place=lookup.get("lugar-visual:caatinga-bioma");
  assert.ok(place);
  for(const ct of expected){
    const cat=lookup.get(place.id+"::"+ct);
    assert.ok(cat,ct);
    assert.equal(cat.kind,"categoria");
  }
  assert.ok(t.stats.categoriasVazias>10);
});
test("atlas: nenhuma criatura do Arquivo foi espalhada a outras regiões",()=>{
  const monsterEntries=t.nodes.filter(n=>n.kind==="registro"&&n.sourceId?.startsWith("carcaca:criatura:"));
  assert.equal(monsterEntries.length,7);
  assert.ok(monsterEntries.every(n=>anc(n).some(p=>p.id==="lugar-visual:arquivo-mortos-afogados")));
  assert.ok(monsterEntries.every(n=>n.status==="catalogado"));
});
test("atlas: Eldroth oferece oito propostas, não novos monstros catalogados",()=>{
  const proposals=t.nodes.filter(n=>n.kind==="registro"&&n.sourceId?.startsWith("ecologia-xii:criatura:"));
  assert.equal(proposals.length,8);
  assert.ok(proposals.every(n=>n.status==="proposta"));
  assert.ok(proposals.every(n=>anc(n).some(p=>p.id==="lugar-visual:floresta-eldroth")));
  assert.ok(proposals.some(n=>anc(n).some(p=>p.contentType==="flora")));
  assert.ok(proposals.some(n=>anc(n).some(p=>p.contentType==="fauna")));
});
test("atlas: povos marinhos não são demonizados pelo tipo de criatura",()=>{
  const a=t.nodes.filter(n=>n.sourceId==="lore-hack:abissais-marinhos");
  assert.equal(a.length,1);
  assert.ok(anc(a[0]).some(n=>n.contentType==="povos"));
  assert.ok(!anc(a[0]).some(n=>n.contentType==="criaturas"));
  const kuo=t.nodes.filter(n=>n.sourceId==="lore-hack:kuo-toa");
  assert.equal(kuo.length,1);
  assert.ok(anc(kuo[0]).some(n=>n.contentType==="povos"));
});
test("atlas: núcleos são todos propostas, sem governos ou sítios fixos novos",()=>{
  const seeds=t.nodes.filter(n=>["lugar","localidade"].includes(n.kind)&&n.sourceId?.startsWith("povoamento-proposto:"));
  assert.equal(seeds.length,16);
  assert.ok(seeds.every(n=>n.status==="proposta"&&n.approval===false));
  assert.ok(seeds.every(n=>n.placeType==="nucleo"));
  assert.ok(seeds.some(n=>anc(n).some(x=>x.id==="lugar-visual:reino-sob-montanha")));
});
test("atlas: o item da foz permanece uma menção sem estatísticas inventadas",()=>{
  const item=t.nodes.find(n=>n.sourceId==="item:lanca-da-perdicao:referencia");
  assert.ok(item);
  assert.ok(anc(item).some(n=>n.contentType==="itens"));
  assert.equal(item.itemCompleto,false);
  assert.equal(item.status,"manuscrito");
});

test("atlas: Ironwood agora contém o quinto nível de assentamento documentado",()=>{
  const fort=lookup.get("lugar-visual:fortaleza-ranger-ironwood");
  assert.ok(fort);
  assert.equal(fort.kind,"localidade");
  assert.equal(fort.placeType,"assentamento");
  assert.equal(fort.parentId,"lugar-visual:ironwood");
  assert.equal(fort.status,"manuscrito");
  assert.equal(fort.derivadoDe,"lore-hack:ironwood");
  const elara=t.nodes.find(n=>n.sourceId==="lore-hack:elara-stormoak");
  assert.ok(elara);
  assert.ok(anc(elara).some(n=>n.id===fort.id));
  const rangers=t.nodes.find(n=>n.sourceId==="lore-hack:rangers-ironwood");
  assert.ok(anc(rangers).some(n=>n.id===fort.id));
  const micro=t.nodes.filter(n=>n.kind==="localidade"
    &&n.sourceId?.startsWith("ironwood-eldroth:lugar:")
    &&anc(n).some(p=>p.id==="lugar-visual:ironwood"));
  assert.equal(micro.length,2);
  assert.ok(micro.every(n=>n.kind==="localidade"&&n.status==="proposta"&&n.approval===false));
  assert.ok(t.nodes.some(n=>n.kind==="lacuna_localidades"&&n.parentId==="lugar-visual:ironwood"));
});
test("atlas: locais documentados podem estar dentro de lugares maiores",()=>{
  const cases=[
    ["reino-sob-montanha","montanhas-thargrid"],
    ["templo-demeter","portomonte"],
    ["templo-yolskaariin","garganta"],
    ["arquivo-mortos-afogados","gualapolis"],
    ["templo-da-lua","rio-ancestral"],
    ["boca-do-abismo","gualapolis"]
  ];
  for(const [child,parent] of cases){
    const n=lookup.get("lugar-visual:"+child);
    assert.equal(n?.parentId,"lugar-visual:"+parent);
    assert.equal(n.status,"manuscrito");
  }
});
test("atlas: hierarquia recursiva aceita microespaços mais profundos sem falsificar localização",()=>{
  assert.equal(lookup.get("lugar-visual:semente-turno-das-escavadoras").parentId,
    "lugar-visual:templo-yolskaariin");
  assert.equal(lookup.get("lugar-visual:semente-conselho-dos-juramentos").parentId,
    "lugar-visual:reino-sob-montanha");
  const school=lookup.get("lugar-visual:semente-escola-do-caminho-verde");
  assert.ok(school);
  assert.ok(!anc(school).some(n=>n.id==="lugar-visual:ironwood"),
    "A escola é PRÓXIMA a Ironwood, não um assentamento comprovadamente interno");
  assert.ok(t.stats.localidadesInternas>=8);
  const noVillages=t.nodes.filter(n=>n.parentId==="lugar-visual:ironwood"
    &&n.kind==="localidade"&&/vila|cidade/i.test(n.label));
  assert.equal(noVillages.length,0,"Não inventar cidades ou vilas de Ironwood");
});

test("atlas: todo lugar geográfico inclui reserva de localização própria",()=>{
  const places=t.nodes.filter(n=>["lugar","localidade"].includes(n.kind)&&n.placeType!=="ambito");
  assert.ok(places.length>40, "Os núcleos sociais devem compor localidades em todas as regiões");
  const marks=t.nodes.filter(n=>n.kind==="lacuna_localidades");
  assert.equal(marks.length,places.length);
  const byParent=new Map(marks.map(n=>[n.parentId,n]));
  assert.equal(byParent.size,marks.length);
  for(const place of places){
    const mark=byParent.get(place.id);
    assert.ok(mark,"Sem lacuna de subdivisões para "+place.label);
    assert.equal(mark.aprovacao_autoral,false);
    assert.equal(mark.empty,true);
    assert.notEqual(mark.label,"Outras vilas e cidades — ainda não individualizadas",
       "A lacuna deve respeitar o tipo do lugar");
    for(const type of CONTENT_TYPES){
      assert.ok(lookup.has(place.id+"::"+type[0]),"Categoria "+type[0]+" ausente em "+place.id);
    }
  }
});
test("atlas: nenhuma proximidade pode virar contenção espacial",()=>{
  const unplaced=d.hierarchy.ancoras_sementes.filter(a=>a.pai===null);
  assert.ok(unplaced.length>=4);
  for(const anchor of unplaced){
    const slug=anchor.id.slice("povoamento-proposto:".length);
    const n=lookup.get("lugar-visual:semente-"+slug);
    assert.equal(n.kind,"lugar","Vizinhança não significa assentamento interno: "+n.label);
    assert.equal(n.status,"proposta");
  }
  const site=t.nodes.find(n=>n.sourceId==="ironwood-eldroth:lugar:sala-dos-nomes-frios"&&
    n.kind==="lugar");
  assert.ok(site);
  assert.notEqual(site.parentId,"lugar-visual:vandar");
});
test("atlas: propostas de Thargrid, Garganta, Eldroth e Caatinga ficam aninhadas ou regionais",()=>{
  const proposedLocations=t.nodes.filter(n=>["lugar","localidade"].includes(n.kind)&&n.status==="proposta");
  assert.ok(proposedLocations.length>=32);
  assert.equal(t.nodes.filter(n=>n.kind==="localidade"&&
    n.sourceId?.startsWith("thargrid-social:lugar:")).length,6);
  assert.equal(t.nodes.filter(n=>n.kind==="localidade"&&
    n.sourceId?.startsWith("rio-garganta:lugar:")).length,4);
  assert.equal(t.nodes.filter(n=>n.kind==="lugar"&&
    n.sourceId?.startsWith("rio-garganta:lugar:")).length,2);
  assert.equal(t.nodes.filter(n=>n.kind==="localidade"&&
    n.sourceId?.startsWith("caatinga:comunidade:")).length,3);
  assert.equal(t.nodes.filter(n=>["lugar","localidade"].includes(n.kind)&&
    n.sourceId?.startsWith("caatinga:comunidade:")).length,3,
    "As duas comunidades já cobertas por sementes não devem se duplicar");
  const caatingaSeed=lookup.get("lugar-visual:semente-poco-sem-bandeira");
  assert.equal(caatingaSeed.parentId,"lugar-visual:caatinga-bioma");
  assert.ok(t.nodes.some(n=>n.sourceId==="caatinga:comunidade:poco-sem-bandeira:cotidiano"
    &&n.parentId===caatingaSeed.id+"::culturas"));
});
test("atlas: relação documentada é citada, proposta não aplica o cânone",()=>{
  const r=lookup.get("lugar-visual:templo-demeter");
  assert.equal(r.containmentEvidence.pagina,5);
  assert.equal(r.containmentEvidence.estatuto,"referencia_de_manuscrito");
  const s=lookup.get("lugar-visual:semente-patio-do-soldo");
  assert.equal(s.parentId,"lugar-visual:drakport");
  assert.equal(s.containmentEvidence.estatuto,"proposta_nao_canonica");
  assert.equal(s.approval,false);
  assert.equal(d.hierarchy.altera_canon,false);
  assert.equal(d.hierarchy.revisao_autoral_aplicada,false);
});
