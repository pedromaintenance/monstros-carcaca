import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {buildContinentalCoastSettlementLot} from "../site/atlas/settlement-coast-mainland.mjs";
import {buildSettlementDensityAudit} from "../site/atlas/settlement-density.mjs";
import {initContinentalCoastSettlementLot} from "../site/atlas/settlement-coast-mainland-ui.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const j=p=>JSON.parse(read(p));
const lot=j("data/propostas/povoamento-costa-continental-ciclo49.json");
const horizon=j("data/atlas/horizonte-povoamento-macro.json");
const inventory=j("data/atlas/inventario-povoamento-ciclo44.json");
const auditConfig=j("data/atlas/auditoria-povoamento-transversal-ciclo48.json");
const l1=j("data/propostas/povoamento-criaturas-lote01.json");
const l2=j("data/propostas/povoamento-regional-lote02-ciclo45.json");
const l3=j("data/propostas/povoamento-quatro-frentes-ciclo46.json");
const l4=j("data/propostas/povoamento-insular-submerso-cauda-ciclo47.json");
const env=j("data/atlas/macroambientes-ciclo35.json");
const pageIndex=j("data/atlas/indice-paginas-fonte-ciclo45.json");
const previous=buildSettlementDensityAudit(auditConfig,horizon,inventory,l1,l2,l3,l4);
const build=(src=lot,audit=previous,e=env,p=pageIndex,h=horizon)=>
 buildContinentalCoastSettlementLot(src,audit,e,p,h);
