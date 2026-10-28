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

## Hack Carcaça DW — movimentos gerais integrados

A quinta auditoria forneceu a transcrição integral dos **21 quadros de regras gerais**, com **44 blocos originais**. O atlas agora distribui **22 unidades**: oito Movimentos Básicos, treze Avançados (incluindo **Mandados Pendentes**, preservado como movimento separado de **Recrutar**) e o subsistema de **Servos**.

- Origem preservada: `data/lore/hack-carcaca-dw-quadros-integrais.json`.
- Derivação: `scripts/hack_movimentos_gerais.py`.
- Distribuição: `dist/carcaca/hack-general-movements.json` e `hack-general-movement-indexes.json`.
- Cliente: `getGeneralMovements`, `getGeneralMovement`, `getGeneralMovementIndexes` e `searchGeneralMovements`.
- Núcleo mecânico estruturado: `data/lore/hack-carcaca-dw-regras-nucleo.json` → `dist/carcaca/hack-core-rules.json`, acessível por `getHackCoreRules()`.
- Detalhes e contrato: [Integração das regras gerais](docs/INTEGRACAO_REGRAS_GERAIS_HACK_DW.md).

```js
const adv = await atlas.searchGeneralMovements({categoria:"avancado"});
const recrutamento = await atlas.searchGeneralMovements({quadroId:"quadro-geral-docx:30"});
const servos = await atlas.getGeneralMovement("movimento-geral:docx-32");
```

O núcleo reúne atributos, rolagens, PV, Carga, armadura, Debilidades, Periculosidade e XP. A distribuição dos **cinco movimentos iniciais** entre Raça, Classe e Antecedente permanece explicitamente indefinida na camada estruturada.

Os textos são fiéis ao arquivo enviado, mas **não foram homologados mecanicamente**: `aplicacao_canonica:false`. A extração não altera o cânone, saves ou as fichas importadas de D&D/Peren.

## Movimentos de povos, classes e REQUER — novo ciclo

O manuscrito do **Hack Carcaça Dungeon World** foi incorporado à camada estruturada de personagens:

- **107 movimentos de povos**, em 18 grupos, com texto integral, marcadores, parágrafos de origem, continuações e 70 opções de lista;
- **632 movimentos de classe** inventariados por título e origem, distribuídos em 18 grupos; *seus efeitos ainda não foram integralmente revisados*;
- **270 requisitos REQUER literais**, dos quais 256 vínculos candidatos por título exato e 14 expressões pendentes de interpretação;
- cruzamento conservador com os 12 movimentos de povos transcritos na quarta auditoria, sem alterar os originais.

Os dados são publicados em `dist/carcaca/hack-people-movements.json` e `dist/carcaca/hack-class-movement-inventory.json`, com índices e arquivos separados de dependências candidatas e pendentes. O cliente `src/carcaca-client.mjs` expõe `searchPeopleMovements`, `searchClassMovements` e `getClassRequirementPreview`.

```js
const raciais = await atlas.searchPeopleMovements({grupo:"ANÕES DE THARGRID"});
const classe = await atlas.searchClassMovements({grupo:"GUERREIRO",comRequer:true});
const dependencia = await atlas.getClassRequirementPreview("movimento-classe:paragrafo-1120");
console.log(dependencia.habilitado_para_compra); // null: revisão obrigatória
```

**REQUER continua obrigatório**, mesmo em movimentos gratuitos; a consulta não equivale a elegibilidade homologada. Veja a [documentação completa da integração](docs/INTEGRACAO_MOVIMENTOS_POVOS_CLASSES_REQUER.md) e o [extrator DOCX reproduzível](scripts/extrair_movimentos_personagem_docx.py).

## Classe Artista Marcial — sexto grupo integral

Foram integrados os **42 movimentos** de **ARTISTA MARCIAL** (54 opções e 101 trechos com proveniência). A cobertura atual chega a **315 de 632 movimentos de classe completos** (49,8%); restam **317 títulos** no inventário sem transcrição integral.

Há **19 REQUER literais**: 18 vínculos diretos e a conjunção `VOO` → **Forma do Ar E Corpo Sem Peso**. O atlas identifica cada componente mas **não dispensa REQUER** nem libera a aquisição por conta própria.

