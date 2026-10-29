/**
 * Matriz de topologia conceitual: NÃO representa geometria, passagem ou decisão autoral.
 * Referências devem corresponder às interfaces do Ciclo XXXVI e à geografia do XXXIV.
 */
export function buildTopologyChoices(data,macro,interfaces,physical){
 if(!data||data.schema_version!=="1.0"||data.estado!=="oficina_de_decisoes_autorais"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.tipo!=="topologia_conceitual_sem_projecao")
   throw new Error("Topologia sem salvaguardas autorais");
 if(!macro?.setores||!interfaces?.interfaces||!interfaces?.questoes||!physical?.pontos)
   throw new Error("Base macro/topológica insuficiente");
 if(JSON.stringify(data).match(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|rota_confirmada|fronteira_definida)"\s*:/i))
   throw new Error("Coordenadas, polígonos ou rotas não cabem numa oficina de topologia");
 const areas=new Set(macro.setores.map(x=>x.id));
 const knownQ=new Map(interfaces.questoes.map(x=>[x.id,x]));
 const knownI=new Map(interfaces.interfaces.map(x=>[x.id,x]));
 const knownP=new Map(physical.pontos.map(x=>[x.id,x]));
 const groups=new Map();
 for(const g of data.grupos||[]){
   if(!g.id||groups.has(g.id)||!g.nome||!g.descricao)
     throw new Error("Grupo topológico duplicado ou incompleto");
   if(!g.setores?.length||g.setores.some(s=>!areas.has(s)))
     throw new Error("Grupo com setor inexistente: "+g.id);
   groups.set(g.id,g);
 }
 if(groups.size!==4)throw new Error("A matriz precisa de quatro conjuntos continentais");
 const ids=new Set(),seenQuestions=new Set(),allOptions=new Set(),costs=new Set(["baixo","medio","alto"]);
 for(const d of data.decisoes||[]){
   if(!d.id||ids.has(d.id)||!groups.has(d.grupo))
     throw new Error("Decisão topológica duplicada ou sem conjunto: "+d.id);
   ids.add(d.id);
   if(d.estado!=="pendente"||d.opcao_aprovada!==null)
     throw new Error("Alternativa topológica promovida sem decisão: "+d.id);
   const q=knownQ.get(d.ref_questao);
   if(!q||q.pendente!==true||seenQuestions.has(d.ref_questao))
     throw new Error("Questão autoral não vinculada ou duplicada: "+d.id);
   seenQuestions.add(d.ref_questao);
   if(!d.setores?.length||d.setores.some(s=>!q.setores.includes(s))||
      q.setores.some(s=>!d.setores.includes(s)))
     throw new Error("Setores diferentes da questão original: "+d.id);
   if(d.setores.some(s=>!groups.get(d.grupo).setores.includes(s)))
     throw new Error("Grupo territorial incoerente: "+d.id);
   if(!d.paginas?.length||d.paginas.some(p=>!Number.isInteger(p)||p<2||p>25))
     throw new Error("Decisão sem referências válidas ao manuscrito: "+d.id);
   if(!d.documentado||!Array.isArray(d.invariantes)||d.invariantes.length<2)
     throw new Error("Faltam fatos e restrições invariantes: "+d.id);
   if(!Array.isArray(d.ref_interfaces)||d.ref_interfaces.some(id=>!knownI.has(id)))
     throw new Error("Interface de origem inexistente: "+d.id);
   if(!d.ref_pontos_fisicos?.length||d.ref_pontos_fisicos.some(id=>!knownP.has(id)))
     throw new Error("Ponto anatômico inexistente: "+d.id);
   if(d.alternativas?.length!==3)throw new Error("Cada questão deve ter três alternativas: "+d.id);
   for(const o of d.alternativas){
     if(!o.id||allOptions.has(o.id))throw new Error("Alternativa repetida: "+o.id);
     allOptions.add(o.id);
     if(o.estado!=="nao_adotada"||o.aprovacao_autoral!==false||o.geometria!==null||o.cria_lugar!==false)
       throw new Error("Alternativa convertida em fato ou geometria: "+o.id);
     if(!costs.has(o.custo_editorial)||!o.titulo||!o.esquema||!o.hipotese||
        !o.implicacao_cartografica||!o.consequencia_material||!o.condicao_para_canonizar)
       throw new Error("Alternativa incompleta: "+o.id);
   }
 }
 if(ids.size!==8||seenQuestions.size!==knownQ.size||allOptions.size!==24)
   throw new Error("Questões do ciclo anterior sem cobertura ou alternativas insuficientes");
 if(!data.aviso?.includes("temporárias")||!data.aviso.includes("não alteram o cânone"))
   throw new Error("Aviso sobre seleção temporária ausente");
 return {titulo:data.titulo,aviso:data.aviso,altera_canon:false,grupos:data.grupos,
   decisoes:data.decisoes,totais:{grupos:groups.size,decisoes:ids.size,alternativas:allOptions.size,
     opcoesCanonicas:0,referenciasInterfaces:data.decisoes.reduce((s,d)=>s+d.ref_interfaces.length,0)}};
}
