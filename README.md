# Monstros da Carcaça

Banco de criaturas compartilhado pelos jogos ambientados na **Carcaça**.

**O projeto tem duas camadas independentes:** um acervo importado de fichas licenciadas de D&D e similares (`dist/`) e uma **curadoria autoral** (`curadoria/`) que dá às criaturas identidade, ecologia, regiões e movimentos inspirados em Dungeon World.

## Comece por aqui

- [ROADMAP.md](ROADMAP.md) — milestones e critérios de aceite, execução em lotes pequenos.
- [docs/ONTOLOGIA_E_DUNGEON_WORLD.md](docs/ONTOLOGIA_E_DUNGEON_WORLD.md) — tipos de criatura, instintos, frentes e assentamentos.
- [data/taxonomia_carcaca.json](data/taxonomia_carcaca.json) — Tipo de Criatura da Carcaça, separado da referência D&D.
- [data/regioes_carcaca.json](data/regioes_carcaca.json), [data/lugares_carcaca.json](data/lugares_carcaca.json) e [data/faccoes_carcaca.json](data/faccoes_carcaca.json) — vocabulários de geografia e relações.
- [curadoria/criaturas/arquivo-dos-mortos-afogados.json](curadoria/criaturas/arquivo-dos-mortos-afogados.json) — 2 pilotos (Jorō e Gharoz).
- [curadoria/frentes/disputa-pela-lanca.json](curadoria/frentes/disputa-pela-lanca.json) — frente de Dungeon World **proposta**, não fatos já ocorridos.
- [curadoria/assentamentos/portomonte.json](curadoria/assentamentos/portomonte.json) — assentamento piloto com campos desconhecidos nulos.
- [docs/FONTES_E_LICENCAS.md](docs/FONTES_E_LICENCAS.md) e [docs/CURADORIA_E_LICENCAS.md](docs/CURADORIA_E_LICENCAS.md) — licença, atribuição e política de conteúdo.

## Consumo pelos jogos

As fichas importadas estão em `dist/manifest.json`, `dist/catalog.json` e `dist/creatures/`.
O cliente existente é `src/client.mjs` (ESM), com `createBestiary`, `toPerenDraft`, `getGameData` e `getPerenLinks`.

A curadoria de Dungeon World ainda não substitui nem altera automaticamente os 222 monstros jogáveis de Peren. Sua futura integração será uma etapa do roadmap.

## Qualidade

```bash
python -m pip install 'jsonschema>=4,<5'
python scripts/validar_curadoria.py
python scripts/sincronizar.py  # opcional; depende de rede, atualiza somente dist/
python scripts/validar.py
```

As duas pipelines são separadas: a importação das fontes não deve apagar ou alterar a curadoria manual.

## Atlas curado — acesso para jogos