```js
const artista=await atlas.getMartialArtistMovements(); // 42
const voo=await atlas.getMartialArtistRequirementPreview("movimento-classe:paragrafo-1962",{
  movimentosPossuidos:["movimento-classe:paragrafo-1949"]
});
// Falta Corpo Sem Peso; habilitado_para_compra === null.
```

Arquivos: `dist/carcaca/hack-martial-artist-movements.json` e `hack-martial-artist-movement-indexes.json`. Veja [documentação da integração](docs/INTEGRACAO_ARTISTA_MARCIAL_HACK_DW.md).

## Classe Bardo — quinto grupo integral

O **Bardo** agora tem **32 movimentos integrais**, **34 opções** e **103 trechos** rastreáveis, com cinco `REQUER` literais (quatro diretos e um cardinal). **A Canção que Fez o Mundo** exige **Arte Arcana E mais dois movimentos diferentes de Bardo**; não contam cópias do mesmo movimento, outro grupo, nem a própria Arte Arcana novamente.

A cobertura completa das classes chega a **273 de 632 movimentos** (Guerreiro 77, Bárbaro 59, Caçador 53, Ladino 52 e Bardo 32). Os **359 restantes** permanecem apenas inventariados.

```js
const bardo=await atlas.getBardMovements(); // 32
const preview=await atlas.getBardRequirementPreview("movimento-classe:paragrafo-1843",{
  movimentosPossuidos:["movimento-classe:paragrafo-1753",
                       "movimento-classe:paragrafo-1798",
                       "movimento-classe:paragrafo-1816"]
});
// preview.habilitado_para_compra === null: avaliação do Mestre permanece necessária.
```

Catálogo: `dist/carcaca/hack-bard-movements.json`. Índices: `hack-bard-movement-indexes.json`. Consulte [Integração do Bardo](docs/INTEGRACAO_BARDO_HACK_DW.md). A publicação não altera personagens nem cânone.

## Classe Guerreiro — transcrição integral (ciclo seguinte)

Os **77 movimentos de Guerreiro** agora possuem texto integral preservado, **137 opções** em parágrafos de lista e **235 partes** com proveniência. O catálogo de 632 movimentos continua indexado; Guerreiro, Bárbaro, Caçador, Ladino, Bardo e Artista Marcial possuem o vínculo explícito `texto_integral_disponivel:true`.

```js
const guerreiro=await atlas.getWarriorMovements();
const magias=await atlas.searchWarriorMovements({tipoRequisito:"todos"});
const arma=await atlas.getWarriorMovement("movimento-classe:paragrafo-1047");
const requisito=await atlas.getWarriorRequirementPreview(
  "movimento-classe:paragrafo-1120",
  {movimentosPossuidos:["movimento-classe:paragrafo-1047"]}
);
```

São **30 REQUER**: 27 correspondências exatas candidatas e três condições especiais (*Magia de Guerra*, *Passo Arcano* e *Tiro Arcano*). A checagem de aquisição permanece deliberadamente **não automática**. Consulte [Integração do Guerreiro](docs/INTEGRACAO_GUERREIRO_HACK_DW.md).

## Classe Ladino — quarto grupo integral

O Hack Carcaça agora distribui os **52 movimentos de Ladino** com **89 opções** e **156 trechos** do DOCX, preservados sem reescrita. São **6 REQUER**: quatro referências diretas, uma alternativa **Heist OU Plano B** e uma referência **Perfil** ainda sem movimento correspondente no inventário.

**Cutucar a Ferida** mantém `REQUER: Perfil` sem substituição ou dispensa automática: a lacuna exige revisão autoral. O catálogo totaliza **241 de 632 movimentos de classe transcritos integralmente** (391 ainda apenas inventariados).

```js
const ladino=await atlas.getRogueMovements();
const pendentes=await atlas.searchRogueMovements({tipoRequisito:"referencia_sem_alvo"});
const alternativa=await atlas.getRogueRequirementPreview(
  "movimento-classe:paragrafo-1619",
  {movimentosPossuidos:["movimento-classe:paragrafo-1612"]}
);
// A presença de Heist pode satisfazer a alternativa textual; habilitado_para_compra: null.
```

