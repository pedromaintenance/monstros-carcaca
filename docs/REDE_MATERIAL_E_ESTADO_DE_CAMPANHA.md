# Rede material e estado de campanha — Carcaça v0.1

## Escopo deste ciclo

A Carcaça tem povos, criaturas e lugares com recursos e conflitos verificáveis. As condições de vida devem estar vinculadas a evidências materiais e a incertezas explícitas, não a uma tabela que presuma automaticamente como cada espécie come ou se reproduz.

**Importante:** os exemplos abaixo são retirados de `Ambientação - A Carcaça - Visão Geral.txt`, trecho Além Sul. Os movimentos da campanha têm inspiração nas regras de atualização de assentamentos do [Dungeon World SRD](https://www.dungeonworldsrd.com/gamemastering/the-world/); a adaptação informática é autoral.

## Grafo regional da Costa Sul

`data/dependencias_materiais_costa_sul.json` traz relações com IDs estáveis, assentamento, fluxo original, estado da evidência e uma consequência narrativa **hipotética**:

| Relação | Evidência | O que sabemos e o que não sabemos |
| --- | --- | --- |
| Purificação da água em Portomonte | Documentado | Templo de Deméter purifica água; vazão e usos domésticos desconhecidos |
| Agricultura de Portomonte depende dessa purificação | Documentado | Água permite plantio sobre pedra; safras e rendimento desconhecidos |
| Comércio costeiro de Portomonte | Documentado | Centro comercial; bens e parceiros não nomeados |
| Viagens sazonais de tortles e tabaxis | Documentado | Coleta de histórias e recursos; rotas, bens e periodicidade precisos ausentes |
| Incursões ritualizadas associadas à rede de cavernas kuo-toa | Inferido | Captura sacrificial comprovada na região; não sabemos se cada incursão partiu de cavernas ou cidades subaquáticas |

A única relação de dependência **encadeada** neste lote é:

`dependencia:portomonte-purificacao` → `dependencia:portomonte-lavoura`.

**Não existe aresta** entre comércio de Portomonte e rotas sazonais insulares, pois a fonte não afirma essa troca. Tampouco o rito de captura constitui dieta kuo-toa.

Os IDs `recurso:...` nomeiam conceitos para indexação; não são `Resource` mecânicos de DW aprovados nem prova de estoques.

## Como o jogo pode consultar riscos, sem causar crises automáticas

```js
import {createCarcacaAtlas,previewMaterialInterruption} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const deps=await atlas.getMaterialDependencies();
const result=previewMaterialInterruption(deps,"dependencia:portomonte-purificacao");
console.log(result.impactos_potenciais);
```

A função percorre `depende_de_id` na direção dos dependentes; retorna somente **exposição potencial**, com lacunas. Ela não modifica `tags_dw`, nem `dist/carcaca`, nem o estado de uma campanha. Uma interrupção da purificação **não implica automaticamente** fome, morte ou queda populacional.

O arquivo `dist/carcaca/material-dependency-indexes.json` permite consultar por `by_assentamento`, `by_fluxo`, `by_tipo` e `by_dependencia_predecessora`.

## Campanha é outra camada de dados

`schemas/estado-campanha.schema.json` define um registro de sessão que **não é distribuído como fato do atlas**.

Exemplo editorial em `exemplos/campanhas/exemplo-em-branco.json`:
- ID próprio de campanha (`campanha:...`);
- `revisao: 0`;
- `eventos: []`.

`src/carcaca-campaign-state.mjs` expõe três operações puras:

- `createCampaignLedger({id,nome})`: cria um registro vazio.
- `recordCampaignEvent(state,event,{settlementIds,scenarioIds})`: devolve **nova cópia** com evento aprovado pelo mestre; rejeita eventos sem aprovação explícita, IDs não pertencentes ao atlas, IDs de cenário desconhecido e eventos duplicados.
- `getCampaignEvents(state,{assentamentoId})`: retorna cópias isoladas dos eventos, opcionalmente filtradas.

Uma anotação aceita pelo mestre é **fato da campanha**, não da lore geral. `efeitos_adjudicados` armazena descrições textuais das decisões já tomadas; o código não aplica mudanças numéricas de DW.

O código não grava em disco, não chama rede e não cria campanhas reais por conta própria. Cabe a cada jogo decidir se, como e onde persiste esse registro local. Essa separação evita que um caminho narrativo de `Mar de Sangue` altere um save de `Peren` ou um elemento canônico.

## Garantias automáticas

O validador verifica:
1. Todas as dependências apontam para assentamento/fluxo existente e para fontes reconhecidas.
2. Uma dependência não é mais confirmada que seu fluxo; o grafo não possui ciclos.
3. Uma dependência entre processos do mesmo assentamento possui predecessora válida.
4. O exemplo de campanha respeita schema, revisão consistente e referência a assentamentos.
5. Testes JavaScript comprovam que a simulação não modifica o array de dependências e que o histórico original permanece intocado.

## Pendências deliberadas

- **Consumo e dieta:** fontes ainda não especificam alimentação dos povos insulares e kuo-toa.
- **Reprodução, nascimento e migração:** viagens sazonais documentadas não equivalem a migração permanente ou crescimento populacional.
- **Propriedade dos recursos:** templo purificador não fornece automaticamente rótulo `Resource` do Dungeon World ou proprietários formais.
- **Relações entre assentamentos:** não presumir comércio ou juramentos diplomáticos entre Portomonte e as ilhas.
- **Efeitos mecânicos DW:** somente quando uma comunidade for individualizada e seus rótulos forem confirmados por curadoria e pelo mestre.

**Próximo ciclo:** propor modelo de consumo/estoque/pressões ecológicas como campos opcionais com unidade, período e fonte, sem preencher valores não documentados; estudar cenário de migração e abastecimento sem registrar acontecimentos falsos.
