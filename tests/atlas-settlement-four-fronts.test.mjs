import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildFourFrontierSettlementLot} from "../site/atlas/settlement-four-fronts.mjs";
import {initFourFrontierSettlements} from "../site/atlas/settlement-four-fronts-ui.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const j=p=>JSON.parse(read(p));
const source=j("data/propostas/povoamento-quatro-frentes-ciclo46.json");
const previous1=j("data/propostas/povoamento-criaturas-lote01.json");
const previous2=j("data/propostas/povoamento-regional-lote02-ciclo45.json");
const macro=j("data/atlas/macrorregioes-carcaca.json");
const env=j("data/atlas/macroambientes-ciclo35.json");
const horizon=j("data/atlas/horizonte-povoamento-macro.json");
const pageIndex=j("data/atlas/indice-paginas-fonte-ciclo45.json");
const build=(data=source,h=horizon,p=pageIndex)=>buildFourFrontierSettlementLot(data,previous1,previous2,macro,env,h,p);
const changed=fn=>{const d=structuredClone(source);fn(d);return d};
test("XLVI: 24 comunidades e 12 habitats em quatro frentes, sem aprovação",()=>{
 const m=build();
 assert.deepEqual(m.totais,{novos_assentamentos:24,novos_habitats:12,previos:32,propostos_acumulados:56,habitats_acumulados:22,novos_aprovados:0});
 assert.equal(m.frentes.length,4);
 for(const f of m.frentes){assert.equal(f.novas.length,6);assert.equal(f.habitats.length,3);assert.equal(f.aprovadas_neste_lote,0)}
 assert.deepEqual(m.frentes.map(f=>[f.id,f.propostas_previas,f.propostas_acumuladas]),[
   ["frente:macro:caatinga",2,8],
   ["frente:macro:garganta-entorno",1,7],
   ["frente:macro:thargrid-montanhas",1,7],
   ["frente:macro:ironwood",2,8]
 ]);
 assert.ok(m.assentamentos.every(x=>x.aprovacao_autoral===false&&x.comunidade_coletiva===true&&x.estado==="proposta_nao_canonica"));
 assert.ok(m.assentamentos.every(x=>x.localizacao===null&&x.rotas===null&&x.populacao===null&&x.fronteiras===null));
 assert.ok(m.habitats.every(x=>x.conta_como_assentamento===false&&x.geometria===null));
});
test("XLVI: diversidade de criaturas e regimes sociais, sem confundir regiões",()=>{
 const m=build(),names=m.assentamentos.map(x=>x.habitantes_propostos).join(" ");
 for(const group of ["Orcs","Goblins","Kobolds","Gigantes","Svirfneblin","Draconatos","Fadas","Elementais"])
   assert.match(names,new RegExp(group,"i"),group);
 assert.ok(m.frentes.some(x=>x.id==="frente:macro:ironwood"&&x.macro_id==="thargrid"));
 assert.ok(m.assentamentos.filter(x=>x.frente_id==="frente:macro:garganta-entorno").every(x=>x.setor==="garganta"));
 assert.ok(m.assentamentos.filter(x=>x.frente_id==="frente:macro:ironwood").every(x=>x.setor==="thargrid"));
 assert.ok(m.restricoes.some(x=>x.includes("Meio-demônios")));
 assert.ok(m.restricoes.some(x=>x.includes("Yokai")));
 assert.equal(m.habitats.filter(x=>x.categoria==="covil_individual").length,2);
});
test("XLVI: rejeitar alterações que inventem assentamentos aprovados ou biomas",()=>{
 const deny=(name,fn,re)=>assert.throws(()=>build(changed(fn)),re,name);
 deny("aprovação geral",d=>d.aprovacao_autoral=true,/Proteção autoral/);
 deny("aprovação local",d=>d.assentamentos[0].aprovacao_autoral=true,/canonizado/);
 deny("coordenada",d=>d.assentamentos[0].localizacao={lat:0},/geografia inventada/);
 deny("rota",d=>d.assentamentos[0].rotas=["Garganta"],/geografia inventada/);
 deny("população",d=>d.assentamentos[0].populacao=100,/geografia inventada/);
 deny("fronteira",d=>d.assentamentos[0].fronteiras=["costa"],/geografia inventada/);
 deny("efeito",d=>d.assentamentos[0].efeito_canonico=true,/geografia inventada/);
 deny("sem moradores",d=>d.assentamentos[0].habitantes_propostos="",/vida social/);
 deny("sem alimento",d=>d.assentamentos[0].sustento_hipotetico="",/vida social/);
 deny("sem conflito",d=>d.assentamentos[0].tensao_social="",/vida social/);
 deny("página",d=>d.assentamentos[0].paginas_contexto=[999],/Página/);
 deny("ambiente",d=>d.assentamentos[0].ambiente_id="amb:ironwood",/Ambiente/);
 deny("região",d=>d.assentamentos[0].setor="eldroth",/Povoado canonizado/);
 deny("duplicar ID",d=>d.assentamentos[1].id=d.assentamentos[0].id,/Identidade duplicada/);
 deny("duplicar nome",d=>d.assentamentos[1].nome=d.assentamentos[0].nome,/Identidade duplicada/);
 deny("perder comunidade",d=>d.assentamentos.pop(),/24 comunidades/);
 deny("retirar habitat",d=>d.habitats.pop(),/24 comunidades/);
 deny("habitat vira povoado",d=>d.habitats[0].conta_como_assentamento=true,/Habitat contado/);
 deny("habitat sapiente confirmado",d=>d.habitats[0].sapiencia_confirmada=true,/Habitat contado/);
 deny("densidade ecológica",d=>d.habitats[0].quantidade=99,/Habitat contado/);
 deny("sem revisão",d=>d.meta.aprovacoes_novas=5,/Resumo editorial/);
 deny("incha contagem",d=>d.meta.propostas_acumuladas=100,/Resumo editorial/);
 deny("falta restrição",d=>{d.restricoes=[]},/Restrições/);
});
test("XLVI: página de índice pública não reproduz manuscrito autoral",()=>{
 assert.equal(pageIndex.texto_autoral_incluido,false);
 assert.ok(pageIndex.paginas.every(x=>Object.keys(x).length===1&&Number.isInteger(x.pagina)));
 const invalid=structuredClone(pageIndex);invalid.texto_autoral_incluido=true;
 assert.throws(()=>buildFourFrontierSettlementLot(source,previous1,previous2,macro,env,horizon,invalid),/expõem o manuscrito/);
});
test("XLVI: UI filtra por frente e distingue habitats de comunidades",()=>{
 const el={innerHTML:"",events:{},addEventListener(event,cb){this.events[event]=cb}};
 initFourFrontierSettlements(el,build());
 assert.equal((el.innerHTML.match(/class="four-place-card(?: active)?"/g)||[]).length,24);
 assert.match(el.innerHTML,/<b>0<\/b><span>novos lugares aprovados<\/span>/);
 const change=value=>el.events.change({target:{closest(k){return k==="[data-four-filter]"?{value}:null}}});
 const click=mode=>el.events.click({target:{closest(k){return k==="[data-four-view]"?{dataset:{fourView:mode}}:null}}});
 change("frente:macro:ironwood");
 assert.equal((el.innerHTML.match(/class="four-place-card(?: active)?"/g)||[]).length,6);
 click("habitats");
 assert.equal((el.innerHTML.match(/class="four-place-card(?: active)?"/g)||[]).length,3);
 assert.match(el.innerHTML,/Habitat ecológico/);
 click("critica");
 assert.match(el.innerHTML,/Cuidados metodológicos/);
});
test("XLVI: HTML, Styles e workflows de publicação e validação estão completos",()=>{
 const html=read("site/atlas/index.html"),pages=read(".github/workflows/publicar-atlas-pages.yml"),
   ci=read(".github/workflows/validar-curadoria.yml");
 assert.match(html,/id="fourFrontSettlements"/);
 assert.match(html,/import \{buildFourFrontierSettlementLot\} from "\.\/settlement-four-fronts\.mjs"/);
 assert.match(html,/buildFourFrontierSettlementLot\(loaded\.fourFronts,loaded\.creatureSettlements,loaded\.settlementExpansion,state\.macro,state\.environments,loaded\.settlementHorizon,loaded\.authoredPages\)/);
 assert.match(html,/initFourFrontierSettlements\(\$\("fourFrontSettlements"\),state\.fourFronts\)/);
 assert.match(html,/@media\(max-width:760px\)\{\.four-place-grid/);
 assert.match(pages,/data\/propostas\/povoamento-quatro-frentes-ciclo46\.json/);
 assert.match(pages,/tests\/atlas-settlement-four-fronts\.test\.mjs/);
 assert.match(ci,/tests\/atlas-settlement-four-fronts\.test\.mjs/);
 assert.doesNotMatch(pages,/^\s+fontes\/autoria\/hack-carcaca-dw-capitulo-i\.paginas\.json\s*$/m);
 const dir=mkdtempSync(join(tmpdir(),"atlas-xlvi-"));
 try{const code=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
   assert.ok(code);const file=join(dir,"atlas.mjs");writeFileSync(file,code,"utf8");
   execFileSync(process.execPath,["--check",file],{stdio:"pipe"});
 }finally{rmSync(dir,{recursive:true,force:true})}
});