Arquivos: `dist/carcaca/hack-rogue-movements.json` e `hack-rogue-movement-indexes.json`. Consulte a [documentação da integração do Ladino](docs/INTEGRACAO_LADINO_HACK_DW.md).

## Classe Caçador — terceiro grupo integral

O Hack Carcaça agora possui **53 movimentos de Caçador** com texto original completo, **61 opções** e **125 partes** referenciadas ao DOCX. Com Guerreiro (77) e Bárbaro (59), isso representa **189 de 632 movimentos de classe** transcritos integralmente (**443** restantes no inventário).

São **15 REQUER**: 12 diretos e três especiais. *Barriga de Smaug* admite **Caçador de Monstros OU um movimento que tenha revelado uma vulnerabilidade** (esta alternativa depende de comprovação ficcional); *Nenhum Mundo É Longe Demais* exige **Caminhante dos Horizontes E Marca do Caçador**; *Olho da Presa* exige **Flecha de Sangue OU Marca do Caçador**.

```js
const cacador=await atlas.getHunterMovements();
const alternativos=await atlas.searchHunterMovements({tipoRequisito:"qualquer"});
const narrativos=await atlas.searchHunterMovements({comCondicaoFiccional:true});
const previa=await atlas.getHunterRequirementPreview(
  "movimento-classe:paragrafo-1492",
  {movimentosPossuidos:["movimento-classe:paragrafo-1484"]}
);
console.log(previa.habilitado_para_compra); // null; nunca libera automaticamente
```

Fonte: `data/lore/hack-carcaca-dw-cacador-integrais.json`. Distribuição: `dist/carcaca/hack-hunter-movements.json`; índices: `hack-hunter-movement-indexes.json`. Veja [Integração de Caçador](docs/INTEGRACAO_CACADOR_HACK_DW.md).

## Classe Bárbaro — segundo grupo integral

Foram integrados **59 movimentos de Bárbaro** (84 opções e 156 partes da fonte), elevando o catálogo de classes integralmente transcritas a **136 movimentos**: 77 de Guerreiro e 59 de Bárbaro. Os demais **496 títulos** continuam disponíveis no inventário, mas sem texto integral homologado.

Os **37 REQUER** de Bárbaro incluem 36 correspondências nominais diretas e uma condição conjuntiva: **Fúria Além da Morte** exige **Fúria Divina e Demasiado Furioso Para Morrer**. O indexador registra os dois pré-requisitos; a API `getBarbarianRequirementPreview` nunca aprova a aquisição automaticamente.

```js
const movimentos = await atlas.getBarbarianMovements();
const escolhiveis = await atlas.searchBarbarianMovements({comOpcoes:true});
const duplaCondicao = await atlas.getBarbarianRequirementPreview(
  "movimento-classe:paragrafo-1430",
  {movimentosPossuidos:["movimento-classe:paragrafo-1427"]}
);
```

Catálogo: `dist/carcaca/hack-barbarian-movements.json`; índices: `hack-barbarian-movement-indexes.json`. Consulte a [documentação integral de Bárbaro](docs/INTEGRACAO_BARBARO_HACK_DW.md).

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


## Classe Paladino — setimo grupo integral

Integrados **28 movimentos** de PALADINO (47 opcoes, 83 trechos e 13 REQUER diretos). O atlas passa a cobrir **343 dos 632 movimentos de classe** (54,3%). MISSÃO SAGRADA concede livremente JURAMENTO QUEBRADO e PENITÊNCIA, mas **ambos continuam exigindo REQUER: Missão Sagrada**; nenhum efeito e atribuido automaticamente.

Fonte versionada: `data/lore/hack-carcaca-dw-paladino-integrais.json.gz` (JSON comprimido, recuperavel por Python gzip). O JSON integral legivel e publicado em `dist/carcaca/hack-paladin-movements.json`, com indices em `dist/carcaca/hack-paladin-movement-indexes.json`.


## Classe Clérigo — oitavo grupo integral

