/** Carta editorial do continente. Não produz geometria, coordenadas ou soberanias. */
export function buildCartographicCharter(data,physical,interfaces,topology){
 if(!data||data.schema_version!=="1.0"||data.estado!=="guia_editorial_de_desenho"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.sistema!=="orientacao_qualitativa_sem_projecao")
   throw new Error("Carta cartográfica sem salvaguarda autoral");
 if(!physical?.pontos||!physical?.relacoes||!interfaces?.interfaces||!topology?.decisoes)
   throw new Error("Dependências cartográficas não carregadas");
 if(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono)"\s*:/i.test(JSON.stringify(data)))
   throw new Error("Carta de restrições contém campos de georreferenciamento");
 const original=new Map(physical.pontos.map(p=>[p.id,p]));
 const physicalRelations=new Map(physical.relacoes.map(r=>[r.id,r]));
 const knownInterfaces=new Map(interfaces.interfaces.map(x=>[x.id,x]));
 const decisions=new Map(topology.decisoes.map(x=>[x.id,x]));
 const categories=new Map();
 for(const cat of data.legenda||[]){
   if(!cat.id||categories.has(cat.id)||cat.modo!=="rotulo_qualitativo_sem_coordenadas")
     throw new Error("Legenda inválida ou duplicada");
   categories.set(cat.id,cat);
 }
 const required=["leste","oeste","norte","sul","relativo","transversal","indeterminado","contestado"];
 if(categories.size!==required.length||required.some(s=>!categories.has(s)))
   throw new Error("Legenda não inclui todos os níveis de localização");
 const statusByOrientation={leste:"leste",oeste:"oeste",norte:"norte",sul:"sul",
    atravessa:"transversal","nao_fixado":"indeterminado","alem_abismo":"relativo",
    "sul-relativo":"relativo","norte-relativo":"relativo","alem-mar":"relativo"};
 const marks=new Map();
 for(const m of data.marcos||[]){
   if(!m.id||marks.has(m.id)||!m.referencia_fisica||!original.has(m.referencia_fisica))
     throw new Error("Marco cartográfico inexistente ou duplicado: "+m.id);
   const p=original.get(m.referencia_fisica);
   const expected=p.estado==="documentado_com_conflito"?"contestado":statusByOrientation[p.orientacao];
   if(!expected||m.classe!==expected)throw new Error("Classe de orientação adulterada: "+m.id);
   if(m.geometria!==null||m.coordenadas!==null||m.aprovado_para_pino!==false)
     throw new Error("Marco promovido a posição precisa: "+m.id);
   if(!m.desenho_permitido||!m.rotulo)throw new Error("Instruções cartográficas vazias: "+m.id);
   marks.set(m.id,{...m,referencia:p});
 }
 if(marks.size!==original.size||original.size!==20)
   throw new Error("Nem todos os marcos do Ciclo XXXIV foram preservados");
 const allowedSymbols=new Set(["seta_conceitual","oposicao_cardeal","limite_movel","relacao_contestada","relacao_sem_tracado"]);
 const lines=new Map();
 for(const e of data.relacoes||[]){
   if(!e.referencia||lines.has(e.referencia)||!physicalRelations.has(e.referencia))
     throw new Error("Relação física inexistente ou duplicada");
   if(!allowedSymbols.has(e.simbolo)||e.desenhar_linha!==false||e.estado!=="documental_nao_cartografado")
     throw new Error("Relação indevidamente cartografada: "+e.referencia);
   const ref=physicalRelations.get(e.referencia);
   if(ref.tipo==="topologia_contestada"&&e.simbolo!=="relacao_contestada")
     throw new Error("Relação contestada convertida em vínculo certo");
   if(e.simbolo==="relacao_contestada"&&ref.tipo!=="topologia_contestada")
     throw new Error("Relação não contestada marcada como conflito");
   if(e.simbolo==="limite_movel"&&ref.id!=="rel-xxxiv:aguas-azuis-mar-de-sangue")
     throw new Error("Fronteira móvel associada a outra relação");
   lines.set(e.referencia,{...e,referencia_original:ref});
 }
 if(lines.size!==physicalRelations.size||lines.size!==12)
   throw new Error("Faltam relações do Ciclo XXXIV");
 const pending=new Map();
 for(const d of data.decisoes_pendentes||[]){
   if(!d.referencia_decisao||pending.has(d.referencia_decisao)||!decisions.has(d.referencia_decisao))
     throw new Error("Decisão inexistente ou duplicada");
   if(d.requer_decisao_autoral!==true||d.aprovada!==false||
     decisions.get(d.referencia_decisao).opcao_aprovada!==null)
     throw new Error("Decisão autoral indevidamente aprovada");
   pending.set(d.referencia_decisao,{...d,original:decisions.get(d.referencia_decisao)});
 }
 if(pending.size!==decisions.size||pending.size!==8)
   throw new Error("Decisões autorais não integralmente representadas");
 const dynamic=data.fenomenos_dinamicos||[];
 if(dynamic.length!==1)throw new Error("Deve existir uma única fronteira marítima móvel");
 const d=dynamic[0],originalInterface=knownInterfaces.get(d.referencia_interface);
 if(!originalInterface||originalInterface.estado!=="movel"||d.tipo!=="transicao_movel"||
   d.linha_fixa!==false||d.poligono_fixo!==false||d.geometria!==null)
   throw new Error("Fronteira móvel foi tratada como limite fixo");
 if(!Array.isArray(data.guia_de_uso)||data.guia_de_uso.length<4)
   throw new Error("Orientações de desenho insuficientes");
 const list=[...marks.values()];
 return {titulo:data.titulo,estado:data.estado,altera_canon:false,
   legenda:data.legenda,marcos:list,relacoes:[...lines.values()],
   decisoes_pendentes:[...pending.values()],fenomenos_dinamicos:dynamic,
   guia_de_uso:data.guia_de_uso,grupos:required.map(id=>({
     classe:id,titulo:categories.get(id).titulo,marcos:list.filter(x=>x.classe===id)})),
   totais:{marcos:marks.size,relacoes:lines.size,decisoes_pendentes:pending.size,
     geometrias_autorizadas:0,cardeais:list.filter(x=>["leste","oeste","norte","sul"].includes(x.classe)).length,
     relativos:list.filter(x=>x.classe==="relativo").length,
     nao_posicionados:list.filter(x=>x.classe==="indeterminado").length,
     conflitos:list.filter(x=>x.classe==="contestado").length}};
}
