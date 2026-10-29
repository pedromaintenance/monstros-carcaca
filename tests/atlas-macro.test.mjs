import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildAtlasTree} from "../site/atlas/atlas-tree.mjs";
import {buildMacroIndex} from "../site/atlas/macro-atlas.mjs";
import {buildMacroNetworks} from "../site/atlas/macro-networks.mjs";
import {buildPhysicalGeography} from "../site/atlas/physical-geography.mjs";
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

const networksFile=file("data/atlas/redes-historicas-ciclo33.json");
const networks=buildMacroNetworks(networksFile,macro);
test("Atlas XXXIII: camadas globais são sete redes, 14 esferas, 17 marcos e 8 lacunas",()=>{
  assert.deepEqual(networks.totais,{redes:7,esferas:14,marcos:17,lacunas:8});
  assert.equal(networks.altera_canon,false);
  assert.equal(networksFile.aprovacao_autoral,false);
  assert.equal(networksFile.alteracao_regras_dw,false);
  assert.ok(networks.redes.every(n=>n.conexao_espacial_automatica===false));
  assert.ok(networks.esferas.every(n=>n.fronteira_definida===false));
  assert.ok(networks.lacunas_estruturais.every(n=>n.resolvida===false));
});
test("Atlas XXXIII: cada relação de rede vem de link existente no macroatlas",()=>{
  const base=new Map(macro.conexoes.map(n=>[n.id,n]));
  for(const net of networks.redes){
    assert.ok(net.paginas.length>0);
    for(const link of net.relacoes){
      assert.deepEqual(base.get(link.id),link);
      assert.ok(net.setores.includes(link.de));
      assert.ok(net.setores.includes(link.para));
    }
  }
  assert.ok(networks.redes.some(n=>n.relacoes.some(e=>e.estado==="indeterminado")));
});
test("Atlas XXXIII: fatos históricos preservam tempo e incertezas",()=>{
  assert.equal(networks.cronologia[0].ano_ec,0);
  assert.equal(networks.cronologia.at(-1).ano_ec,999);
  assert.deepEqual(networks.cronologia.filter(e=>e.ano_ec===983).map(e=>e.titulo),
    ["Invasão demoníaca destrói Templo das Sombras"]);
  assert.ok(networks.cronologia.some(e=>e.ano_ec===984&&
    e.setores.length===1&&e.setores[0]==="foz"));
  assert.ok(!networks.cronologia.some(e=>/revolta de drakport/i.test(e.titulo)));
  assert.ok(networks.lacunas_estruturais.some(e=>/drakport-futuro/.test(e.id)));
  const voragar=networks.cronologia.find(e=>e.ano_ec===886);
  assert.deepEqual(voragar.setores,[],"A fortaleza central não tem localização setorial documentada");
});
test("Atlas XXXIII: marinheiros abissais e demônios ocidentais permanecem distintos",()=>{
  const sea=networks.redes.find(n=>n.id==="rede-xxxiii:mar");
  assert.ok(sea.setores.includes("azuis")&&sea.setores.includes("costa"));
  assert.match(sea.limite,/Abissais marinhos/);
  const abyss=networks.redes.find(n=>n.id==="rede-xxxiii:abismo");
  assert.ok(abyss.setores.includes("foz")&&abyss.setores.includes("cauda"));
});
test("Atlas XXXIII: validador recusa novas fronteiras, locais inexistentes ou revoltas homologadas",()=>{
  const a=structuredClone(networksFile);
  a.redes[0].relacao_ids.push("relacao:inexistente");
  assert.throws(()=>buildMacroNetworks(a,macro),/Relação macro inexistente/);
  const b=structuredClone(networksFile);
  b.esferas[0].fronteira_definida=true;
  assert.throws(()=>buildMacroNetworks(b,macro),/Esfera promove fronteira/);
  const c=structuredClone(networksFile);
  c.cronologia[0].setores=["setor:inventado"];
  assert.throws(()=>buildMacroNetworks(c,macro),/Setor inexistente/);
  const d=structuredClone(networksFile);
  d.lacunas_estruturais[0].resolvida=true;
  assert.throws(()=>buildMacroNetworks(d,macro),/Lacuna declarada resolvida/);
});
test("Atlas XXXIII: UI e artefato Pages carregam camadas e cronologia com JS válido",()=>{
  const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
  assert.match(html,/id="macroLayers"/);
  assert.match(html,/macro-layers-ui\.mjs/);
  assert.match(html,/buildMacroNetworks\(loaded\.networks,state\.macro\)/);
  assert.match(html,/initMacroLayers\(\$\("macroLayers"\),state\.macro,state\.networks\)/);
  const panels=readFileSync(new URL("../site/atlas/macro-layers-ui.mjs",import.meta.url),"utf8");
  assert.match(panels,/atlasTime/);
  assert.match(panels,/data-layer/);
  const workflow=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
  assert.match(workflow,/data\/atlas\/redes-historicas-ciclo33\.json/);
  assert.doesNotMatch(JSON.stringify(networksFile),/"latitude"\s*:|"longitude"\s*:/);
});

