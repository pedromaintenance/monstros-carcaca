import test from "node:test";
import assert from "node:assert/strict";
import {createCarcacaAtlas} from "../src/carcaca-client.mjs";

const fixtures={
  "manifest.json":{arquivos:{catalog:"catalog.json",creatures:"creatures.json",
    indexes:"indexes.json",regions:"regions.json",fronts:"fronts.json"}},
  "catalog.json":[
    {id:"carcaca:criatura:joro",nome:"Jorō",tipo_carcaca:"yokai",tipo_dnd:"fey",
     regioes:["regiao:foz"],lugares:["lugar:arquivo"],faccoes:["faccao:yokai"],
     estado:"rascunho",nd_dnd:14},
    {id:"carcaca:criatura:kappa",nome:"Kappa",tipo_carcaca:"yokai",tipo_dnd:"fey",
     regioes:["regiao:foz"],lugares:["lugar:arquivo"],faccoes:[],
     estado:"rascunho",nd_dnd:null},
    {id:"carcaca:criatura:urso",nome:"Urso",tipo_carcaca:"fauna",tipo_dnd:"beast",
     regioes:["regiao:norte"],lugares:[],faccoes:[],estado:"rascunho",nd_dnd:2}
  ],
  "creatures.json":[{id:"carcaca:criatura:joro",dungeon_world:{instinto:"Testar visitantes"}}],
  "regions.json":[],
  "fronts.json":[],
  "indexes.json":{}
};
let requests=0;
const atlas=createCarcacaAtlas({baseUrl:"https://localhost/snapshot",fetchImpl:async url=>{
  requests++;
  const key=url.split("/").at(-1);
  return {ok:!!fixtures[key],status:fixtures[key]?200:404,json:async()=>fixtures[key]};
}});
test("busca filtra tipo Carcaça e região sem alterar tipo D&D",async()=>{
  const rows=await atlas.search({tipoCarcaca:"yokai",regiaoId:"regiao:foz"});
  assert.equal(rows.length,2);
  assert.equal(rows[0].tipo_dnd,"fey");
  assert.equal((await atlas.search({tipoDnd:"beast"}))[0].nome,"Urso");
});
test("ausência de ND não equivale a ND 0",async()=>{
  const rows=await atlas.search({ndMin:0});
  assert.deepEqual(rows.map(x=>x.nome),["Jorō","Urso"]);
});
test("busca ignora acentos e respeita paginação",async()=>{
  assert.equal((await atlas.search({query:"joro"})).length,1);
  assert.equal((await atlas.search({regiaoId:"regiao:foz",limit:1,offset:1}))[0].nome,"Kappa");
});
test("retorna ficha autoral e cacheia segmentos",async()=>{
  assert.equal((await atlas.get("carcaca:criatura:joro")).dungeon_world.instinto,"Testar visitantes");
  assert.equal(await atlas.get("carcaca:criatura:nao-existe"),null);
  const before=requests;await atlas.getCatalog();await atlas.getManifest();
  assert.equal(requests,before);
});
test("rejeita paginação inválida",async()=>{
  await assert.rejects(()=>atlas.search({limit:1000}),RangeError);
  await assert.rejects(()=>atlas.search({offset:-1}),RangeError);
});
