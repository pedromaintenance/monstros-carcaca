# Dinâmicas territoriais — guerras e deslocamentos no Além Sul (ciclo 11)

## Fontes, escala e método

Fonte primária: `Ambientação - A Carcaça - Visão Geral.txt`, seção **"O ALÉM SUL"**, especialmente os trechos sobre as terras da Caatinga, as pradarias cultivadas, os ataques kuo-toa/abissais, os povos insulares e refugiados de Eldroth.

**Regra editorial:** o autor pode descrever uma guerra ou migração **regional** sem ter estabelecido **quais cidades ou ilhas foram atacadas, quando ou por quem**. O atlas deve preservar essa escala. Nem uma pilhagem da Caatinga nem a presença de refugiados em centros maiores tornam automaticamente Portomonte um alvo ou abrigo.

A `regiao:caatinga` foi acrescentada em `data/regioes_carcaca.json` como o **quarto recorte geográfico** do atlas. Sua lista `lugares:[]` é intencional: o texto descreve terras áridas e exilados, **não identifica uma cidade individual** nesse trecho. A fronteira exata entre Caatinga e Costa Sul não foi desenhada.

### Quatro fatos regionais curados

| ID | Fato documentado | O que NÃO podemos concluir |
| --- | --- | --- |
| `dinamica:pilhagens-caatinga-pradarias` | Há guerras contínuas; exilados das terras áridas pilham áreas cultivadas próximas ao Mar de Sangue | Que Portomonte sofreu um saque específico; que todos os orcs sejam saqueadores; datas, colheitas ou vítimas |
| `dinamica:ataques-liturgicos-costa-ilhas` | Kuo-toa e abissais marinhos atacam costa e ilhas em busca de vítimas para sacrifício | Que se alimentem dessas vítimas ou que toda expedição parta das cavernas cadastradas |
| `dinamica:refugiados-eldroth-maiores-assentamentos` | Existem **alguns** refugiados de Eldroth nos **maiores assentamentos da Costa Sul** e são minoria | Que todos estejam em Portomonte, ou que a fonte forneça contagem, volume e datas do deslocamento |
| `dinamica:nao-ocupacao-direta-alem-sul` | O Além Sul não sofre a mesma ocupação territorial **direta** shadow fey presente em outras regiões | Que seja pacífico, neutro ou imune a pressões indiretas da Corte |

**Distinção cosmológica:** os **abissais marinhos** da Costa Sul não devem ser renomeados como demônios do Abismo infernal. `Kuo-Toa` é um povo; a fonte descreve ações de grupos envolvidos em ataques, não um julgamento uniforme sobre cada indivíduo.

## Rótulos territoriais da Carcaça

Adicionei `data/rotulos_territoriais_carcaca.json` com quatro rótulos **independentes** dos rótulos de comunidade DW e dos 14 rótulos próprios de assentamentos existentes:

- `fronteira_de_pilhagens`: ameaça material sobre terras cultivadas nas relações Caatinga–Costa Sul.
- `liturgia_de_captura`: risco de captura ritual, não a simples pilhagem de estoques.
- `acolhida_minoria_deslocada`: destino regional de refugiados de Eldroth, sem identificação de cidade receptora.
- `ausencia_de_ocupacao_feerica_direta`: relativa autonomia frente à colonização territorial direta, sem ignorar guerra local.

Esses rótulos são **territoriais**. Não basta encontrar um atributo numa região para concedê-lo a uma `steading` individual. Nenhum deles modifica Prosperidade, População ou Defesas do Dungeon World.

## Possíveis consequências sem acontecimentos inventados

`data/dinamicas_territoriais_alem_sul.json` guarda o fato regional, os grupos mencionados, uma lista de **dimensões possivelmente afetadas**, lacunas e perguntas ao mestre. O campo `possibilidade_narrativa` é deliberadamente **hipotético**, e não um relato de sessão.

