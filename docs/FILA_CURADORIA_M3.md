# Fila de lacunas e prioridades de curadoria — M3, ciclo 13

## Objetivo

Converter as **16 perguntas não respondidas** dos quatro dossiês regionais em uma fila consultável e auditável. O ciclo prioriza **oito perguntas** e conserva as outras **oito como aguardando priorização**. Não houve descoberta de fontes adicionais capaz de responder essas perguntas nesta etapa.

**Fonte primária dos fatos já conhecidos:** `Ambientação - A Carcaça - Visão Geral.txt`. Referências de criatura, frente, comunidade e conflito vêm dos JSON de curadoria já existentes no repositório; a fila **não os modifica**.

### Ordenação editorial para iniciar pesquisas

| Ordem | Região | Pergunta | Faixa | Pré-requisito editorial |
| ---: | --- | --- | --- | --- |
| 1 | Caatinga | Identificar abrigos e localidades dos exilados | Primeiro lote | Nenhum |
| 2 | Costa Sul | Verificar se a água purificada de Portomonte serve a mais usos que a agricultura | Primeiro lote | Nenhum |
| 3 | Foz | Identificar fontes de alimento e água para Boca do Abismo / Gualápolis | Primeiro lote | Nenhum |
| 4 | Eldroth | Individualizar um refúgio ou comunidade civil | Primeiro lote | Nenhum |
| 5 | Caatinga | Investigar como uma comunidade identificada se abastece | Segundo lote | Pergunta 1 |
| 6 | Foz | Investigar rotas de provisões efetivamente descritas | Segundo lote | Pergunta 3 |
| 7 | Eldroth | Identificar origem, trajetos e destinos concretos dos deslocados | Segundo lote | Pergunta 4 |
| 8 | Costa Sul | Identificar que assentamentos realmente possuem refugiados de Eldroth | Segundo lote | Pergunta 7 |

A ordem foi **proposta por critério metodológico**, não retirada como hierarquia objetiva da ambientação. Os pré-requisitos são **relações de trabalho editorial**, não prova de que uma situação causou outra na ficção. Exemplo: identificar um povoado da Caatinga antes de atribuir-lhe um manancial **não implica que a região desconheça água ou alimento**.

As demais oito perguntas (conflitos particulares, viagens e moradias costeiras, ocupação de Eldroth, alianças e segurança da foz) continuam no cadastro, com `ordem_editorial:null`, `faixa_prioridade:null`, `estado:"aguarda_priorizacao"`. Não foram apagadas ou tratadas como resolvidas.

## Como uma pergunta poderá ser respondida futuramente

Os itens priorizados contêm `evidencias_necessarias` e `artefatos_potenciais`. São **listas de evidências procuradas** e de tipos de registro que *talvez* possam ser criados após revisão humana. Por exemplo, se a fonte disser onde fica uma comunidade da Caatinga, isso poderá permitir abrir **rascunho** de lugar e assentamento. Ainda será necessário verificar alimentação, habitantes, classificação DW e materialidade antes de fechar a ficha.

O formato não contém tarefas executáveis ou mecanismo de gravação de fatos. Todos os 16 itens gerados têm:

```json
{
  "resposta_confirmada": null,
  "evidencia_nova": null,
  "mutacao_canonica": false,
  "efeitos_dw_automaticos": false
}
```

**Zero evidências novas registradas** neste ciclo não significa ausência de evidência em toda a bibliografia. Significa que **esta fila** não incluiu uma resposta documental revisada para essas perguntas.

## Estrutura técnica

`data/prioridades_curadoria_m3.json` define apenas os oito itens ordenados e suas quatro precedências. O gerador incorpora automaticamente os **16 IDs dos guias** de `data/guias_dossies_regionais.json`, produzindo:

- `dist/carcaca/research-backlog.json`: as 16 perguntas, com seus estados editoriais, a justificativa para cada prioridade, as evidências necessárias e os tipos de artefato potenciais.
- `dist/carcaca/research-backlog-indexes.json`: busca invertida por região, tema, estado, faixa, pergunta predecessora, dossiê e tipo de registro potencial.
- `dist/carcaca/manifest.json`: total de perguntas e total priorizado.

O schema `schemas/prioridade-curadoria.schema.json` exige `autoriza_criacao_canonica:false`, estado `aguarda_nova_fonte` e IDs estáveis. O validador verifica se todas as prioridades apontam para perguntas existentes, se as posições vão de 1 a 8 sem repetições e se **cada pré-requisito vem antes da pergunta dependente**; por isso os quatro vínculos não formam ciclos.

### Como consultar no jogo

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {reviewResearchBacklog} from "./src/carcaca-research.mjs";

const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const fila=await atlas.getResearchBacklog();
const primeiraEtapa=await atlas.searchResearchBacklog({
  faixaPrioridade:"primeiro_lote"
});
const caatinga=await atlas.searchResearchBacklog({regiaoId:"regiao:caatinga"});
const resumo=reviewResearchBacklog(fila);
console.log(resumo.perguntas_respondidas); // 0
```

A função de revisão retorna **cópias** dos dados editoriais e informa quais pesquisas possuem predecessoras. O campo `respondido:false` **não é um sistema de aprovação**. A inclusão de fontes revisadas e a criação de novos registros canônicos requerem uma etapa explícita posterior. A função não usa memória, arquivos de campanha ou automação em segundo plano.

## Como os testes verificam a fila

- **Python sobre o gerador real:** 16 perguntas, oito prioridades, oito aguardando ordenação, duas prioridades por região, quatro precedências ordenadas e nenhum fato confirmado.
- **JavaScript:** filtros regionais e por faixa, consulta por artefato/pré-requisito, inspeção sem mutação, referência desconhecida recusada e preservação das perguntas não priorizadas.
- **GitHub Actions:** validação JSON Schema, teste Node, teste Python integrado, índices determinísticos e publicação `dist/carcaca`.

## Próximo pequeno ciclo

A próxima etapa deve escolher **uma única questão de primeiro lote** para revisão profunda de fontes autorais existentes — recomendação inicial: identificar moradias ou comunidades da Caatinga, ou estudar usos de água no templo de Deméter. Se nenhuma fonte permitir resposta, o resultado correto será **documentar a lacuna** e uma proposta de pergunta ao autor, não inventar aldeias, poços, calorias ou habitantes. A fila continuará disponível para retomar pesquisas sem perder progresso.
