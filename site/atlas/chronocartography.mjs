/** Timeline territorial qualitativa: não deduz fronteiras nem projeta esferas atuais sobre séculos passados. */
export function buildChronocartography(data,macro,networks,physical,topology){
 if(!data||data.schema_version!=="1.0"||data.estado!=="leitura_historica_sem_fronteiras"||
    data.aprovacao_autoral!==false||data.altera_canon!==false||
    data.representacao!=="periodos_e_marcos_qualitativos")
   throw new Error("Cronocartografia sem salvaguarda autoral");
 if(!Array.isArray(macro?.setores)||!Array.isArray(networks?.cronologia)||
    !Array.isArray(networks?.esferas)||!Array.isArray(physical?.pontos)||
    !Array.isArray(topology?.decisoes))
   throw new Error("Fontes cronocartográficas incompletas");
 if(/"(?:latitude|longitude|lat|lng|coordinates|polygon|poligono|fronteira_definida|rota_cartografada)"\s*:/i.test(JSON.stringify(data)))
   throw new Error("Geometria não autorizada na cronocartografia");
 const originalEvents=new Map(networks.cronologia.map(e=>[e.id,e]));
 const originalSpheres=new Map(networks.esferas.map(e=>[e.id,e]));
 const originalPlaces=new Map(physical.pontos.map(x=>[x.id,x]));
 const sectorIds=new Set(macro.setores.map(x=>x.id));
 const knownRoles=new Map();
 for(const role of data.papeis_territoriais||[]){
   if(!role.id||knownRoles.has(role.id)||!role.nome||role.implica_soberania_continua!==false)
     throw new Error("Papel político não documentado ou com soberania inferida");
   knownRoles.set(role.id,role);
 }
 if(knownRoles.size!==14)throw new Error("Vocabulário de papéis territoriais incompleto");
 const periods=new Map(),range=[];
 for(const period of data.fases||[]){
   if(!period.id||periods.has(period.id)||!period.titulo||!period.leitura_editorial)
     throw new Error("Fase histórica duplicada ou malformada");
   if(!Number.isInteger(period.inicio_ec)||!Number.isInteger(period.fim_ec)||
      period.inicio_ec<0||period.fim_ec<period.inicio_ec||period.geometria!==null||
      period.fronteira_retroativa!==false)
     throw new Error("Fase com fronteiras ou datas inválidas");
   if(range.length&&period.inicio_ec!==range[range.length-1].fim_ec+1)
     throw new Error("Fases com sobreposição ou lacuna cronológica");
   periods.set(period.id,period);range.push(period);
 }
 if(periods.size!==6||range[0].inicio_ec!==0||range[range.length-1].fim_ec!==999)
   throw new Error("Os seis recortes devem cobrir os marcos documentados 0–999 EC");
 const events=new Map();
 for(const e of data.eventos||[]){
   if(!e.id||events.has(e.id)||!originalEvents.has(e.ref_cronologia))
     throw new Error("Evento cronocartográfico inexistente ou duplicado");
   const o=originalEvents.get(e.ref_cronologia),p=periods.get(e.ref_fase);
   if(!p||o.ano_ec<p.inicio_ec||o.ano_ec>p.fim_ec)
     throw new Error("Evento situado no período incorreto: "+e.id);
   if(!knownRoles.has(e.tipo)||!e.leitura_editorial)
     throw new Error("Evento sem leitura política controlada: "+e.id);
   if(e.fronteira_confirmada!==false||e.rota_confirmada!==false||
      e.geometria!==null||e.nao_aplicar_como_estado_territorial!==true)
     throw new Error("Evento convertido em soberania ou rota: "+e.id);
   const keys=Object.keys(e.leitura_por_setor||{});
   if(keys.length!==o.setores.length||keys.some(x=>!sectorIds.has(x)||!o.setores.includes(x)||!knownRoles.has(e.leitura_por_setor[x])))
     throw new Error("Papéis setoriais divergem do evento original: "+e.id);
   if(o.setores.some(x=>!keys.includes(x)))throw new Error("Setor omitido do evento: "+e.id);
   if(e.ref_marco_fisico!==null&&!originalPlaces.has(e.ref_marco_fisico))
     throw new Error("Marco físico histórico não catalogado: "+e.id);
   events.set(e.ref_cronologia,{...e,ano_ec:o.ano_ec,titulo:o.titulo,setores:o.setores,
      paginas:o.paginas,nota_documental:o.nota,cronologia_original:o});
 }
 if(events.size!==17||events.size!==originalEvents.size)
   throw new Error("Há eventos históricos omitidos ou inventados");
 const critical={
  "tempo-xxxiii:01":{ano:0,papel:"formacao"},
  "tempo-xxxiii:03":{ano:342,papel:"incursao"},
  "tempo-xxxiii:08":{ano:711,papel:"sede"},
  "tempo-xxxiii:12":{ano:910,papel:"ocupacao"},
  "tempo-xxxiii:15":{ano:983,papel:"destruicao"},
  "tempo-xxxiii:16":{ano:984,papel:"golpe"},
  "tempo-xxxiii:17":{ano:999,papel:"marco"}
 };
 for(const [id,expected] of Object.entries(critical)){
   const e=events.get(id);
   if(!e||e.ano_ec!==expected.ano||e.tipo!==expected.papel)
     throw new Error("Marco histórico essencial alterado: "+id);
 }
 const year910=events.get("tempo-xxxiii:12");
 if(year910.leitura_por_setor.rio!=="ocupacao"||year910.leitura_por_setor.thargrid!=="resistencia")
   throw new Error("910 EC confundiu ocupação com resistência");
 const year0=events.get("tempo-xxxiii:01");
 if(Object.values(year0.leitura_por_setor).some(x=>x!=="formacao"))
   throw new Error("0 EC não é um mapa de soberanias");
 const centers=new Map();
 for(const center of data.polos||[]){
   if(!center.id||centers.has(center.id)||!originalSpheres.has(center.ref_esfera))
     throw new Error("Polo político inexistente ou duplicado");
   if(center.validade!=="panorama_sem_data_inicial_confirmada"||center.inicia_no_ano!==null||
      center.termina_no_ano!==null||center.nao_retroprojetar!==true||
      center.fronteira_confirmada!==false||center.geometria!==null)
     throw new Error("Polo atual projetado indevidamente no passado: "+center.id);
   if(!Array.isArray(center.ref_eventos_contextuais)||
      new Set(center.ref_eventos_contextuais).size!==center.ref_eventos_contextuais.length||
      center.ref_eventos_contextuais.some(id=>!events.has(id)))
     throw new Error("Referências temporais do polo não existem: "+center.id);
   const o=originalSpheres.get(center.ref_esfera);
   if(o.fronteira_definida!==false||!center.nota)
     throw new Error("O polo recebeu fronteira ou perdeu ressalva");
   centers.set(center.ref_esfera,{...center,original:o});
 }
 if(centers.size!==14||centers.size!==originalSpheres.size)
   throw new Error("Panorama de polos incompleto");
 const future=new Set();
 for(const q of data.futuros_em_aberto||[]){
   if(!q.id||future.has(q.id)||!q.pergunta||q.pagina!==11||
      q.estado!=="nao_acontecido_ou_indeterminado"||
      q.ano_ec!==null||q.acontecimento_confirmado!==false||q.geometria!==null)
     throw new Error("O futuro em aberto foi tratado como fato histórico");
   future.add(q.id);
 }
 if(future.size!==7)throw new Error("Sete lacunas futuras do manuscrito devem permanecer");
 if(!data.criterio?.includes("Acontecimentos, esferas políticas")||
    !data.restricoes?.length||data.restricoes.length<8)
   throw new Error("Limites de inferência histórica ausentes");
 return {titulo:data.titulo,criterio:data.criterio,restricoes:data.restricoes,altera_canon:false,
   papeis_territoriais:data.papeis_territoriais,fases:range,
   eventos:[...events.values()].sort((a,b)=>a.ano_ec-b.ano_ec),
   polos:[...centers.values()],futuros_em_aberto:data.futuros_em_aberto,
   totais:{fases:periods.size,eventos:events.size,polos:centers.size,futuros_em_aberto:future.size,fronteiras_confirmadas:0}};
}
