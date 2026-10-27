/**
 * Motor de prévia de balanço material da Carcaça.
 * Nunca estima números ausentes, nunca atualiza o catálogo ou uma campanha.
 *
 * estoque_final_teorico = estoque_inicial + producao + entradas
 *                          - consumo - saidas - perdas
 * Valores de teste representam um cenário criado pelo mestre, NÃO lore canônica.
 */
export const BALANCE_FIELDS=Object.freeze([
  "estoque_inicial","producao","entradas","consumo","saidas","perdas"
]);
const unknownTypes=new Set(["mercadoria_nao_identificada","coleta_nao_especificada"]);
const isValue=(v)=>typeof v==="number"&&Number.isFinite(v)&&v>=0;
function validMeasure(m){
  return m&&isValue(m.valor)&&typeof m.unidade==="string"&&m.unidade.trim()!==""&&
    typeof m.periodo==="string"&&m.periodo.trim()!==""&&
    typeof m.origem_medicao==="string"&&m.origem_medicao.trim()!=="";
}
export function previewMaterialBalance(profile,{medidas=null,modo="simulacao"}={}){
  if(!profile||typeof profile!=="object"||!profile.id?.startsWith("balanco:")){
    throw new TypeError("Perfil de balanço inválido");
  }
  if(modo!=="simulacao")throw new TypeError("Balanço só permite prévia em modo simulação");
  const base={id:profile.id,assentamento_id:profile.assentamento_id,
              estado:"simulacao_sem_mutacao",mutacao_canonica:false,
              efeitos_dw_aplicados:[]};
  if(!profile.recurso_id||unknownTypes.has(profile.tipo_recurso)){
    return {...base,calculavel:false,motivo:"recurso_nao_identificado",
      faltantes:["recurso_homogeneo_identificado"],
      observacao:"Não somar mercadorias ou recursos diversos em um saldo."};
  }
  const source=medidas===null?profile.medidas:medidas;
  if(!source||typeof source!=="object")throw new TypeError("Medidas inválidas");
  const faltantes=BALANCE_FIELDS.filter(field=>!validMeasure(source[field]));
  if(faltantes.length)return {...base,calculavel:false,motivo:"dados_insuficientes",
    faltantes,observacao:"Zero só conta como medida se registrado explicitamente com unidade, período e origem."};
  const samples=BALANCE_FIELDS.map(field=>source[field]);
  const unidade=samples[0].unidade,periodo=samples[0].periodo;
  if(samples.some(sample=>sample.unidade!==unidade||sample.periodo!==periodo)){
    return {...base,calculavel:false,motivo:"unidade_ou_periodo_incompativel",
      faltantes:[],observacao:"Não comparar água em litros com alimento em kg, nem períodos distintos."};
  }
  const [inicial,producao,entradas,consumo,saidas,perdas]=samples.map(m=>m.valor);
  const total=inicial+producao+entradas-consumo-saidas-perdas;
  if(!Number.isFinite(total))throw new RangeError("Saldo numérico fora do domínio representável");
  return {...base,calculavel:true,motivo:null,unidade,periodo,
    saldo_teorico:total,
    estoque_final_nao_negativo:Math.max(0,total),
    deficit_teorico:Math.max(0,-total),
    faltantes:[],
    observacao:"Resultado aritmético de um exemplo hipotético, não é medição de Carcaça nem gatilho automático DW."};
}
