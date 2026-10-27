# Capacidade de suporte — ecologia dos assentamentos da Carcaça (v0.1)

## Objetivo

O M3 agora pode registrar os limites materiais que sustentam uma comunidade, **sem atribuir números nem taxas de sobrevivência inexistentes à lore**. Esta camada responde *que informações faltam* antes de qualquer cálculo.

**Fonte primária:** `Ambientação - A Carcaça - Visão Geral.txt`, seção "O Além Sul". A fonte afirma que Portomonte possui um templo de Deméter que purifica a água do Mar de Sangue e viabiliza lavouras; que existem comunidades insulares tortles/tabaxis com viagens sazonais; que kuo-toa habitam cavernas e cidades subaquáticas. **Não apresenta** volumes, consumo per capita, produção alimentar total, alimentação específica, potabilidade para humanos, densidade habitacional, saneamento, contagem de residentes, fertilidade nem taxas de migração. O registro não os substitui por estimativas.

## Os três perfis e seus limites

`data/capacidade_suporte_costa_sul.json` contém um perfil para cada entidade de habitação curada:

| Perfil | Natureza editorial | Cuidados essenciais |
| --- | --- | --- |
| Portomonte | Assentamento civil | Água purificada **para lavoura** não prova potabilidade doméstica; agricultura não equivale a nutrição suficiente |
| Comunidades insulares tortles/tabaxis | Conjunto de comunidades | Não é uma única ilha; visitas sazonais **não** são migração ou mudança de residência |
| Rede de cavernas kuo-toa | Conjunto de abrigos | Cavernas e cidades subaquáticas não são um único núcleo demográfico; incursões rituais não são alimentação |

Cada perfil lista quatro fatores restritivos, distintos:

1. **Água potável** — fonte segura, volume disponível e consumo individual no mesmo período.
2. **Alimentação** — alimento nutritivamente adequado, disponibilidade e necessidade individual equivalente, não apenas quilos de produtos diversos.
3. **Abrigo** — espaço habitável e demanda por residente; não contar uma caverna inteira como número de vagas sem conhecer sua organização.
4. **Resíduos** — capacidade de processar/destinar resíduos e geração individual; não confundir existência de mar ou floresta com capacidade infinita de absorção.

Os quatro limites são **categorias de investigação**, não quatro recursos confirmados. Todos os valores quantitativos de `disponibilidade` e `necessidade_por_habitante` no cânone estão `null`. A identidade dos recursos também permanece `null`, exceto onde uma futura fonte puder especificá-los.

O perfil demográfico mantém separadamente `residentes`, `nascimentos`, `obitos`, `migracao_entrada` e `migracao_saida`. Todos possuem `valor`, `unidade`, `periodo` e `origem_medicao`, atualmente nulos. Os deslocamentos sazonais insulares aparecem como característica cultural, **nunca** como migrantes permanentes inferidos.

## Condição para uma simulação matemática

A biblioteca `src/carcaca-support-capacity.mjs` exige que o mestre declare `premissasExplicitas:true`, identifique **qual é o recurso** em cada dimensão e confirme sua adequação à função pretendida (`adequacao_confirmada:true`). Isso é uma confirmação de hipótese inserida no simulador, **não revisão nem aprovação canônica**.

Para cada dimensão, o mestre informa duas medições do mesmo recurso e intervalo:

- disponibilidade total em um período;
- necessidade **por habitante** no mesmo período.

Ambas exigem `valor`, `unidade`, `periodo` e `origem_medicao`. Não se permitem demandas nulas, unidades diferentes ou períodos incompatíveis — nem sequer entre as quatro dimensões. Recurso inadequado, dieta não definida, água não potável ou resíduo de composição desconhecida demandam pesquisa adicional.

O cálculo técnico ilustrativo é:

```
capacidade_teorica_por_limite = piso(disponibilidade / necessidade_por_habitante)
capacidade_global_teorica = minimo(das quatro capacidades)
```