Integrados **37 movimentos** de CLÉRIGO (26 opções, 68 trechos rastreados e **19 REQUER diretos**), elevando a cobertura para **380 de 632 movimentos de classe** (60,1%). Os requisitos têm **seis raízes independentes**, incluindo Sacerdote, Presságio, Runa, Empreste Seu Corpo, Espíritos Estão por Toda Parte e Círculo de Convocação. O atlas não torna Sacerdote requisito universal para outros caminhos documentados.

A cadeia RUNA → RUNA VIVA → PELE ESCRITA é preservada: possuir Runa isoladamente não dispensa Runa Viva. O cliente expõe `getClericDependencyChain` para diagnóstico somente, sem aquisição automática. Fonte compacta: `data/lore/hack-carcaca-dw-clerigo-integrais.json.gz`; catálogo JSON legível: `dist/carcaca/hack-cleric-movements.json`. Documentação: [Integração Clérigo](docs/INTEGRACAO_CLERIGO_HACK_DW.md).


## Classe Druida — nono grupo integral

O grupo DRUIDA possui agora **27 movimentos transcritos integralmente**, com **42 opções**, **74 partes** rastreáveis e **13 REQUER** (12 referências diretas, uma conjunção). O atlas alcança **407 de 632 movimentos de classe** (**64,4%**).

**FORMA PRIMORDIAL** exige `Metamorfose e Maestria Elemental` ao mesmo tempo. A API `getDruidRequirementPreview` verifica ambos os componentes sem autorizar compra nem alterar a ficha. Outros ramos independentes preservados incluem **Círculo dos Esporos** e **Fogo Selvagem**.

Fontes: `data/lore/hack-carcaca-dw-druida-integrais.json`, `scripts/extrair_druida_docx.py`. Distribuição: `dist/carcaca/hack-druid-movements.json` e `dist/carcaca/hack-druid-movement-indexes.json`. Consulte [Integração Druida](docs/INTEGRACAO_DRUIDA_HACK_DW.md).


## Classe Mago — decimo grupo integral

Os **42 movimentos de MAGO** foram transcritos integralmente (77 opcoes, 131 partes textuais e **21 REQUER de alvo direto**). A cobertura chega a **449 de 632 movimentos de classe** (71,0%); 183 movimentos ainda aguardam transcricao integral.

O Mago possui **14 raizes documentais de pre-requisitos**. Por exemplo, PESQUISA ARCANA requer GRIMÓRIO, enquanto NÃO ERA EU requer ILUSÃO e VOO ARCANO requer TELECINESE. A catalogação não inventa GRIMÓRIO como condição universal das demais práticas. O método `getMageRequirementPreview` pesquisa a cadeia de dependências sem conceder movimentos nem autorizar compra.

Fonte versionada: `data/lore/hack-carcaca-dw-mago-integrais.json.gz` (JSON gzip). JSON distribuido: `dist/carcaca/hack-mage-movements.json`; indices: `dist/carcaca/hack-mage-movement-indexes.json`. Consulte [documentacao da integracao](docs/INTEGRACAO_MAGO_HACK_DW.md).


## Classe Feiticeiro — décimo primeiro grupo integral

Integrados **42 movimentos completos** (48 opções, 100 trechos e 20 REQUER literais) de FEITICEIRO. Com isso, o atlas cobre **491 de 632 movimentos de classe** (77,7%). As sete fontes de dependência são Magia no Sangue (9), Magia Selvagem (3), Herança Dracônica (3), Invasão Mental (2), Manto da Fênix (1), Telepatia (1) e Entre Sonhos (1).

Consulta em `getSorcererMovements`, `searchSorcererMovements` e `getSorcererRequirementPreview`. Fonte: `data/lore/hack-carcaca-dw-feiticeiro-integrais.json.gz`; catálogo: `dist/carcaca/hack-sorcerer-movements.json`; índices: `dist/carcaca/hack-sorcerer-movement-indexes.json`. [Guia técnico](docs/INTEGRACAO_FEITICEIRO_HACK_DW.md). REQUER permanece obrigatório e não há aquisição automática.


## Classe Bruxo — décimo segundo grupo integral

Transcritos integralmente **49 movimentos de BRUXO** (59 opções, 120 trechos e 43 REQUER literais diretos), elevando o Hack a **540 de 632 movimentos** (85,4%). A estrutura conserva cinco raízes com dependentes (**Pacto 30; Maldição 5; Magia Simpática 3; Caldeirão 2; Olho Gordo 3**) e **Sabá** como movimento independente. Não foi criado Pacto universal para caminhos autônomos.