const physicalFile=file("data/atlas/geografia-fisica-ciclo34.json");
const physical=buildPhysicalGeography(physicalFile,macro,atlas);
test("Atlas XXXIV: geografia de Golzdov possui marcos, relações e perguntas rastreadas",()=>{
  assert.deepEqual(physical.totais,{marcos:20,relacoes:12,questoes:9,semDirecao:6,semSetor:2});
  assert.equal(physical.altera_canon,false);
  assert.equal(physicalFile.aprovacao_autoral,false);
  assert.ok(physical.pontos.every(p=>p.paginas.length>0));
  assert.ok(physical.relacoes.every(r=>r.paginas.length>0));
  assert.ok(physical.questoes.every(q=>q.resolvida===false));
});
test("Atlas XXXIV: direções documentadas não se tornam geometrias inventadas",()=>{
  const find=id=>physical.pontos.find(x=>x.id==="geo-xxxiv:"+id);
  assert.equal(find("cranio").orientacao,"leste");
  assert.equal(find("foz").orientacao,"oeste");
  assert.equal(find("montanhas-thargrid").orientacao,"norte");
  assert.equal(find("ironwood").orientacao,"sul-relativo");
  assert.equal(find("asa-direita").orientacao,"nao_fixado");
  assert.equal(find("cauda").orientacao,"alem_abismo");
  assert.equal(find("grama").orientacao,"nao_fixado");
  assert.ok(!find("coluna-dorsal").lugar_id);
  assert.equal(find("coluna-dorsal").setores.length,0);
  assert.doesNotMatch(JSON.stringify(physicalFile),/"latitude"\s*:|"longitude"\s*:|"coordinates"\s*:/);
});
test("Atlas XXXIV: Gualápolis e Boca são referências distintas; topologia Shadar aberta",()=>{
  const g=physical.pontos.find(x=>x.id==="geo-xxxiv:gualapolis");
  const b=physical.pontos.find(x=>x.id==="geo-xxxiv:boca-do-abismo");
  assert.ok(g&&b);
  assert.notEqual(g.lugar_id,b.lugar_id);
  assert.equal(g.orientacao,"sul-relativo");
  assert.equal(b.orientacao,"sul-relativo");
  const conflict=physical.relacoes.find(x=>x.tipo==="topologia_contestada");
  assert.equal(conflict.estado,"revisao_autoral");
  assert.equal(conflict.de,"geo-xxxiv:shadar");
  assert.equal(conflict.para,"geo-xxxiv:gualapolis");
  assert.ok(physical.questoes.some(x=>x.id==="questao-xxxiv:shadar-guala"&&!x.resolvida));
});
test("Atlas XXXIV: o validador recusa invenções geográficas",()=>{
  const bad=structuredClone(physicalFile);
  bad.pontos[0].lugar_id="lugar-visual:inexistente";
  assert.throws(()=>buildPhysicalGeography(bad,macro,atlas),/Lugar ausente/);
  const bad2=structuredClone(physicalFile);
  bad2.relacoes[0].para="geo-xxxiv:inexistente";
  assert.throws(()=>buildPhysicalGeography(bad2,macro,atlas),/marco inexistente/);
  const bad3=structuredClone(physicalFile);
  bad3.questoes[0].resolvida=true;
  assert.throws(()=>buildPhysicalGeography(bad3,macro,atlas),/Pergunta resolvida/);
  const bad4=structuredClone(physicalFile);
  bad4.pontos[0].orientacao="leste_inferido_por_asa";
  assert.throws(()=>buildPhysicalGeography(bad4,macro,atlas),/Classificação física desconhecida/);
});
test("Atlas XXXIV: interface física do Pages é carregada e tem sintaxe de módulo válida",()=>{
  const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
  assert.match(html,/id="physicalGeo"/);
  assert.match(html,/physical-geography-ui\.mjs/);
  assert.match(html,/buildPhysicalGeography\(loaded\.physical,state\.macro,state\.atlas\)/);
  assert.match(html,/initPhysicalGeography\(\$\("physicalGeo"\),state\.physical,macroDiveInto\)/);
  const frontend=readFileSync(new URL("../site/atlas/physical-geography-ui.mjs",import.meta.url),"utf8");
  assert.match(frontend,/data-phys-tab/);
  assert.match(frontend,/Questões abertas/);
  const workflow=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
  assert.match(workflow,/data\/atlas\/geografia-fisica-ciclo34\.json/);
  const dir=mkdtempSync(join(tmpdir(),"phys-carcaca-"));
  try{
    const path=join(dir,"interface.mjs");writeFileSync(path,frontend,"utf8");
    execFileSync(process.execPath,["--check",path],{stdio:"pipe"});
  }finally{rmSync(dir,{recursive:true,force:true})}
});
