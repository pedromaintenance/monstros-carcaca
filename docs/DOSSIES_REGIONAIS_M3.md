# Dossiês regionais de pressão ecológica e política — M3, ciclo 12

**Data:** 27 de outubro de 2026  
**Estado:** quatro guias factuais curados, combinados em dossiês determinísticos.  
**Fonte principal:** `Ambientação - A Carcaça - Visão Geral.txt`. Referências consolidadas adicionais são extraídas dos registros autorais do repositório, incluindo o `Arquivo dos Mortos Afogados`.

## Princípio central

Os dossiês reúnem **informações já curadas**, não inventam população, rotas, alimentos, ocorrências de ataque ou assentamentos. Cada visão regional possui:

- contextualização e fatos documentados no arquivo de ambientação;
- lacunas materiais e quatro perguntas de investigação;
- IDs dos lugares, assentamentos, criaturas, povos *vinculados aos assentamentos curados*, frentes, redes e recursos já registrados;
- relações territoriais com papéis de **origem** e **destino**, preservando a diferença entre ataque regional e cidade atacada;
- pressões ecológicas listadas apenas sob o nome `pressoes_ecologicas_hipoteticas`, jamais como eventos;
- vínculos a facções apenas por associação de criaturas, **sem afirmar que uma facção governe toda a região**.

Um vetor vazio significa **“nenhum registro curado no escopo”**, não “ninguém mora aqui”. Não utilizar contagens de registros como indicadores de risco, prosperidade, população ou densidade ecológica.

## Retrato do atlas após o ciclo

| Região | Lugares curados | Assentamentos/redes | Criaturas | Frente DW | Pressões hipotéticas | Dinâmicas territoriais relacionadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Caatinga** | 0 | 0 | 0 | 0 | 0 | 2 |
| **Costa Sul** | 3 | 3 | 0 | 0 | 4 | 4 |
| **Eldroth** | 2 | 0 | 0 | 0 | 0 | 1 |
| **Foz do Rio Ancestral** | 3 | 0 | 7 | 1 | 0 | 0 |

**Os números desta tabela são contagens de fichas e vínculos existentes**, não quantidades reais de criaturas, pessoas ou eventos. As sete fichas da foz vêm da curadoria do Arquivo dos Mortos Afogados. A frente possui presságios **propostos**, não ocorrências canônicas automaticamente executadas.

### Caatinga: lacunas de habitação e alimentação

O texto descreve a aridez, a guerra e as incursões sobre pradarias costeiras, além da ausência de colonização feérica **direta**. Ainda não foram cadastrados povoados da Caatinga com localização individual. Sua falta de registros não pode ser interpretada como deserto sem população.

**Investigar depois:** povoados, água e alimentos, material de abrigo, identidade de cada grupo envolvido na guerra e possíveis rotas de deslocamento. Não afirmar que todos os orcs da Caatinga sejam saqueadores.

### Costa Sul: densidade documental material

Possui três conjuntos habitados curados (Portomonte, ilhas tortles/tabaxis, rede de cavernas kuo-toa), cinco dependências, quatro fluxos, quatro pressões **hipotéticas**, perfis de balanço, suporte e infraestrutura. Aqui estão a purificação de água para agricultura, a circulação sazonal e as disputas regionais.

Os quatro vínculos territoriais compreendem ataques rituais internos (um vínculo com papéis de origem **e** destino), relação política no Além Sul, pilhagens procedentes da Caatinga e refugiados que vêm de Eldroth.

**Não presumir:** água doméstica potável, armazéns, dieta, comércio direto entre ilhas e Portomonte, ataque determinado a Portomonte ou acolhimento institucional dos refugiados.

### Eldroth: controle territorial sem dossiê civil individual

A ambientação documenta a Floresta de Eldroth sob influência de Lady Sylara, as ruínas de Vandar e forças de Lord Damaris. Há refugiados provenientes de Eldroth que aparecem minoritariamente nos grandes assentamentos da Costa Sul.