O atlas materializa a fonte compacta `data/lore/hack-carcaca-dw-bruxo-integrais.json.gz` em `dist/carcaca/hack-warlock-movements.json` e `dist/carcaca/hack-warlock-movement-indexes.json`. A API `getWarlockRequirementPreview` verifica a cadeia inteira, sempre com `habilitado_para_compra:null`. [Guia técnico](docs/INTEGRACAO_BRUXO_HACK_DW.md).


## Necromante — decimo terceiro grupo integral do Hack Carcaça DW

Foram integrados **29 movimentos integrais de Necromante**, com 45 opções, 83 trechos documentais e **11 REQUER** (9 diretos e 2 compostos com operador E). A cobertura do inventário chega a **569 de 632 movimentos de classe (90,0%)**.

- **LEVANTE-SE COMO VOCÊ MESMO** exige ANIMAR OS MORTOS **E** NOME DO MORTO;
- **ABOMINAÇÃO COSTURADA** exige ANIMAR OS MORTOS **E** COLHEITA DE OSSOS.

O cliente expõe `getNecromancerMovements`, `getNecromancerMovementIndexes`, `searchNecromancerMovements` e `getNecromancerRequirementPreview`. A prévia não autoriza compra, mesmo quando os dois movimentos são identificados. Fonte autoral compactada em `data/lore/hack-carcaca-dw-necromante-integrais.json.gz`, catálogo integral em `dist/carcaca/hack-necromancer-movements.json` e documentação em [INTEGRACAO_NECROMANTE_HACK_DW.md](docs/INTEGRACAO_NECROMANTE_HACK_DW.md).


## Classe Artífice — décimo quarto grupo integral

Integração de **23 movimentos integrais de ARTÍFICE**, com **32 opções**, **59 trechos documentais** e **7 REQUER diretos**. A cobertura passa para **592 de 632 movimentos de classe (93,7%)**. Três raízes documentais concentram os requisitos: ARTÍFICE (1), ALQUIMISTA (3) e TRANSMUTAÇÃO ALQUÍMICA (3). Engenharia, medicina e culinária não recebem requisitos que não constam no manuscrito.

O movimento AQUILO QUE VOCÊS CHAMAM DE MUNDO exige ARMA HUMANA, que por sua vez exige TROCA EQUIVALENTE e, indiretamente, TRANSMUTAÇÃO ALQUÍMICA. A API `getArtificerRequirementPreview` percorre a cadeia completa sem liberar compras. A referência obsoleta a "Alquimista Federal" no corpo de AQUILO QUE VOCÊS CHAMAM DE MUNDO foi **corrigida para Arma Humana por confirmação autoral em 27/10/2026**, sem alterar o `REQUER` nem criar dependências. A emenda está registrada no pacote de origem e protegida pelos testes.

Fonte versionada: `data/lore/hack-carcaca-dw-artifice-integrais.json.gz`; catálogo legível: `dist/carcaca/hack-artificer-movements.json`. Detalhes em [Integração do Artífice](docs/INTEGRACAO_ARTIFICE_HACK_DW.md).


## Classe Mercenário — décimo quinto grupo integral

Transcritos **31 movimentos** de MERCENÁRIO com **37 opções**, **75 trechos documentais** e **11 REQUER diretos**. A cobertura cumulativa passa a **623 de 632 movimentos (98,6%)**. A árvore de CAPITÃO contém nove dependentes, incluindo a cadeia SAQUE ORGANIZADO → ABORDAGEM → CAPITÃO. O PREÇO DA GUERRA tem dois dependentes independentes da liderança.

Contrabando, Recrutar e navegação sem REQUER literal não foram subordinados a CAPITÃO por inferência. A API `getMercenaryRequirementPreview` verifica cadeias sem autorizar compras. Veja [Integração Mercenário](docs/INTEGRACAO_MERCENARIO_HACK_DW.md).

Restam nove movimentos distribuídos entre ESCRIBA YOKAI (3), NOBRE (3) e ARQUEÓLOGO (3).


