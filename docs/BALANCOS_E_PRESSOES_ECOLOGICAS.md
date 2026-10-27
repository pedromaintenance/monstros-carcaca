# Balanços materiais e pressões ecológicas — Carcaça, contrato v0.1

## Escopo

O M3 avança da **dependência qualitativa** (a lavoura de Portomonte depende da purificação da água) para um **formato que poderá receber medições**. Não cria números retroativos, não define dietas inexistentes e não transforma pressão ecológica hipotética em evento histórico.

Fontes: `Ambientação - A Carcaça - Visão Geral.txt` (seção Além Sul); `data/dependencias_materiais_costa_sul.json` e `data/fluxos_costa_sul.json` (derivações editoriais com proveniência); referência de movimentos de assentamento do [Dungeon World SRD](https://www.dungeonworldsrd.com/gamemastering/the-world/). A fórmula de balanço abaixo é **proposta técnica da Carcaça**, não uma regra do DW.

## Quatro perfis de medição

| Perfil | O que a fonte permite afirmar | O que **não** está quantificado |
| --- | --- | --- |
| `balanco:portomonte-agua-purificada` | O templo de Deméter purifica água do Mar de Sangue | Volume, vazão, uso doméstico, capacidade do ritual, perdas |
| `balanco:portomonte-producao-agricola` | Agricultura em Portomonte, inclusive sobre pedra, depende dessa purificação | Espécies plantadas, safra, produtividade, consumo, estoque |
| `balanco:portomonte-mercadorias-nao-identificadas` | Há comércio costeiro | Identidade dos bens, rotas, mercado, volumes; **proibido somar mercadorias diversas num estoque** |
| `balanco:ilhas-recursos-coletados` | Tortles e tabaxis viajam sazonalmente em busca de histórias e recursos | Meses exatos, itinerários, tipo e quantidade de recursos; **histórias não são toneladas de um produto** |

Cada perfil possui exatamente sete medições opcionais: `estoque_inicial`, `producao`, `entradas`, `consumo`, `saidas`, `perdas` e `estoque_final`. Cada medição contém `valor`, `unidade`, `periodo` e `origem_medicao`, todos **nulos** na curadoria atual.

As `unidades_possiveis` são **opções técnicas para futuras medições**, não medições declaradas. Uma unidade escolhida para um recurso não pode ser trocada automaticamente por unidade de outro recurso. Só é permitido registrar um valor numérico quando unidade, período e origem também são explícitos. **Zero é diferente de desconhecido.**

`status:nao_quantificado` exige que nenhuma medição contenha número. `sazonalidade:nao_documentada` e `sazonalidade:sazonal_documentada` exigem `periodos_conhecidos:null` e `janela_duracao:null`, porque sazonalidade do deslocamento insular não prova quais meses o originam.

## Equação apenas para simulação

Para um produto **identificado e homogêneo**, uma unidade consistente e um mesmo período:

```
saldo_teorico = estoque_inicial + producao + entradas
                - consumo - saidas - perdas
```

Em linguagem natural: o saldo teórico é o estoque inicial somado ao que se produziu e recebeu, menos o que foi consumido, enviado para fora e perdido, tudo da **mesma mercadoria, unidade e período**. Esta equação é lógica de controle de materiais do atlas, **não** substitui movimentos oficiais do DW.

O saldo é apenas uma projeção condicionada aos números que o usuário explicitamente forneceu. Se ficar negativo, `deficit_teorico` exibe seu valor absoluto, enquanto `estoque_final_nao_negativo` tem mínimo zero; isso **não** prova necessidade humana, fome nem baixa de População DW.

### API de prévia segura

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {previewMaterialBalance,BALANCE_FIELDS} from "./src/carcaca-material-balance.mjs";
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const perfil=(await atlas.searchMaterialBalances({tipoRecurso:"agua_transformada"}))[0];

// Como a fonte não apresenta medições, isto retorna dados insuficientes:
console.log(previewMaterialBalance(perfil).motivo); // "dados_insuficientes"

// Exemplo puramente aritmético e FICTÍCIO, não ocorre na Carcaça.
const m=Object.fromEntries(BALANCE_FIELDS.map((k,i)=>[k,{
  valor:[100,30,0,70,10,5][i],
  unidade:"litro",
  periodo:"periodo-hipotetico-1",
  origem_medicao:"exemplo_ficticio"
}]));
const previa=previewMaterialBalance(perfil,{medidas:m});
console.log(previa.saldo_teorico); // 45 litros fictícios
```

Os valores deste bloco servem exclusivamente para demonstrar o algoritmo. Nenhuma variável de produção, consumo ou estoque na lore recebeu esses números. A função não persiste saves, não chama rede, não altera perfis, rótulos, movimentos DW ou jogos.

**Restrições:** o motor se recusa a calcular se faltar qualquer uma das seis parcelas (mesmo se a resposta intuitiva fosse zero), se unidade ou período divergirem, ou se a categoria for mercadoria/coleta não identificada. A medição `estoque_final` da fonte não entra na equação: seu papel posterior será comparar saldo medido com saldo projetado, após revisão de critérios.

## Quatro pressões ecológicas (hipóteses)

`data/pressoes_ecologicas_costa_sul.json` reúne quatro perguntas ao mestre, nunca fatos ocorridos:

1. **Interrupção da purificação** e vulnerabilidade da lavoura de Portomonte.
2. **Bloqueio comercial** de rota e mercadoria ainda não identificadas.
3. **Interrupção de viagens sazonais**, com consequências materiais ainda desconhecidas nas ilhas.
4. **Incursões rituais regionais** que podem afetar comunidades específicas em mesa; ataques regionais são documentados, mas origem da força atribuída à rede de cavernas continua inferida.

Todos possuem `estado:risco_hipotetico_nao_ocorrido`, `evento_campanha_id:null` e `efeito_dw_automatico:false`. Mesmo que uma situação se materialize numa campanha, a decisão e o registro devem ocorrer no **estado local**, usando o livro-razão do ciclo 7.

## Estrutura técnica e verificações

- Arquivos de origem: `data/balancos_materiais_costa_sul.json` e `data/pressoes_ecologicas_costa_sul.json`.
- Esquemas: `schemas/balanco-material.schema.json` e `schemas/pressao-ecologica.schema.json`.
- Distribuição: `dist/carcaca/material-balances.json`, `material-balance-indexes.json`, `ecological-pressures.json`, `ecological-pressure-indexes.json`.
- Cliente: `getMaterialBalances()`, `searchMaterialBalances()`, `getEcologicalPressures()`, `searchEcologicalPressures()` e funções de índice.
- Testes: referências cruzadas, status sem quantificação, conservação dos meses desconhecidos, cenário aritmético fictício, período/unidade compatíveis, ausência de efeitos automáticos.

## Próximo ciclo

Incluir critérios de **capacidade de suporte** como perguntas e dados opcionais (água para população, capacidade agrícola, migração/ocupação, conservação de estoques, impactos de resíduos). Não calcular população sustentável sem dieta, quantidade disponível, unidade, periodicidade e método. Reavaliar a curadoria regional com o autor antes de conferir valores a povoamentos e grupos.