O conteúdo adaptado à Carcaça é publicado automaticamente em `dist/carcaca/`, com JSON independente das fontes D&D. O código consumidor é `src/carcaca-client.mjs`:

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas = createCarcacaAtlas({
  baseUrl: "https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const habitantes = await atlas.search({tipoCarcaca:"yokai",regiaoId:"regiao:foz-rio-ancestral"});
const ficha = await atlas.get(habitantes[0].id);
console.log(ficha.dungeon_world.instinto);
```

Para reconstruir ou conferir os índices:

```bash
python scripts/gerar_indices_curadoria.py
python scripts/gerar_indices_curadoria.py --check
node --test tests/carcaca-client.test.mjs
```

Os movimentos de DW da curadoria são adaptações ficcionais; mecânicas de DW ainda não foram balanceadas. Veja [documentação de consulta](docs/CONSULTA_CURADORIA.md) e [diário de bordo](docs/DIARIO_DE_BORDO.md).

## Ecossistema de assentamentos (M3, ciclo 5)

Além de monstros, há comunidades, redes de cavernas, refúgios e habitats de várias formas. **Nem todo covil é uma steading do Dungeon World:** a distinção é preservada.

- `data/rotulos_assentamentos_carcaca.json`: 12 rótulos especiais da Carcaça, independentes das tags DW.
- `data/povos_carcaca.json`: dois grupos regionais sem universalizar costumes.
- `data/fluxos_costa_sul.json`: água, produção, trocas e incursões com proveniência.
- `curadoria/assentamentos/`: Portomonte e a rede de cavernas habitadas por Kuo-Toa.
- `schemas/assentamento-carcaca.schema.json`: esquema do assentamento ecológico.
- `docs/ECOLOGIA_DOS_ASSENTAMENTOS.md`: conceito, exemplos e limitações.

A camada distribuída em `dist/carcaca/` agora inclui `settlement-labels.json`, `settlement-indexes.json`, `peoples.json` e `flows.json`. O cliente ESM fornece `searchSettlements`, `getSettlement`, `getFlows` e outros métodos.

Alimentação, água potável, população ou reprodução **não são presumidas** quando os textos não as descrevem.

## Ilhas e cenários DW — Ciclo 6

- `curadoria/assentamentos/comunidades-insulares-costa-sul.json`: tortles e tabaxis como conjunto regional **não individualizado**.
- `cenarios/assentamentos/costa-sul.json`: quatro hipóteses `Want`, `Trade`, `Capture` e `Aid` sem aplicação automática.
- `dist/carcaca/settlement-scenarios.json`: cenários distribuídos em JSON com `mutacao_canonica=false`.
- `src/carcaca-client.mjs`: `getSettlementScenarios`, `getSettlementScenario`, `searchSettlementScenarios` e `previewSettlementScenario`.

Consulte [o guia das comunidades insulares e cenários](docs/COMUNIDADES_INSULARES_E_CENARIOS.md). O marco M3 permanece em expansão. Não há cidades individuais inventadas, juramentos confirmados ou atualização do estado de campanha.

## Ciclo 7 — Cadeia material e história local de campanha

O atlas apresenta um grafo auditável de dependências materiais da Costa Sul em `data/dependencias_materiais_costa_sul.json`, distribuído como `dist/carcaca/material-dependencies.json`, com índices invertidos próprios.

`src/carcaca-client.mjs` oferece `getMaterialDependencies`, `searchMaterialDependencies`, `getMaterialDependencyIndexes` e a função pura `previewMaterialInterruption`.

Um **estado de campanha é um documento diferente do cânone**: `src/carcaca-campaign-state.mjs` fornece `createCampaignLedger`, `recordCampaignEvent` e `getCampaignEvents`, sem I/O. O exemplo vazio em `exemplos/campanhas/` demonstra o contrato, não é uma campanha canônica.

Veja [Grafo material e eventos de campanha](docs/REDE_MATERIAL_E_ESTADO_DE_CAMPANHA.md).

## Ciclo 8 — Balanços materiais sem inventar valores

A camada de economia material distribui `material-balances.json`, `material-balance-indexes.json`, `ecological-pressures.json` e `ecological-pressure-indexes.json` pelo manifesto do atlas.

Todos os perfis reais começam **não quantificados** (`valor:null`, `unidade:null`, `periodo:null`, `origem_medicao:null`). Há sazonalidade documentada para as viagens insulares, mas **não** meses especificados. Nenhum evento ambiental hipotético é aplicado à lore.

O método `previewMaterialBalance` está em `src/carcaca-material-balance.mjs`; é somente leitura e exige entradas completas, produto homogêneo, mesma unidade e mesmo período. Veja [Balanços e pressões ecológicas](docs/BALANCOS_E_PRESSOES_ECOLOGICAS.md).

## M3 — Ciclo 9: capacidade de suporte ecológico

O atlas adiciona **três perfis regionais de suporte**, quatro limites por perfil (água potável, alimentação, abrigo e resíduos) e campos explícitos de continuidade demográfica. **Todos os números canônicos permanecem nulos.**

Arquivos: `data/capacidade_suporte_costa_sul.json`, `schemas/capacidade-suporte.schema.json`, `dist/carcaca/support-profiles.json` e `support-indexes.json`.

`src/carcaca-support-capacity.mjs` fornece `previewSupportCapacity` e `previewPopulationFlow`, ambos somente leitura e condicionados a premissas e medições fornecidas conscientemente pelo mestre. **Não inferir que água purificada para a lavoura seja potável nem confundir viagem sazonal com migração.**

Leia [Capacidade de suporte e demografia](docs/CAPACIDADE_DE_SUPORTE.md).

## Ciclo 10 — Infraestrutura material com evidência

O atlas apresenta `data/infraestrutura_assentamentos_costa_sul.json` e distribui `infrastructure-profiles.json` e `infrastructure-indexes.json`. Os três perfis abrangem construção e abrigo, armazenamento, saneamento e acessos, com âncoras factuais e perguntas abertas. **Penhascos não são casas de pedra; comércio não é prova de celeiro; purificação para plantio não demonstra esgoto nem potabilidade.**

O cliente `src/carcaca-client.mjs` inclui `getInfrastructureProfiles`, `getInfrastructureProfile`, `getInfrastructureIndexes` e `searchInfrastructureProfiles`. A biblioteca `src/carcaca-infrastructure.mjs` permite auditoria e prévias sem alterar dados.

Leia `docs/INFRAESTRUTURA_DOS_ASSENTAMENTOS.md`.

## M3, ciclo 11 — Caatinga e dinâmicas de guerra

O atlas acrescenta `regiao:caatinga`, sem inventar assentamentos nem fronteiras precisas. `data/dinamicas_territoriais_alem_sul.json` descreve quatro fatos regionais: pilhagens entre Caatinga e pradarias costeiras, capturas sacrificiais no litoral e nas ilhas, presença minoritária de refugiados de Eldroth em grandes assentamentos ainda não nomeados e ausência de colonização feérica direta no Além Sul.

`data/rotulos_territoriais_carcaca.json` contém quatro **rótulos regionais**, independentes dos 14 rótulos de assentamento. Os dados são publicados em `dist/carcaca/territorial-*.json`; `src/carcaca-territorial.mjs` não permite converter ameaça regional em ataque canônico a Portomonte. Consulte [Dinâmicas Territoriais do Além Sul](docs/DINAMICAS_TERRITORIAIS_ALEM_SUL.md).

## M3 — Ciclo 12: dossiês regionais

O atlas possui `dist/carcaca/regional-dossiers.json`, uma visão consolidada de **quatro regiões com 16 perguntas materiais e políticas**. Os dossiês incluem os registros curados por referência, sem duplicar novas fichas: localidades, assentamentos, criaturas, frentes propostas, fluxos, pressões hipotéticas e vínculos territoriais com origem/destino. **Uma região sem fichas de assentamento não está necessariamente desabitada.**

Os guias autorais estão em `data/guias_dossies_regionais.json`; a consulta é feita por `getRegionalDossier` e `searchRegionalDossiers`; os índices são publicados em `regional-dossier-indexes.json`. Consulte [Dossiês Regionais do M3](docs/DOSSIES_REGIONAIS_M3.md).

## Ciclo 13 — Fila de curadoria vinculada aos dossiês

A pesquisa do M3 passa a ter uma **fila publicada de 16 perguntas regionais**. Oito possuem prioridade editorial; outras oito permanecem aguardando ordenação. Todas continuam sem respostas documentais conclusivas neste ciclo.

`data/prioridades_curadoria_m3.json` armazena as prioridades sem duplicar os guias; os produtos publicados são `research-backlog.json` e `research-backlog-indexes.json`. O cliente permite `getResearchBacklog` e `searchResearchBacklog`; `reviewResearchBacklog` revisa a fila sem alterar a lore. [Consultar a fila de pesquisa](docs/FILA_CURADORIA_M3.md).

## Manuscrito autoral do Hack Carcaça DW — lore indexada

O **Capítulo I (páginas 2 a 25)** do manuscrito `Hack Carcaça Dungeon World.docx` foi incorporado à pesquisa como **fonte autoral em revisão**: 24 páginas de texto consultável, **157 entradas temáticas (após segunda auditoria)**, **18 marcos cronológicos**, **7 incógnitas**, **7 questões de reconciliação** e **14 pontes com as regiões e perguntas do M3**.

A consulta fica nos artefatos `dist/carcaca/lore-*.json`, com `searchLore`, `getLoreChronology` e `searchLoreAtlasLinks`. **Nenhum dado foi promovido automaticamente a cânone, fichas D&D/DW ou eventos de campanha.** [Ler o índice completo e os conflitos editoriais](docs/LORE_HACK_CARCACA_DW.md).

## Segunda auditoria do manuscrito DW (2026-10-27)

Ampliação de **100 para 157 verbetes de ambientação**, com 38 divindades e 19 conceitos adicionais. O restante do manuscrito foi transcrito por página: **155 páginas de texto mecânico**, com a página 91 marcada como **sem texto extraível**. O índice `dist/carcaca/hack-mechanics-index.json` permite encontrar **653 rótulos candidatos** e menções a `REQUER:` sem confundi-los com movimentos certificados ou novos fatos do cenário.

Veja o [relatório da segunda auditoria](docs/REVISAO_AMPLIADA_HACK_CARCACA_DW.md) e [o índice mecânico](dist/carcaca/hack-mechanics-index.json).

## Terceira auditoria do manuscrito (27/10/2026)

A base agora também inclui **26 relações entre entidades da ambientação** e uma amostra de **41 movimentos de povo/classe** com título e `REQUER` confrontados contra os parágrafos originais do DOCX (**26 com requisito literal**). A [página 91 foi verificada como vazia](docs/TERCEIRA_AUDITORIA_HACK_CARCACA_DW.md).

As consultas `searchLoreRelations` e `searchSelectedMovements` permitem navegar por entidades, páginas, classes e pré-requisitos. Os efeitos dos movimentos **não foram certificados**; nenhum registro aplica regras ou altera o cânone. [Relatório de terceira auditoria](docs/TERCEIRA_AUDITORIA_HACK_CARCACA_DW.md).

## Quarta auditoria do Hack Carcaça DW

O repositório agora inclui **12 movimentos de povo com texto integral** (6 Humanos e 6 Orcs da Caatinga), incluindo quatro opções de *Saqueador da Caatinga* presentes em parágrafos separados. Um inventário adicional identifica **33 tabelas do DOCX**, das quais **21 são quadros gerais de movimentos e regras**, ainda sem transcrição integral.

As buscas `searchCompletePilotMovements` e `searchDocxTables` acessam os novos JSON publicados em `dist/carcaca/`. Nenhuma habilidade altera automaticamente fichas ou cânone. [Relatório da quarta auditoria](docs/QUARTA_AUDITORIA_HACK_CARCACA_DW.md).