**O que falta:** formas materiais de sobrevivência de grupos resistentes, possíveis moradias civis, produção/consumo, rotas e quantidade de deslocados. O fato de haver ruínas e forças ocupantes não constitui um registro DW de assentamento civil ou uma medição demográfica.

### Foz do Rio Ancestral: bestiário e frentes, não estoques

A área abriga sete fichas de criaturas autorais e uma frente já indexadas, além dos lugares Boca do Abismo, Gualápolis e Arquivo dos Mortos Afogados. Não há aqui fichas materiais de assentamentos, apesar da existência de lugares habitados ou fortificados descritos na ambientação. Esse é um **vazio de modelagem**, não prova de desocupação.

**Investigar depois:** subsistência, abastecimento e continuidade de Gualápolis e da Boca do Abismo; relações materiais da aliança tensa entre habitantes nativos e Ulorian; fronteira entre o que a frente propõe e o que ocorreu nas campanhas.

## Arquitetura e arquivos

Fonte editorial de perguntas: `data/guias_dossies_regionais.json`.  
Contrato de validação: `schemas/guia-dossie-regional.schema.json`.  
Gerador integrado: `scripts/gerar_indices_curadoria.py`.  
Distribuição de leitura:

- `dist/carcaca/regional-dossiers.json` — quatro documentos completos com IDs e estados de evidência;
- `dist/carcaca/regional-dossier-indexes.json` — índices `by_regiao`, `by_dinamica`, `by_lugar`, `by_assentamento`, `by_pergunta_tema`, `by_ausencia_assentamento_curado`.

A visão é **gerada**, não uma cópia manual paralela do inventário. Alterações em criaturas, registros de assentamento ou dinâmicas serão refletidas na próxima geração. Os guias autorais conservam quatro perguntas regionais e as lacunas de cada recorte.

### Consulta ESM

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {reviewRegionalDossier} from "./src/carcaca-regional.mjs";

const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const caatinga=await atlas.getRegionalDossier("dossie-regional:caatinga");
const revisao=reviewRegionalDossier(caatinga);

console.log(revisao.aviso_sem_assentamento_curado); // true
console.log(revisao.nao_significa); // "regiao_desabitada_ou_sem_recursos"

const destinos=await atlas.searchRegionalDossiers({
  dinamicaId:"dinamica:refugiados-eldroth-maiores-assentamentos"
});
// Encontrará Eldroth (origem) e Costa Sul (destino) como regiões relacionadas.
```

O retorno de `reviewRegionalDossier` é um resumo de **cobertura documental**, com cópias independentes de perguntas e vínculos. Ele não calcula índice de ameaça, não aplica movimentos de Dungeon World e não grava fatos em saves.

## Testes e separação canônica

- Validação de um guia por região e unicidade dos IDs de pergunta.
- Testes integrados em Python que importam o gerador real: **4 regiões, 16 perguntas; Caatinga com zero locais curados; Eldroth/Costa Sul com papéis de origem/destino; foz com 7 fichas, 1 frente e nenhum assentamento material; Costa Sul com 3 assentamentos e 5 dependências**.
- Testes JavaScript de leitura, filtro, isolamento das cópias e recusa a interpretar vazio documental como vazio ecológico.
- GitHub Actions revalida e republica snapshots após alterações de código ou de dados, com geração idempotente (`--check`).

As dinâmicas territoriais continuam documentadas em **escala regional**; rótulos de territórios não são automaticamente rótulos DW de assentamentos. Nenhuma das hipóteses foi convertida em ataque ocorrido, perda de população, fome ou alteração dos valores de jogo.

## Próximos pequenos ciclos

O próximo passo mais produtivo é uma **fila de lacunas de curadoria**, ordenada por dependências: sem criar de imediato uma vila na Caatinga, primeiro identificar evidências de água, alimentação, moradia e rotas; na foz, investigar abastecimento antes de inventar números; na Costa Sul, vincular riscos territoriais a comunidades concretas somente quando houver documentação ou decisão de campanha.

O dossiê é uma ferramenta de **pesquisa e preparação do mestre**. Não é um mecanismo de evolução automática da lore.
