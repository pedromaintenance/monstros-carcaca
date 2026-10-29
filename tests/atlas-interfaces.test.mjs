import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildContinentalInterfaces} from "../site/atlas/macro-interfaces.mjs";
const file=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const macroRaw=file("data/atlas/macrorregioes-carcaca.json");
const networkRaw=file("data/atlas/redes-historicas-ciclo33.json");
const envRaw=file("data/atlas/macroambientes-ciclo35.json");
const source=file("data/atlas/interfaces-continentais-ciclo36.json");
const macro={setores:macroRaw.setores,conexoes:macroRaw.conexoes};
const networks={redes:networkRaw.redes.map(n=>({...n,relacoes:n.relacao_ids.map(id=>macro.conexoes.find(e=>e.id===id))}))};
const env={ambientes:envRaw.ambientes,relacoes:envRaw.relacoes,lacunas:envRaw.lacunas};
const build=data=>buildContinentalInterfaces(data,macro,networks,env);
test("Ciclo XXXVI: 13 interfaces, oito dúvidas e fontes existentes",()=>{
 const result=build(source);
 assert.equal(result.totais.interfaces,13);
 assert.equal(result.totais.questoes,8);
 assert.equal(result.totais.referenciasMacro,7);
 assert.equal(result.totais.referenciasAmbientais,8);
 assert.equal(result.altera_canon,false);
 assert.equal(source.aprovacao_autoral,false);
 assert.equal(source.geometria,"nao_cartografada");
 assert.ok(result.interfaces.every(x=>x.paginas.length&&x.evidencia&&x.leitura_analitica&&x.limite_de_inferencia));
 assert.ok(result.questoes.every(q=>q.pendente===true));
});
test("Ciclo XXXVI: mudança histórica e resistência não viram estradas",()=>{
 const r=build(source).interfaces;
 const selected=id=>r.find(x=>x.id==="inter:xxxvi:"+id);
 for(const id of ["eldroth-costa","thargrid-eldroth","foz-cauda","foz-shadar","ironwood-eldroth"]){
  assert.equal(selected(id).rota_confirmada,false);
  assert.equal(selected(id).geometria,null);
 }
 assert.equal(selected("sangue-azul").estado,"movel");
 assert.equal(selected("foz-shadar").estado,"topologia_em_revisao");
 assert.equal(selected("ironwood-eldroth").estado,"em_aberto");
 assert.match(selected("abissais-mar").limite_de_inferencia,/não são automaticamente demônios/i);
 assert.doesNotMatch(JSON.stringify(source),/"latitude"\s*:|"longitude"\s*:|"lat"\s*:|"lng"\s*:/);
});
test("Ciclo XXXVI: validator rejeita geometria, rotas e falsas fontes",()=>{
 const corrupt=fn=>{const x=structuredClone(source);fn(x);return x};
 assert.throws(()=>build(corrupt(d=>d.interfaces[0].geometria=[[1,2]])),/mapa ou rota/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[1].rota_confirmada=true)),/mapa ou rota/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[0].ref_macro="macro-eixo:inexistente")),/Relação macro inexistente/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[7].ref_ambiental="ambr:inexistente")),/Relação ambiental inexistente/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[12].ref_ambiental="ambr:rio-abismo")),/Interface ambiental de outros setores/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[6].estado="documentado")),/Topologia foi resolvida/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[3].estado="documentado")),/Fronteira marítima foi fixada/);
 assert.throws(()=>build(corrupt(d=>d.interfaces[12].lacuna_id=null)),/Interface em aberto/);
 assert.throws(()=>build(corrupt(d=>d.questoes[0].pendente=false)),/Questão resolvida/);
});
test("Ciclo XXXVI: páginas, painel e publicação estática presentes",()=>{
 const html=readFileSync(new URL("../site/atlas/index.html",import.meta.url),"utf8");
 const ci=readFileSync(new URL("../.github/workflows/publicar-atlas-pages.yml",import.meta.url),"utf8");
 const ui=readFileSync(new URL("../site/atlas/macro-interfaces-ui.mjs",import.meta.url),"utf8");
 assert.match(html,/id="macroInterfaces"/);
 assert.match(html,/macro-interfaces-ui\.mjs/);
 assert.match(html,/buildContinentalInterfaces\(loaded\.interfaces,state\.macro,state\.networks,state\.environments\)/);
 assert.match(html,/initContinentalInterfaces\(\$\("macroInterfaces"\),state\.interfaces\)/);
 assert.match(ci,/data\/atlas\/interfaces-continentais-ciclo36\.json/);
 assert.match(ui,/data-interface-id/);
 assert.match(ui,/data-interface-filter/);
 assert.match(ui,/data-interface-mode/);
 assert.ok(source.interfaces.every(x=>x.paginas.every(p=>p>0&&p<=24)));
});