## Hack Carcaça Dungeon World: 100% de cobertura documental das classes

A transcrição integral dos **632 movimentos de classe, distribuídos por 18 grupos**, está publicada em catálogos legíveis, indexada e identificada por origem no manuscrito DOCX. Neste ciclo final entraram **Escriba Yokai (3)**, **Nobre (3)** e **Arqueólogo (3)**, sem opções ou REQUER literais. O índice global comprova os 632 IDs inventariados com texto integral disponível e nenhum movimento pendente.

A conclusão é **documental**, não uma homologação de mecânicas: todos os novos movimentos mantêm `aplicacao_canonica:false`, como os movimentos de classe anteriores. O texto de CAMADAS contém uma aspa inicial isolada, preservada até revisão autoral. Consulte [Fechamento das Classes](docs/FECHAMENTO_CLASSES_HACK_DW.md).


## Povoamento regional orientado pelo Hack (propostas narrativas)

O Hack Carcaça Dungeon World agora fundamenta **16 núcleos sociais de povoamento em oito áreas**, conectados por três tramas transregionais. Cada núcleo contém habitantes, rotina, personagem central, conflito, escolha difícil e IDs exatos dos movimentos de povo/classe que inspiram sua criação.

As propostas não substituem `curadoria/assentamentos`, `data/regioes_carcaca.json` nem fatos canônicos: quatro áreas usam regiões do atlas existentes; Garganta, Rio/Drakport, Thargrid/Ironwood e Shadar-Riverie permanecem como âncoras de lore sem criar IDs oficiais prematuros.

Consulta: `getRegionalPopulationProposals()`, `searchRegionalPopulationProposals({areaId,regiaoAtlasId,tema,movimentoHack,query})`. Fontes: `data/propostas/povoamento-regional-hack-carcaca.json`; documentação: [Povoamento regional](docs/POVOAMENTO_REGIONAL_HACK.md).


## Caatinga — comunidades e tensões (povoamento 02)

Desenvolvida como proposta narrativa em **38 entidades**: cinco comunidades, cinco coletivos, oito personagens, quatro pontos de água, seis conexões de circulação, quatro conflitos e seis cenas. Articula o Poço Sem Bandeira e a Feira das Ferragens Trocadas às novas comunidades do Pátio das Cabaças Lacradas, Pedra dos Nove Silêncios e Baixio das Sementes Guardadas.

As regras do Hack orientam valores e práticas, não autorizam efeitos nem provam que todos os orcs compartilhem uma ideologia. A ligação com Portomonte é explicitamente condicional, sem coordenadas, volumes de água, população ou estrada comprovados. A fonte está em `data/propostas/caatinga-rede-social-hack.json`; detalhes em [Caatinga habitada](docs/CAATINGA_POVOAMENTO_CICLO2.md).


## Povoamento III — fronteira Caatinga/Costa Sul

Uma rede **não canônica** de **34 elementos propostos** conecta sociedades do interior e da Costa Sul: cinco encontros de passagem, nove personagens, cinco pactos negociáveis, seis fluxos condicionais, seis cenas e três tramas. As referências às classes e povos do Hack servem de inspiração para costumes e conflitos, não de autorização mecânica. A água do templo de Deméter é comprovadamente purificada para lavoura, não para beber; comércio direto com a Caatinga não está confirmado e ataques regionais não comprovam evento específico em Portomonte.

Fonte `data/propostas/fronteira-caatinga-costa-sul-hack.json`, documentação [Fronteira Caatinga/Costa Sul](docs/FRONTEIRA_CAATINGA_COSTA_SUL.md), API `getFrontierCaatingaCostaSul` e `searchFrontierEntities`.


## Costa Sul — Portomonte e tradições insulares (Povoamento IV)

**33 elementos sociais propostos:** seis microespaços em Portomonte, três redes insulares não individualizadas, oito personagens (cinco de ciclos anteriores), quatro práticas sociais, quatro circulações hipotéticas, cinco cenas e três tramas de campanha. Dados em `data/propostas/portomonte-ilhas-costa-sul-hack.json`; publicação `dist/carcaca/costa-sul-social-fabric.json` e índices; API `getCostaSulSocialFabric` e `searchCostaSulEntities`. Dossiê: [Portomonte e as Ilhas](docs/PORTOMONTE_ILHAS_POVOAMENTO_CICLO4.md).

