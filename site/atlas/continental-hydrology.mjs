/** Hidrografia macro: sem produzir bacias, linhas, distâncias ou potabilidade não documentadas. */
export function buildContinentalHydrology(data,physical,environments,interfaces,topology){
 if(!data||data.schema_version!=="1.0"||data.estado!=="inventario_hidrico_macro"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.representacao!=="qualitativa_sem_geometria")
   throw new Error("Hidrografia sem salvaguardas editoriais");
 if(!Array.isArray(physical?.pontos)||!Array.isArray(environments?.ambientes)||
    !Array.isArray(environments?.relacoes)||!Array.isArray(interfaces?.interfaces)||
    !Array.isArray(topology?.decisoes))
   throw new Error("Fontes hidrográficas do Atlas incompletas");
 const originalGeo=new Map(physical.pontos.map(x=>[x.id,x]));
 const originalEnv=new Map(environments.ambientes.map(x=>[x.id,x]));
 const envRelations=new Map(environments.relacoes.map(x=>[x.id,x]));
 const knownInterfaces=new Map(interfaces.interfaces.map(x=>[x.id,x]));
 const knownDecisions=new Map(topology.decisoes.map(x=>[x.id,x]));
 const legalTypes=new Set(["fluvial","queda","insular_fluvial","territorio_hidrico","agua_ritual",
    "marinho","fronteira_movel","relevo_potencial","subsolo_potencial"]);
 const legalStates=new Set(["documentado","documentado_com_limite","documentado_variavel","regime_indeterminado"]);
 const relationTypes=new Set(["desagua","contem_ilha","transicao_movel","zona_de_transicao",
    "ambiente_contido","purificacao_local"]);
 function pages(o){
   if(!Array.isArray(o.paginas)||!o.paginas.length||
      o.paginas.some(p=>!Number.isInteger(p)||p<2||p>25))
     throw new Error("Referência de página inválida: "+o.id);
 }
 const units=new Map();
 for(const u of data.unidades||[]){
   if(!u.id||units.has(u.id)||!u.nome||!legalTypes.has(u.tipo)||!legalStates.has(u.estado))
     throw new Error("Domínio hídrico duplicado ou malformado: "+u.id);
   pages(u);
   const g=originalGeo.get(u.ref_fisica),e=originalEnv.get(u.ref_ambiente);
   if(!g||!e)throw new Error("Âncora hídrica não existe: "+u.id);
   if(!Array.isArray(u.setores)||u.setores.length!==1||
      !g.setores.includes(u.setores[0])||!e.setores.includes(u.setores[0]))
     throw new Error("Domínio hídrico deslocado para setor incorreto: "+u.id);
   if(!u.documentado||!u.desconhecido||!u.nao_inferir)
     throw new Error("Domínio sem separação de evidência e limites: "+u.id);
   if(u.geometria!==null||u.volume!==null||u.regime_sazonal!==null)
     throw new Error("Hidrografia inventou geometria ou vazão: "+u.id);
   if(["territorio_hidrico","relevo_potencial","subsolo_potencial"].includes(u.tipo)&&u.estado!=="regime_indeterminado")
     throw new Error("Regime hídrico hipotético convertido em documentado: "+u.id);
   if(u.tipo==="fronteira_movel"&&u.estado!=="documentado_variavel")
     throw new Error("Fronteira marítima tratada como fixa: "+u.id);
   if(u.tipo==="agua_ritual"&&u.estado!=="documentado_com_limite")
     throw new Error("Purificação local tratada como universal: "+u.id);
   units.set(u.id,{...u});
 }
 if(units.size!==13)throw new Error("Inventário hidrográfico incompleto");
 const links=new Map();
 for(const v of data.vinculos||[]){
   if(!v.id||links.has(v.id)||!relationTypes.has(v.tipo)||!units.has(v.de)||!units.has(v.para)||v.de===v.para)
     throw new Error("Vínculo hídrico inválido: "+v.id);
   pages(v);
   if(v.geometria!==null||v.roteiro_de_agua_confirmado!==false)
     throw new Error("Vínculo hídrico desenhado como curso: "+v.id);
   if(!v.documentado)throw new Error("Vínculo sem evidência: "+v.id);
   if(v.ref_ambiental){
     const r=envRelations.get(v.ref_ambiental);
     if(!r)throw new Error("Relação ambiental hídrica inexistente: "+v.id);
     const a=originalEnv.get(units.get(v.de).ref_ambiente).id;
     const b=originalEnv.get(units.get(v.para).ref_ambiente).id;
     if(!([r.de,r.para].includes(a)&&[r.de,r.para].includes(b)))
       throw new Error("Vínculo hídrico não corresponde ao ambiente: "+v.id);
   }
   if(v.ref_interface){
     const x=knownInterfaces.get(v.ref_interface);
     if(!x)throw new Error("Interface hídrica não encontrada: "+v.id);
     if(v.tipo==="transicao_movel"&&x.estado!=="movel")
       throw new Error("Fronteira marítima convertida em fixa: "+v.id);
   }
   if(!v.ref_ambiental&&!v.ref_interface&&v.tipo!=="purificacao_local")
     throw new Error("Vínculo físico sem referência: "+v.id);
   if(v.tipo==="purificacao_local"&&(
      v.de!=="hidro:xxxix:mar-sangue"||v.para!=="hidro:xxxix:portomonte"||
      !v.paginas.includes(5)||v.ref_interface||v.ref_ambiental))
     throw new Error("Purificação de Portomonte indevidamente generalizada: "+v.id);
   if(v.tipo==="desagua"&&(v.de!=="hidro:xxxix:rio-ancestral"||v.para!=="hidro:xxxix:abismo"))
     throw new Error("Deságue do Rio Ancestral alterado");
   links.set(v.id,{...v});
 }
 if(links.size!==6)throw new Error("Ligações hidrográficas incompletas");
 const gaps=new Map();
 for(const q of data.lacunas||[]){
   if(!q.id||gaps.has(q.id)||!units.has(q.ref_dominio))
     throw new Error("Lacuna hídrica duplicada ou sem domínio: "+q.id);
   pages(q);
   if(!q.pergunta||q.resolvida!==false||q.estado!=="pendente"||q.promove_bacia!==false)
     throw new Error("Lacuna hídrica resolvida sem autoria: "+q.id);
   if(q.ref_decisao){
     const decision=knownDecisions.get(q.ref_decisao);
     if(!decision||decision.opcao_aprovada!==null)
       throw new Error("Decisão topológica inconsistente: "+q.id);
   }
   gaps.set(q.id,q);
 }
 if(gaps.size!==12)throw new Error("Lacunas hídricas insuficientes");
 const required=["rio-ancestral","abismo","ilha-lunar","caatinga","portomonte","mar-sangue",
   "limite-azul","oceanos-azuis","thargrid","grama","cavernas"];
 if(required.some(id=>!units.has("hidro:xxxix:"+id)))
   throw new Error("Domínio físico essencial omitido");
 if(!data.invariantes?.length||data.invariantes.length<7)
   throw new Error("Política de proveniência hídrica ausente");
 if(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|bacia_confirmada|nascente_confirmada)"\s*:/i.test(JSON.stringify(data)))
   throw new Error("Precisão cartográfica ou bacia fictícia em fonte hidrográfica");
 return {titulo:data.titulo,principio:data.principio,altera_canon:false,
   unidades:[...units.values()],vinculos:[...links.values()],lacunas:[...gaps.values()],
   invariantes:data.invariantes,totais:{unidades:units.size,vinculos:links.size,lacunas:gaps.size,
      geometria_confirmada:0,comRegimeIndeterminado:[...units.values()].filter(x=>x.estado==="regime_indeterminado").length,
      semNascentesConfirmadas:true}};
}