test("XLIX: a costa continental acrescenta 14 comunidades e 8 habitats sem aprovar nada",()=>{
 const x=build();
 assert.equal(x.comunidades.length,14);
 assert.equal(x.habitats.length,8);
 assert.equal(x.relacoes.length,8);
 assert.equal(x.balanco.propostas_comunidades_antes,82);
 assert.equal(x.balanco.propostas_comunidades_apos,96);
 assert.equal(x.balanco.habitats_antes,34);
 assert.equal(x.balanco.habitats_apos,42);
 assert.equal(x.balanco.propostas_costa_antes,8);
 assert.equal(x.balanco.propostas_costa_apos,22);
 assert.equal(x.balanco.aprovacoes_novas,0);
 assert.equal(x.confirma_canon,false);
 assert.equal(x.confirma_agua_potavel,false);
 assert.equal(x.confirma_estradas,false);
 assert.ok(x.comunidades.every(c=>c.subzona==="continental_proposta_sem_localizacao"&&
    c.aprovacao_autoral===false&&c.geometria===null&&c.populacao===null&&
    c.viabilidade_hidrica_confirmada===false&&c.viabilidade_alimentar_confirmada===false));
 assert.ok(x.habitats.every(h=>h.conta_como_assentamento===false));
});
test("XLIX: diversidade de governos supera modelos colegiados uniformes",()=>{
 const x=build();
 const forms=new Set(x.comunidades.map(c=>c.forma));
 assert.equal(forms.size,14);
 assert.ok(x.comunidades.some(c=>/abadessa/.test(c.regime_de_autoridade_proposto)));
 assert.ok(x.comunidades.some(c=>/hereditário/.test(c.regime_de_autoridade_proposto)));
 assert.ok(x.comunidades.some(c=>/comandante/.test(c.regime_de_autoridade_proposto)));
 assert.ok(x.comunidades.some(c=>/muda/.test(c.regime_de_autoridade_proposto)));
 assert.ok(x.comunidades.some(c=>/mestres de ofício/.test(c.regime_de_autoridade_proposto)));
 assert.ok(x.comunidades.some(c=>/fadas/.test(c.habitantes_propostos)));
 assert.ok(x.comunidades.some(c=>/goblins/.test(c.habitantes_propostos)));
 assert.ok(x.comunidades.some(c=>/gastrópodes/.test(c.habitantes_propostos)));
 assert.ok(x.comunidades.some(c=>/crustáceos/.test(c.habitantes_propostos)));
 assert.ok(x.comunidades.some(c=>/criaturas de rocha/.test(c.habitantes_propostos)));
});
test("XLIX: relações são só hipóteses de conflito e dependência",()=>{
 const x=build(),ids=new Set(x.comunidades.map(c=>c.id));
 assert.equal(x.relacoes.length,8);
 assert.ok(x.relacoes.every(r=>ids.has(r.origem_id)&&ids.has(r.destino_id)&&
   r.estado==="hipotese_sem_vinculo_aprovado"&&r.rota===false&&
   r.fluxo_comprovado===false&&r.distancia===null&&r.quantidade===null));
 assert.ok(x.restricoes.some(s=>s.includes("água potável")));
 assert.ok(x.restricoes.some(s=>s.includes("Abissais marinhos não são demônios")));
});
test("XLIX: toda tentativa de canonizar ou criar geografia e população fictícia é rejeitada",()=>{
 const deny=(reason,alter,match)=>{
  const src=structuredClone(lot);alter(src);
  assert.throws(()=>build(src),match,reason);
 };
 deny("aprovação global",x=>x.aprovacao_autoral=true,/proteção autoral/);
 deny("aprovação individual",x=>x.assentamentos[0].aprovacao_autoral=true,/Povoado promovido/);
 deny("localização confirmada",x=>x.assentamentos[0].localizacao_confirmada=true,/Povoado promovido/);
 deny("posição cartográfica",x=>x.assentamentos[0].geometria={lat:1},/Povoado promovido/);
 deny("distância",x=>x.assentamentos[0].distancia=10,/Povoado promovido/);
 deny("população",x=>x.assentamentos[0].populacao=300,/Povoado promovido/);
 deny("acesso",x=>x.assentamentos[0].ligacao_cartografada="Portomonte",/Povoado promovido/);
 deny("água potável",x=>x.assentamentos[0].viabilidade_hidrica_confirmada=true,/Povoado promovido/);
 deny("comida",x=>x.assentamentos[0].viabilidade_alimentar_confirmada=true,/Povoado promovido/);
 deny("governo genérico",x=>x.assentamentos[0].regime_de_autoridade_proposto="",/governança/);
 deny("sustento genérico",x=>x.assentamentos[0].subsistencia_condicional="",/governança/);
 deny("sem criaturas",x=>x.assentamentos[0].povos_mencionados=[],/moradores propostos/);
 deny("página sem fonte",x=>x.assentamentos[0].paginas_contexto=[999],/fonte ou ambiente/);
 deny("ambiente inventado",x=>x.assentamentos[0].ambiente_id="amb:azuis",/fonte ou ambiente/);
 deny("ilha como continente",x=>x.assentamentos[0].subzona="insular",/Povoado promovido/);
 deny("nome duplicado",x=>x.assentamentos[1].nome=x.assentamentos[0].nome,/Identidade duplicada/);
 deny("ID duplicado",x=>x.assentamentos[1].id=x.assentamentos[0].id,/Identidade duplicada/);
 deny("regimes repetidos",x=>x.assentamentos[1].forma=x.assentamentos[0].forma,/14 regimes/);
 deny("comunidade faltando",x=>x.assentamentos.pop(),/14 comunidades/);
 deny("habitat vira cidade",x=>x.habitats[0].conta_como_assentamento=true,/Habitat tratado/);
 deny("habitat vira sapiente",x=>x.habitats[0].sapiencia_confirmada=true,/Habitat tratado/);
 deny("habitat quantificado",x=>x.habitats[0].quantidade=11,/Habitat tratado/);
 deny("habitat faltando",x=>x.habitats.pop(),/14 comunidades/);
 deny("relação com entidade inventada",x=>x.relacoes_hipoteticas[0].origem_id="falso",/Relação territorial/);
 deny("rota declarada",x=>x.relacoes_hipoteticas[0].rota=true,/Relação territorial/);
 deny("fluxo aprovado",x=>x.relacoes_hipoteticas[0].fluxo_comprovado=true,/Relação territorial/);
 deny("distância entre povoados",x=>x.relacoes_hipoteticas[0].distancia=3,/Relação territorial/);
 deny("menos relações",x=>x.relacoes_hipoteticas.pop(),/Vínculos ou restrições/);
 deny("falso total",x=>x.balanco.propostas_comunidades_apos=120,/Soma regional/);
 deny("aprovação na soma",x=>x.balanco.aprovacoes_novas=1,/Soma regional/);
 deny("sem ressalvas",x=>x.restricoes=[],/Vínculos ou restrições/);
});
test("XLIX: interface oferece 14 comunidades, 8 habitats e 8 relações navegáveis",()=>{
 const el={innerHTML:"",events:{},addEventListener(k,cb){this.events[k]=cb}};
 initContinentalCoastSettlementLot(el,build());
 const cardCount=()=> (el.innerHTML.match(/class="coast-place(?: active)?"/g)||[]).length;
 const click=t=>el.events.click({target:{closest(k){return k==="[data-coast-tab]"?{dataset:{coastTab:t}}:null}}});
 assert.equal(cardCount(),14);
 assert.match(el.innerHTML,/nenhuma nova cidade foi canonizada/);
 click("habitats");assert.equal(cardCount(),8);
 click("relações");assert.equal((el.innerHTML.match(/class="coast-link"/g)||[]).length,8);
 assert.match(el.innerHTML,/não estradas/);
 click("limites");assert.match(el.innerHTML,/Materialidade antes da homologação/);
 click("comunidades");assert.equal(cardCount(),14);
 el.events.change({target:{closest(k){return k==="[data-coast-area]"?{value:"amb:penhascos"}:null}}});
 assert.equal(cardCount(),4);
});
test("XLIX: HTML, Pages e validação conectam a nova camada sem publicar o manuscrito",()=>{
 const html=read("site/atlas/index.html"),pages=read(".github/workflows/publicar-atlas-pages.yml"),
   ci=read(".github/workflows/validar-curadoria.yml");
 assert.match(html,/id="continentalCoastSettlements"/);
 assert.match(html,/import \{buildContinentalCoastSettlementLot\} from "\.\/settlement-coast-mainland\.mjs"/);
 assert.match(html,/buildContinentalCoastSettlementLot\(loaded\.continentalCoast,state\.settlementDensity,state\.environments,loaded\.authoredPages,loaded\.settlementHorizon\)/);
 assert.match(html,/initContinentalCoastSettlementLot\(\$\("continentalCoastSettlements"\),state\.continentalCoast\)/);
 assert.match(pages,/data\/propostas\/povoamento-costa-continental-ciclo49\.json/);
 assert.match(pages,/tests\/atlas-settlement-coast-mainland\.test\.mjs/);
 assert.match(ci,/tests\/atlas-settlement-coast-mainland\.test\.mjs/);
 assert.doesNotMatch(pages,/^\s+fontes\/autoria\/hack-carcaca-dw-capitulo-i\.paginas\.json\s*$/m);
 const tmp=mkdtempSync(join(tmpdir(),"coast-xlix-"));
 try{const module=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(module);
   const path=join(tmp,"atlas.mjs");writeFileSync(path,module,"utf8");
   execFileSync(process.execPath,["--check",path],{stdio:"pipe"});
 }finally{rmSync(tmp,{recursive:true,force:true})}
});