A água de Deméter está documentada para lavouras e não implica potabilidade doméstica; ilhas, rotas, movimentos atribuídos a NPCs, comércio específico e acolhimento de refugiados em Portomonte não foram estabelecidos como cânone.


## Povoamento V — Ecologia política do Mar de Sangue

**36 propostas narrativas** em sete categorias: cinco zonas sociais hipotéticas, seis coletivos, oito personagens, quatro pactos, quatro fenômenos da fronteira marítima, seis cenas e três tramas. A fonte `data/propostas/mar-sangue-ecologia-politica-hack.json` usa movimentos dos povos marinhos do Hack e se liga às fichas da Costa Sul e da fronteira (inclusive Nilku).

Distribuição: `dist/carcaca/mar-sangue-social-ecology.json` e `dist/carcaca/mar-sangue-social-ecology-indexes.json`. API `getMarSangueSocialEcology`, `getMarSangueEntity` e `searchMarSangueEntities`. Dossiê [Mar de Sangue — Ecologia Política](docs/MAR_SANGUE_ECOLOGIA_POLITICA_CICLO5.md).

Todos os grupos e episódios individuais continuam como propostas: abissais não são demônios do Abismo, os povos marinhos não possuem governo unificado e o limite entre mares é móvel.


## Povoamento VI — Diplomacia submersa e sucessões

O Mar de Sangue ganhou **41 entidades narrativas propostas**: quatro modelos de polos diplomáticos (não cidades confirmadas), cinco casas/coalizões, nove representantes (seis reutilizados do ciclo anterior), cinco disputas de sucessão **condicionais**, cinco tratados **não assinados**, seis cenas, quatro missões e três arcos de campanha. A temática é quem pode assinar e cobrar em nome de uma comunidade quando cidades marinhas autônomas precisam cooperar.

Fonte: `data/propostas/mar-sangue-diplomacia-hack.json`. Distribuição: `dist/carcaca/mar-sangue-diplomacy.json`; índices por categoria, águas, povo, bloco e movimento inspirador. API: `getMarSangueDiplomacy`, `getMarSangueDiplomacyEntity`, `searchMarSangueDiplomacy`. Ver [Dossiê de Diplomacia do Mar de Sangue](docs/MAR_SANGUE_DIPLOMACIA_CICLO6.md). Todas as propostas preservam a autonomia tritã/sereia, a natureza não demoníaca dos abissais e a cronologia das campanhas.


## Povoamento VII — Economia material do Mar de Sangue

**44 propostas sociais** em oito categorias: cinco polos de atividade, seis ofícios, oito NPCs (seis reaproveitados), sete fluxos hipotéticos, cinco tributos contestáveis, quatro circuitos clandestinos não operacionais, seis cenas e três arcos. O conjunto explora pesca e passagem tributadas, manutenção, trabalho coercitivo, sacrifício, comunicação e rotas de refúgio sem estabelecer volumes ou comércio de fato.

Fonte `data/propostas/mar-sangue-economia-hack.json`. Distribuição `dist/carcaca/mar-sangue-economy.json`; índices `dist/carcaca/mar-sangue-economy-indexes.json`; API `getMarSangueEconomy`, `searchMarSangueEconomy`. Dossiê em [Economia do Mar de Sangue](docs/MAR_SANGUE_ECONOMIA_CICLO7.md). Todas as novas figuras, transações e ocorrências continuam propostas não canônicas.


## Povoamento VIII — Costa Sul sob pressão do Mar de Sangue

**45 propostas narrativas** em oito categorias: cinco núcleos de encontro, cinco ofícios, nove pessoas (seis retomadas do ciclo IV), seis impactos econômicos condicionais, seis fluxos não efetivados, cinco acordos não assinados, seis cenas e três arcos. O módulo examina como tributos e ameaças marítimas *poderiam* afetar reparos, agricultura, hospedagem e navegação em Portomonte e nas ilhas, sem estabelecer contratos com cidades submarinas como fatos.