Em linguagem natural: cada dimensão permite, na hipótese especificada, sustentar até determinado número de residentes; a menor capacidade restringe o resultado. **Isso não é regra oficial de Dungeon World, nem validação de que uma população sobreviveria de fato.** O modelo ignora muitos fatores de vida social e ecológica que deverão ser estudados separadamente. O cálculo não altera os rótulos DW de Prosperidade, População ou Defesas.

**Exemplo estritamente FICTÍCIO, usado apenas em testes:** água hipotética com capacidade para 500 pessoas, alimentos para 200, abrigo para 250 e tratamento de resíduos para 200 produz um teto aritmético de 200. Nenhum desses números pertence a Portomonte ou às comunidades da Carcaça.

## API de leitura e simulações

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {previewSupportCapacity,previewPopulationFlow} from "./src/carcaca-support-capacity.mjs";

const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const perfil=await atlas.getSupportProfile("suporte:portomonte");
const avaliacao=previewSupportCapacity(perfil);

// Como todos os valores da fonte são desconhecidos:
// avaliacao.calculavel === false
// avaliacao.motivo === "premissas_nao_confirmadas"

const historico=previewPopulationFlow(perfil,{premissasExplicitas:true});
// historico.calculavel === false; taxas e residentes permanecem ausentes
```

O método `previewSupportCapacity(perfil,{dimensoes,populacao,premissasExplicitas:true})` exige que os dados fictícios sejam fornecidos por completo. O campo de comparação `populacao` é opcional e só é aceito com `unidade:"pessoa"`, período idêntico e fonte declarada. Na ausência de contagem real, a capacidade não autoriza deduzir o tamanho da comunidade.

O método `previewPopulationFlow(perfil,{medidas,premissasExplicitas:true})` aplica:

```
populacao_final_hipotetica = residentes + nascimentos + migracao_entrada
                             - obitos - migracao_saida
```

Em linguagem natural: a população final projetada é a população residente inicial, acrescida de nascimentos e entradas migratórias permanentes, e reduzida por óbitos e saídas migratórias permanentes. Exige todas as medições em **pessoas** no mesmo período, com origens declaradas, e rejeita populações negativas. Passagens sazonais não entram automaticamente na equação.

Ambos os métodos são funções **puras, sem gravação e sem efeitos sobre cânone ou saves**. Resultados têm `estado:"simulacao_sem_mutacao"` e `efeitos_dw_aplicados:[]`.

## Contratos técnicos e integridade

- Fonte editorial: `data/capacidade_suporte_costa_sul.json`.
- Validação JSON Schema: `schemas/capacidade-suporte.schema.json`.
- Distribuição: `dist/carcaca/support-profiles.json` e `support-indexes.json`.
- Cliente: `getSupportProfiles`, `getSupportProfile`, `getSupportIndexes`, `searchSupportProfiles`.
- Funções puras: `previewSupportCapacity` e `previewPopulationFlow`.
- Verificação: perfis referenciam assentamentos existentes, natureza correta, limites únicos e todos desconhecidos enquanto `estado:"sem_capacidade_quantificavel"`.
- Testes JS: não calcular dados nulos, verificar fonte/unidade/período/adequação, detectar limites restritivos fictícios, conservar documentos originais, exigir contagens demográficas explícitas e impedir valores negativos.

## Lacunas e continuidade

Este ciclo **não** resolveu dietas, identificação de rios potáveis, armazenamento de alimento, saneamento real ou taxas de reprodução. Apenas tornou essas lacunas consultáveis e impediu que sejam preenchidas implicitamente.

**Próximo lote:** aprofundar a ecologia de armazenamento e descarte, materiais de abrigo e dependências territoriais; identificar fontes primárias adicionais antes de transformar um conjunto regional numa vila DW concreta. Eventos ocorridos numa mesa devem continuar separados em `src/carcaca-campaign-state.mjs`.

**Referência mecânica:** [Dungeon World SRD — The World](https://www.dungeonworldsrd.com/gamemastering/the-world/) para a filosofia de assentamentos; a modelagem matemática de capacidade é uma extensão **própria da Carcaça**, não uma regra do SRD.
