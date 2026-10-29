import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildAtlasTree} from "../site/atlas/atlas-tree.mjs";
import {buildMacroIndex} from "../site/atlas/macro-atlas.mjs";
const file=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const source={
  lore:file("data/lore/hack-carcaca-dw-indice-tematico.json"),
  regions:file("data/regioes_carcaca.json"),
  places:file("data/lugares_carcaca.json"),
  peoples:file("data/povos_carcaca.json"),
  factions:file("data/faccoes_carcaca.json"),
  settlements:file("dist/carcaca/settlements.json"),
  creatures:file("dist/carcaca/creatures.json"),
  seeds:file("data/propostas/povoamento-regional-hack-carcaca.json"),
  ecology:file("data/propostas/eldroth-ecologia-monstruosa-dw.json"),
  statblocks:file("data/propostas/eldroth-fichas-dw-ciclo13.json"),
  ironwoodLocales:file("data/propostas/ironwood-eldroth-resistencia-hack.json"),
  thargridSocial:file("data/propostas/thargrid-resistencia-cotidiano-hack.json"),
  gargantaSocial:file("data/propostas/garganta-rio-ancestral-social-hack.json"),
  caatingaSocial:file("data/propostas/caatinga-rede-social-hack.json"),
  hierarchy:file("data/atlas/aninhamento-territorial.json")
};
const atlas=buildAtlasTree(source);
const macroFile=file("data/atlas/macrorregioes-carcaca.json");
const macro=buildMacroIndex(macroFile,atlas);
test("Atlas macro: onze setores geográficos e pasta transversal não incluída",()=>{
  assert.equal(macro.totais.setores,11);
  assert.equal(macro.setores.length,11);
  assert.equal(macro.totais.ancoras,26);
  assert.equal(macro.totais.conexoes,7);
  assert.ok(!macro.setores.some(r=>r.id==="transversal"));
  assert.deepEqual(new Set(macro.setores.map(r=>r.id)).size,11);
});
test("Atlas macro: cada âncora existe, pertence ao setor e não foi inventada",()=>{
  for(const s of macro.setores){
    assert.ok(s.paginas.length>0);
    assert.ok(s.macro_pendencias.length>=2);
    assert.ok(s.cobertura.lacunasDeSubdivisao>=1);
    for(const a of s.ancoras){
      const n=atlas.nodes.find(n=>n.id===a.lugar_id);
      assert.ok(n,a.lugar_id);
      assert.equal(n.regionKey,s.id);
      assert.notEqual(n.status,"proposta");
      assert.equal(a.label,n.label);
    }
  }
});
test("Atlas macro: não converte indecisão em ligação cartográfica",()=>{
  const rel=macro.conexoes.find(e=>e.tipo==="topologia_em_revisao");
  assert.equal(rel.estado,"indeterminado");
  assert.equal(rel.de,"foz");
  assert.equal(rel.para,"shadar");
  assert.match(rel.descricao,/não reconciliar/i);
  const shadar=macro.setores.find(r=>r.id==="shadar");
  assert.match(shadar.macro_pendencias.join(" "),/Gualápolis/);
  const grama=macro.setores.find(r=>r.id==="grama");
  assert.match(grama.macro_pendencias.join(" "),/posição/i);
});
test("Atlas macro: assuntos demoníacos e marinhos não se confundem",()=>{
  const mar=macro.setores.find(r=>r.id==="costa");
  assert.ok(mar.povos.includes("Abissais marinhos"));
  const foz=macro.setores.find(r=>r.id==="foz");
  assert.ok(foz.macro_pendencias.some(p=>/não confundir.*demoníacas.*abissais marinhos/i.test(p)));
});
test("Atlas macro: mantém salvaguardas autorais e nunca inclui coordenadas",()=>{
  assert.equal(macro.altera_canon,false);
  assert.equal(macroFile.aprovacao_autoral,false);
  const keys=JSON.stringify(macroFile);
  assert.doesNotMatch(keys,/"lat"\s*:|"lng"\s*:|"longitude"\s*:|"latitude"\s*:/);
  const tamper=structuredClone(macroFile);
  tamper.setores[0].ancoras[0].lugar_id="lugar-visual:inexistente";
  assert.throws(()=>buildMacroIndex(tamper,atlas),/Âncora ausente/);
  const fake=structuredClone(macroFile);
  fake.setores[0].ancoras[0].estado="aprovado";
  assert.throws(()=>buildMacroIndex(fake,atlas),/Âncora promovida/);
});
test("Atlas macro: módulo da visão geral e HTML têm sintaxe válida",()=>{
  const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
  assert.match(html,/id="macroView"/);
  assert.match(html,/id="treeWorkspace"/);
  assert.match(html,/macro-atlas\.mjs/);
  assert.match(html,/data\/atlas\/macrorregioes-carcaca\.json/);
  assert.match(html,/buildMacroIndex\(loaded\.macro,state\.atlas\)/);
  const tag=html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(tag);
  const dir=mkdtempSync(join(tmpdir(),"macro-carcaca-"));
  try{
    const script=join(dir,"view.mjs");
    writeFileSync(script,tag[1],"utf8");
    execFileSync(process.execPath,["--check",script],{stdio:"pipe"});
  }finally{rmSync(dir,{recursive:true,force:true})}
});
test("Atlas macro: os dados do mundo não sofrem mutação ao gerar a camada macro",()=>{
  const before=JSON.stringify(atlas.nodes);
  const m2=buildMacroIndex(macroFile,atlas);
  assert.equal(JSON.stringify(atlas.nodes),before);
  assert.deepEqual(m2.totais,macro.totais);
});
