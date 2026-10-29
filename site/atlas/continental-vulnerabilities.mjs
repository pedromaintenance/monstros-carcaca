/** Ciclo XLII: hipóteses reversíveis, sem prognóstico quantitativo nem propagação automática. */
export function buildContinentalVulnerabilities(data,material,chrono,hydrology){
 if(!data||data.schema_version!=="1.0"||data.estado!=="laboratorio_hipotetico_nao_canonico"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.representacao!=="cenarios_de_relacoes_sem_previsao")
   throw new Error("O laboratório perdeu as salvaguardas autorais");
 if(!Array.isArray(material?.nodos)||!Array.isArray(material?.vinculos)||
    !Array.isArray(chrono?.futuros_em_aberto)||!Array.isArray(hydrology?.unidades))
   throw new Error("Fontes de dependências materiais, cronologia ou hidrografia ausentes");
 if(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|risco_calculado|resiliencia_calculada)"\s*:/i.test(JSON.stringify(data)))
   throw new Error("O laboratório contém campos de previsão ou cartografia proibidos");
 const nodes=new Map(material.nodos.map(n=>[n.id,n]));
 const links=new Map(material.vinculos.map(e=>[e.id,e]));
 const chronological=new Set(chrono.futuros_em_aberto.map(x=>x.id));
 const hydro=new Set(hydrology.unidades.map(x=>x.id));
 if(!chronological.has("futuro:xl:drakport")||!chronological.has("futuro:xl:thargrid"))
   throw new Error("Os futuros de Drakport e Thargrid não estão preservados");
 if(!hydro.has("hidro:xxxix:portomonte")||!hydro.has("hidro:xxxix:limite-azul"))
   throw new Error("O cenário costeiro perdeu a referência à água local e ao limite móvel");
 const groups=new Map();
 for(const g of data.grupos||[]){
   if(!g.id||groups.has(g.id)||!g.titulo||!g.limite)
     throw new Error("Grupo de cenário duplicado ou sem limites");
   groups.set(g.id,g);
 }
 const requiredGroups=["colonial","resistencia","mobilidade","litoral","autonomia"];
 if(groups.size!==5||requiredGroups.some(x=>!groups.has(x)))
   throw new Error("Os cinco sistemas de dependência não foram preservados");
 const allowedKinds=new Set(["interrupcao_hipotetica","pressao_hipotetica","cenario_composto_independente"]);
 const cases=new Map();
 for(const c of data.cenarios||[]){
   if(!c.id||cases.has(c.id)||!c.titulo||!groups.has(c.grupo)||!allowedKinds.has(c.tipo)||
      c.estado!=="hipotese_de_estudo"||c.adotado!==false||c.ocorreu!==false)
     throw new Error("Cenário duplicado, declarado acontecido ou aprovado");
   if(c.geometria!==null||c.probabilidade!==null||c.perda_calculada!==null||
      c.duracao!==null||c.impacto_medido!==null||c.propagacao_automatica!==false)
     throw new Error("Cenário criou prognóstico, área, duração ou efeito automático: "+c.id);
   if(!Array.isArray(c.vinculos_foco)||!c.vinculos_foco.length||
      new Set(c.vinculos_foco).size!==c.vinculos_foco.length||
      c.vinculos_foco.some(x=>!links.has(x)))
     throw new Error("Cenário sem vínculo material direto confirmado: "+c.id);
   if(!Array.isArray(c.vinculos_relacionados_apenas_condicionais)||
      new Set(c.vinculos_relacionados_apenas_condicionais).size!==c.vinculos_relacionados_apenas_condicionais.length||
      c.vinculos_relacionados_apenas_condicionais.some(x=>!links.has(x)||c.vinculos_foco.includes(x)))
     throw new Error("Relações condicionais indevidamente tratadas como consequências diretas: "+c.id);
   if(!Array.isArray(c.nodos_contextuais)||!c.nodos_contextuais.length||
      new Set(c.nodos_contextuais).size!==c.nodos_contextuais.length||
      c.nodos_contextuais.some(x=>!nodes.has(x)))
     throw new Error("Nós contextuais ausentes: "+c.id);
   if(!c.vinculos_foco.some(id=>c.nodos_contextuais.some(n=>
     links.get(id).de===n||links.get(id).para===n)))
     throw new Error("O cenário não contempla nenhuma ponta do vínculo testado: "+c.id);
   if(!Array.isArray(c.paginas)||!c.paginas.length||
      c.paginas.some(n=>!Number.isInteger(n)||n<2||n>25)||
      c.vinculos_foco.some(id=>!links.get(id).paginas.some(p=>c.paginas.includes(p))))
     throw new Error("A premissa não está ancorada nas páginas dos vínculos: "+c.id);
   const prose=["premissa","efeito_direto","repercussao_condicional","contrapeso_documentado","nao_inferir"];
   if(prose.some(k=>!c[k]||typeof c[k]!=="string"||c[k].length<40)||
      !Array.isArray(c.perguntas)||c.perguntas.length<2||c.perguntas.some(x=>!x||typeof x!=="string"))
     throw new Error("Faltam premissa, evidências, condições ou cautelas: "+c.id);
   if(c.tipo==="cenario_composto_independente"&&c.vinculos_foco.length<2)
     throw new Error("Hipótese composta exige vínculos independentes");
   cases.set(c.id,{...c,
     vinculos_foco_expandido:c.vinculos_foco.map(id=>({...links.get(id),de_nome:nodes.get(links.get(id).de).titulo,
       para_nome:nodes.get(links.get(id).para).titulo})),
     vinculos_condicionais_expandido:c.vinculos_relacionados_apenas_condicionais.map(id=>({...links.get(id),
       de_nome:nodes.get(links.get(id).de).titulo,para_nome:nodes.get(links.get(id).para).titulo})),
     nodos_expandidos:c.nodos_contextuais.map(id=>nodes.get(id))
   });
 }
 const expected={
 "rio-tributacao":["tributos-rio"],"drakport":["drakport-coercao"],
 "minerio-forja":["minerio-forjas"],"depositos-resistencia":["armazens-resistencia"],
 "eldroth-refugio":["eldroth-costa","eldroth-thargrid"],"contato-clandestino":["ironwood-druidas"],
 "costa-comercio":["portomonte-comercio"],"pradarias-pilhagens":["caatinga-pradarias"],
 "grama-abrigo":["grama-fugitivos"],"subsolo-troca":["svirf-gemas","anoes-svirf"],
 "mar-tributo":["abissais-costa"]
 };
 if(cases.size!==11||Object.keys(expected).some(id=>{
   const c=cases.get("cenario:xlii:"+id);
   return !c||c.vinculos_foco.length!==expected[id].length||
     expected[id].some(x=>!c.vinculos_foco.includes("vinculo:xli:"+x));
 })) throw new Error("O conjunto de onze exercícios perdeu uma relação essencial");
 for(const c of cases.values()){
   const link=links.get(c.vinculos_foco[0]);
   if(link.tipo==="exigencia_tributaria"&&c.tipo!=="pressao_hipotetica")
     throw new Error("Exigência marítima confundida com remessa efetiva");
   if(link.tipo==="trabalho_forcado"&&!c.nao_inferir.toLowerCase().includes("liberta"))
     throw new Error("Coerção sem ressalva sobre pessoas escravizadas");
 }
 if(!data.criterio?.includes("Cenários hipotéticos")||
    !Array.isArray(data.invariantes)||data.invariantes.length<8||
    !Array.isArray(data.proximos_dados_necessarios)||data.proximos_dados_necessarios.length<4)
   throw new Error("As regras de interpretação ou os dados ainda necessários foram omitidos");
 const arr=[...cases.values()];
 return {titulo:data.titulo,criterio:data.criterio,altera_canon:false,
  grupos:data.grupos,cenarios:arr,invariantes:data.invariantes,
  proximos_dados_necessarios:data.proximos_dados_necessarios,
  totais:{cenarios:arr.length,grupos:groups.size,vinculos_foco_unicos:new Set(arr.flatMap(x=>x.vinculos_foco)).size,
    eventos_canonizados:0,previsoes_numericas:0},
  por_grupo:data.grupos.map(g=>({...g,cenarios:arr.filter(x=>x.grupo===g.id)}))};
}