- **Pilhagens → agricultura e acesso à terra:** podem afetar uma safra se o mestre individualizar a pradaria atingida. A fonte não vincula esse evento à lavoura de Portomonte.
- **Captura ritual → mobilidade e proteção de habitantes:** uma campanha pode identificar qual ilha foi atacada. O objetivo sacrificial não permite inventar economia alimentar.
- **Refugiados → abrigo, abastecimento e convivência:** só após escolher e justificar um destino concreto em campanha podem ser adicionados habitantes a um save. Não alterar retrospectivamente as quantidades nulas do atlas.
- **Ausência de ocupação direta → governança local:** conflitos não feéricos podem ser decisivos. Não se deve atribuir automaticamente taxas, vassalagem ou uma guarnição feérica a um núcleo costeiro.

Todos os quatro registros usam `escala:"regional"`, `assentamento_origem_id:null`, `assentamento_alvo_id:null`, `evento_campanha_id:null` e `efeitos_dw_automaticos:false`.

## Esquema, validadores e consumo por jogos

- Dados: `data/dinamicas_territoriais_alem_sul.json`, `data/rotulos_territoriais_carcaca.json`.
- Regiões: `data/regioes_carcaca.json`, agora com a Caatinga além da foz, Costa Sul e Eldroth.
- Schema: `schemas/dinamica-territorial.schema.json`.
- Validador: referências a região, fonte e rótulo; exigência de ausência de IDs de assentamento quando a dinâmica for regional; nenhuma mutação canônica.
- Distribuição: `dist/carcaca/territorial-dynamics.json`, `territorial-labels.json` e `territorial-indexes.json`. Índices por região de origem/destino, tipo, rótulo, dimensão afetada e alvo individual se futuramente houver evidência.
- Cliente ESM: `getTerritorialDynamics()`, `getTerritorialDynamic(id)`, `getTerritorialLabels()`, `getTerritorialIndexes()` e `searchTerritorialDynamics({origemRegiaoId,destinoRegiaoId,rotuloId,tipo,dimensao})`.

### Prévia de relação territorial

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {previewTerritorialImpact} from "./src/carcaca-territorial.mjs";
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const [saque]=await atlas.searchTerritorialDynamics({tipo:"incursao_de_pilhagem"});
const hipotese=previewTerritorialImpact(saque,{assentamentoId:"assentamento:portomonte"});

console.log(hipotese.somente_evidencia_regional); // true
console.log(hipotese.evento_especifico_confirmado); // false
console.log(hipotese.atribuicao_automatica_bloqueada); // true
```

A função é **pura** e retorna perguntas, lacunas e consequências narrativas propostas. A chamada acima não cria um ataque a Portomonte; este nome é apenas uma consulta para demonstrar que a atribuição local é **bloqueada**.

## Próximo ciclo

1. Investigar **povos e comunidades da Caatinga** somente quando houver fonte que especifique onde vivem e como se sustentam.
2. Criar um **dossiê de pressão territorial** por região, cruzando suporte, infraestrutura, ameaças e fluxos, sem somar números ausentes.
3. Modelar conflitos no **estado local de campanha** apenas depois que um mestre confirmar o alvo e o acontecimento.
4. Considerar uma frente de campanha sobre as guerras do Além Sul **como proposta editorial**, nunca como sequência de eventos que já ocorreram.

Referências: fonte autoral `Ambientação - A Carcaça - Visão Geral.txt`; `docs/ECOLOGIA_DOS_ASSENTAMENTOS.md` e `docs/REDE_MATERIAL_E_ESTADO_DE_CAMPANHA.md`. Os movimentos de Dungeon World continuam mecânicas separadas e não foram disparados aqui.

**Refinamento editorial:** a presença regional de refugiados não confirma acolhimento formal; mesmo quando um alvo passar a ser nomeado, a prévia territorial mantém `evento_especifico_confirmado:false` até que um save local registre explicitamente o acontecimento. O campo `alvo_nomeado_no_registro` não substitui a confirmação de sessão.
