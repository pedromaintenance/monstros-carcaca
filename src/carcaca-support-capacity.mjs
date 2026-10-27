/**
 * Prévia de suporte ecológico, APENAS para cenários hipotéticos.
 * Não atribui taxas de consumo reais, não converte rótulos DW, não muta o cânone.
 */
export const SUPPORT_LIMITS=Object.freeze([
  "agua_potavel","alimentacao","abrigo","residuos"
]);
const DEMOGRAPHIC_KEYS=Object.freeze([
  "residentes","nascimentos","obitos","migracao_entrada","migracao_saida"
]);
const valid=(m,positive=false)=>m && typeof m==="object" &&
  typeof m.valor==="number" && Number.isFinite(m.valor) &&
  (positive?m.valor>0:m.valor>=0) &&
  typeof m.unidade==="string" && m.unidade.trim()!=="" &&
  typeof m.periodo==="string" && m.periodo.trim()!=="" &&
  typeof m.origem_medicao==="string" && m.origem_medicao.trim()!=="";
const base=(p)=>({
  perfil_id:p.id,assentamento_id:p.assentamento_id,
  estado:"simulacao_sem_mutacao",mutacao_canonica:false,
  efeitos_dw_aplicados:[],
  observacao:"Resultado condicional ilustrativo. Qualidade da água, dieta, segurança do abrigo, descarte e premissas devem ser comprovadas em jogo."
});

/**
 * Dimensões: { agua_potavel:{disponibilidade:{valor,unidade,periodo,origem_medicao},
 *   necessidade_por_habitante:{...}, adequacao_confirmada:true, recurso_especificado:"..."},
 * ... }.
 * A mesma unidade e o mesmo período representam oferta e consumo total por pessoa
 * DENTRO de cada dimensão. Não misturar unidades ou intervalos diferentes.
 */
export function previewSupportCapacity(perfil,{dimensoes=null,populacao=null,
                                             premissasExplicitas=false,modo="simulacao"}={}){
  if(!perfil||typeof perfil.id!=="string"||!perfil.id.startsWith("suporte:"))
    throw new TypeError("Perfil de suporte inválido");
  if(modo!=="simulacao")throw new TypeError("Suporte só permite simulação");
  const result=base(perfil);
  if(!premissasExplicitas){
    return {...result,calculavel:false,motivo:"premissas_nao_confirmadas",
            pendentes:[...SUPPORT_LIMITS],capacidade_teorica:null};
  }
  const entries=[];
  const missing=[];
  if(!dimensoes||typeof dimensoes!=="object")
    return {...result,calculavel:false,motivo:"dados_insuficientes",
            pendentes:[...SUPPORT_LIMITS],capacidade_teorica:null};
  for(const id of SUPPORT_LIMITS){
    const d=dimensoes[id];
    if(!d || d.adequacao_confirmada!==true ||
       typeof d.recurso_especificado!=="string"||!d.recurso_especificado.trim()||
       !valid(d.disponibilidade)||!valid(d.necessidade_por_habitante,true)){
      missing.push(id);
    } else entries.push({id,d});
  }
  if(missing.length)
    return {...result,calculavel:false,motivo:"dados_insuficientes",
            pendentes:missing,capacidade_teorica:null};
  const periods=new Set();
  for(const {d} of entries){
    if(d.disponibilidade.unidade!==d.necessidade_por_habitante.unidade ||
       d.disponibilidade.periodo!==d.necessidade_por_habitante.periodo){
      return {...result,calculavel:false,motivo:"unidade_ou_periodo_incompativel",
              pendentes:[],capacidade_teorica:null};
    }
    periods.add(d.disponibilidade.periodo);
  }
  if(periods.size!==1)
    return {...result,calculavel:false,motivo:"periodos_entre_dimensoes_incompativeis",
            pendentes:[],capacidade_teorica:null};
  const capacities=entries.map(({id,d})=>({
    limite:id,capacidade_pessoas:Math.floor(
      d.disponibilidade.valor/d.necessidade_por_habitante.valor)
  }));
  if(capacities.some(x=>!Number.isSafeInteger(x.capacidade_pessoas)||
                         x.capacidade_pessoas<0)){
    return {...result,calculavel:false,motivo:"capacidade_numerica_fora_do_dominio",
            pendentes:[],capacidade_teorica:null};
  }
  const min=Math.min(...capacities.map(x=>x.capacidade_pessoas));
  const bottlenecks=capacities.filter(x=>x.capacidade_pessoas===min).map(x=>x.limite);
  const output={...result,calculavel:true,motivo:null,pendentes:[],
    periodo:[...periods][0],capacidades_parciais:capacities,
    capacidade_teorica:min,limites_restritivos:bottlenecks,
    populacao_comparada:null,excede_capacidade:null};
  if(populacao!==null){
    if(!valid(populacao)||populacao.unidade!=="pessoa"||
       populacao.periodo!==output.periodo||!Number.isSafeInteger(populacao.valor)){
      return {...result,calculavel:false,motivo:"populacao_incompativel",
              pendentes:["populacao_residente"],capacidade_teorica:null};
    }
    output.populacao_comparada=populacao.valor;
    output.excede_capacidade=populacao.valor>min;
  }
  return output;
}

/** Fluxo demográfico hipotético, sem confundir viagens com migração definitiva. */
export function previewPopulationFlow(perfil,{medidas=null,
                                               premissasExplicitas=false}={}){
  if(!perfil||typeof perfil.id!=="string"||!perfil.id.startsWith("suporte:"))
    throw new TypeError("Perfil de suporte inválido");
  const result=base(perfil);
  if(!premissasExplicitas)
    return {...result,calculavel:false,motivo:"premissas_nao_confirmadas",
      faltantes:[...DEMOGRAPHIC_KEYS]};
  const source=medidas??perfil.demografia;
  const faltantes=DEMOGRAPHIC_KEYS.filter(key=>{
    const m=source?.[key];
    return !valid(m)||m.unidade!=="pessoa"||!Number.isSafeInteger(m.valor);
  });
  if(faltantes.length)
    return {...result,calculavel:false,motivo:"dados_insuficientes",faltantes};
  const periodos=new Set(DEMOGRAPHIC_KEYS.map(key=>source[key].periodo));
  if(periodos.size!==1)
    return {...result,calculavel:false,motivo:"periodos_incompativeis",faltantes:[]};
  const m=Object.fromEntries(DEMOGRAPHIC_KEYS.map(k=>[k,source[k].valor]));
  const total=m.residentes+m.nascimentos+m.migracao_entrada -
              m.obitos-m.migracao_saida;
  if(!Number.isSafeInteger(total)||total<0)
    return {...result,calculavel:false,motivo:"populacao_inviavel",faltantes:[]};
  return {...result,calculavel:true,motivo:null,faltantes:[],
    periodo:[...periodos][0],populacao_final_hipotetica:total,
    migracao_liquida:m.migracao_entrada-m.migracao_saida,
    observacao:"Apenas eventos demográficos hipotéticos explicitados; viagens sazonais não equivalem a migração de residência."};
}
