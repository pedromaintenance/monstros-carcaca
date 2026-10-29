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
  statblocks:read("data/propostas/eldroth-fichas-dw-ciclo13.json")
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
  assert.equal(t.nodes.filter(n=>n.kind==="lugar"&&n.sourceId?.startsWith("lore-hack:")&&n.pages?.length>0).length,20);
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
  const seeds=t.nodes.filter(n=>n.kind==="lugar"&&n.sourceId?.startsWith("povoamento-proposto:"));
  assert.equal(seeds.length,16);
  assert.ok(seeds.every(n=>n.status==="proposta"&&n.approval===false));
  assert.ok(seeds.every(n=>anc(n).some(x=>x.kind==="tipo"&&x.type==="nucleo")));
});
test("atlas: o item da foz permanece uma menção sem estatísticas inventadas",()=>{
  const item=t.nodes.find(n=>n.sourceId==="item:lanca-da-perdicao:referencia");
  assert.ok(item);
  assert.ok(anc(item).some(n=>n.contentType==="itens"));
  assert.equal(item.itemCompleto,false);
  assert.equal(item.status,"manuscrito");
});