Fonte: `data/propostas/costa-sul-pressao-mar-sangue-hack.json`. Saídas `dist/carcaca/costa-sul-sea-pressure.json` e `dist/carcaca/costa-sul-sea-pressure-indexes.json`. API: `getCostaSulSeaPressure`, `searchCostaSulSeaPressure`, `getCostaSulSeaPressureEntity`. Dossiê: [Costa Sul sob Pressão](docs/COSTA_SUL_PRESSAO_MAR_SANGUE_CICLO8.md). Todos os registros permanecem não canônicos, com preservação dos limites de potabilidade, refugiados, rotas e cosmologia.


## Povoamento IX — Garganta e Rio Ancestral sob ocupação

**43 propostas narrativas**: seis núcleos sociais, cinco ofícios, nove personagens (incluindo Marxinus, Maire, Jorvan e Kaelen Branth já canônicos), cinco circuitos hipotéticos, cinco memórias históricas, quatro acordos não vigentes, seis cenas e três arcos. Os vínculos usam movimentos de humanos, orcs, anões, shadow fey e yokai, sem atribuição mecânica automática.

Fonte: `data/propostas/garganta-rio-ancestral-social-hack.json`. Distribuição: `dist/carcaca/garganta-river-social.json`, índices `dist/carcaca/garganta-river-social-indexes.json`. API: `getGargantaRiverSocial`, `searchGargantaRiverSocial`, `getGargantaRiverEntity`. Dossiê: [Garganta e Rio Ancestral — Ciclo IX](docs/GARGANTA_RIO_ANCESTRAL_POVOAMENTO_CICLO9.md).

**Não apresenta Garganta como livre na atualidade** (Lord Varys Duskveil governa), não liberta Drakport nem determina a causa de novos fenômenos no rio. As áreas `area-proposta:garganta` e `area-proposta:rio` são escopos editoriais, não novas regiões geocodificadas canônicas.


## Povoamento X — Thargrid, uma sociedade livre sob ameaça

**46 propostas**: seis microespaços, seis coletivos, nove pessoas, quatro dilemas contingentes, seis fluxos não confirmados, cinco acordos não assinados, sete cenas e três arcos. A vida entre anões, gigantes de pedra, gelo e fogo, draconatos e refugiados gira em torno de defesa, acolhimento, trabalho, memória e circulação. O Ordenamento tem validade interna entre gigantes; não é uma soberania sobre os demais habitantes. Ironwood não integra um comando único da resistência.

Fonte `data/propostas/thargrid-resistencia-cotidiano-hack.json`, distribuição `dist/carcaca/thargrid-social-resistance.json`, índices `dist/carcaca/thargrid-social-resistance-indexes.json`. API: `getThargridSocialResistance`, `searchThargridSocialResistance`, `getThargridSocialEntity`. Veja [Dossiê de Thargrid](docs/THARGRID_RESISTENCIA_POVOAMENTO_CICLO10.md). A queda do Reino e a presença atual de Rayquaza não foram presumidas.

## Povoamento XI — Ironwood e Eldroth

O atlas inclui **40 propostas narrativas** sobre guerrilha florestal, acolhimento de fugitivos, trabalho ecológico sob ocupação e preservação da memória de Vandar: cinco microespaços, cinco coletivos, oito pessoas, quatro dilemas, cinco fluxos, quatro acordos, seis cenas e três arcos.

A fonte é `data/propostas/ironwood-eldroth-resistencia-hack.json`, publicada em `dist/carcaca/ironwood-eldroth-resistance.json` e indexada em `ironwood-eldroth-resistance-indexes.json`. O cliente oferece `getIronwoodEldrothResistance`, `getIronwoodEldrothResistanceIndexes`, `getIronwoodEldrothEntity` e `searchIronwoodEldrothResistance`.

**Preservação do cânone:** Sylara ainda ocupa Eldroth; Damaris controla Vandar; Ironwood é fortaleza autônoma de rangers e druidas sob Elara Stormoak, não a própria Eldroth. A mensageira Vaelis é reaproveitada somente como proposta anterior de Thargrid. Acordos, cenas e rotas não são reais na cronologia. Consulte [o dossiê do Povoamento XI](docs/IRONWOOD_ELDROTH_POVOAMENTO_CICLO11.md).
