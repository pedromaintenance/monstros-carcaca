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
