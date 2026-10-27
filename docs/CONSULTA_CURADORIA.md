# Consulta da curadoria nos jogos — contrato 0.1

## Dois bancos diferentes

1. `dist/catalog.json`, `dist/creatures/`, `src/client.mjs`: fichas de referência importadas com licenças específicas.
2. `dist/carcaca/`, `src/carcaca-client.mjs`: fichas **autorais** da Carcaça, regiões, hábitos e movimentos inspirados em Dungeon World.

Os IDs de D&D têm prefixos de fonte; os IDs da curadoria são `carcaca:criatura:...`. Não confundir.

## Geração e testes

```bash
pip install jsonschema
python scripts/validar_curadoria.py
python scripts/gerar_indices_curadoria.py
python scripts/gerar_indices_curadoria.py --check
node --test tests/carcaca-client.test.mjs
```

A Action `Validar e publicar curadoria da Carcaça` reproduz este processo e publica apenas `dist/carcaca/`. Se não houver alteração, não cria commit.

## Manifesto e artefatos

- `manifest.json`: versão, contagens e nomes dos arquivos.
- `catalog.json`: metadados, Tipo Carcaça, referência D&D, instinto DW e vínculos (sem fichas extensas).
- `indexes.json`: inversões `by_tipo_carcaca`, `by_tipo_dnd`, `by_regiao`, `by_lugar`, `by_faccao`, `by_estado`, `by_nome`.
- `creatures.json`: fichas autorais completas (em revisão).
- `regions.json`, `places.json`, `factions.json`, `types.json`: atlas.
- `fronts.json` e `settlements.json`: registros DW de campanha/referência, **não saves em andamento**.

## API JavaScript (ESM)

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const criaturas=await atlas.search({
  tipoCarcaca:"yokai",
  regiaoId:"regiao:foz-rio-ancestral",
  limit:20
});
const ficha=await atlas.get(criaturas[0].id);
const regioes=await atlas.getRegions();
const frentes=await atlas.getFronts();
```

Filtros adicionais: `query`, `tipoDnd`, `lugarId`, `faccaoId`, `estado`, `ndMin`, `ndMax`, `offset`. A busca é sensível a estado dos dados, não inventa regiões nem deduz Tipo Carcaça pelo tipo D&D. Fichas sem ND não passam pelo filtro numérico, mesmo com `ndMin:0`.

## Limitadores

- A curadoria é **incremental**, não classifica 2.021 variantes de D&D em massa.
- O cliente usa consulta linear do catálogo autoral; suficiente para os lotes pequenos. Índices invertidos permitem implementação futura escalável.
- Para jogar offline, empacotar os JSON num build local; não depender do endereço GitHub durante o jogo.
- As fichas DW completas (PV, dano, armadura) só serão preenchidas depois de estudo e revisão, nunca convertidas mecanicamente do ND.

## Consultar o ecossistema de assentamentos

Os JSON autorais em `dist/carcaca/` agora incluem `settlement-labels.json`, `settlement-indexes.json`, `peoples.json` e `flows.json`. A lista `settlements.json` guarda os registros com `ecologia_material` e `rotulos_carcaca`.

```js
const locais = await atlas.searchSettlements({
  regiaoId:"regiao:costa-sul",
  rotuloId:"rotulo:lavoura_sobre_pedra"
});
const portomonte = await atlas.getSettlement("assentamento:portomonte");
const fluxos = await atlas.getFlows();
const tipos = await atlas.getSettlementLabels();
```

**Filtros:** `searchSettlements({regiaoId,rotuloId,povoId,natureza})`. O campo `natureza` distingue `assentamento_civil` de `rede_de_abrigos`. As distribuições de água, alimento e reprodução **não** são estimadas automaticamente; `status` indica `documentado`, `inferido`, `proposto` ou `incerto`.

Novas referências: `docs/ECOLOGIA_DOS_ASSENTAMENTOS.md` e `schemas/assentamento-carcaca.schema.json`.

## Cenários de Dungeon World: somente leitura

O arquivo `dist/carcaca/settlement-scenarios.json` contém situações hipotéticas. O JS exige confirmação manual das pré-condições e **nunca aplica efeitos**:

```js
import {previewSettlementScenario} from "./src/carcaca-client.mjs";
const cenarios = await atlas.searchSettlementScenarios({movimentoDw:"Want"});
const cenario = await atlas.getSettlementScenario(cenarios[0].id);
const previa = previewSettlementScenario(cenario);
console.log(previa.condicoes_pendentes);
```

`previewSettlementScenario(cenario,{condicoesConfirmadas:[...strings]})` apenas verifica se as condições hipotéticas foram assinaladas pelo mestre e retorna possíveis opções narrativas. Não insere `Need`, não reduz Prosperidade/Defesas, não cria `Oath` e não modifica objetos em memória ou o repositório.

Quatro regras de referência: `Want` (necessidade não atendida), `Trade` (comércio bloqueado), `Capture` (mudança de controle de recurso) e `Aid` (auxílio condicionado a juramento e ameaça). `Aid` está explicitamente **bloqueado** no caso das ilhas até haver comunidades DW individualizadas e juramento estabelecido em jogo.

## Dependências materiais e histórico de campanha

O manifesto autoral agora expõe `material_dependencies` e `material_dependency_indexes`, com ID de assentamento, fluxo, predecessor e evidência.

```js
import {previewMaterialInterruption} from "./src/carcaca-client.mjs";
const deps=await atlas.searchMaterialDependencies({assentamentoId:"assentamento:portomonte"});
const preview=previewMaterialInterruption(deps,"dependencia:portomonte-purificacao");
console.log(preview.impactos_potenciais); // lavoura, sem aplicação de efeitos DW
```

**Atenção:** a prévia só percorre as dependências incluídas em `deps`. Para verificar todas as dependências possíveis da Costa Sul, passe `await atlas.getMaterialDependencies()` sem filtro.

Um estado de campanha pode ser criado em memória e registrado **explicitamente**:

```js
import {createCampaignLedger,recordCampaignEvent} from "./src/carcaca-campaign-state.mjs";
const estado=createCampaignLedger({id:"campanha:exemplo",nome:"Minha campanha"});
const novaVersao=recordCampaignEvent(estado,{
  id:"evento:exemplo-001",tipo:"acontecimento",
  assentamento_id:"assentamento:portomonte",
  descricao:"O mestre determinou que o ritual falhou nesta sessão.",
  mestre_confirmou:true,fonte_cenario_id:null,efeitos_adjudicados:[]
},{settlementIds:["assentamento:portomonte"]});
```

O código acima **é apenas um exemplo**: não escreve no repositório, não cria evento real e não altera o atlas. Para eventos ligados a cenário DW, passe `scenarioIds` e um `fonte_cenario_id` existente.

Leia `schemas/estado-campanha.schema.json` e `docs/REDE_MATERIAL_E_ESTADO_DE_CAMPANHA.md`.

## Perfis quantitativos opcionais (ciclo 8)

```js
import {previewMaterialBalance} from "./src/carcaca-material-balance.mjs";
const perfis=await atlas.searchMaterialBalances({assentamentoId:"assentamento:portomonte"});
const riscos=await atlas.searchEcologicalPressures({
  dependenciaId:"dependencia:portomonte-purificacao"
});
const indefinido=previewMaterialBalance(perfis[0]);
console.log(indefinido.motivo); // dados_insuficientes
```

Consulte `getMaterialBalances()`, `getMaterialBalanceIndexes()`, `getEcologicalPressures()` e `getEcologicalPressureIndexes()`. Pressões são **não ocorridas**. Balanço real carece de medidas com valor, unidade, período e origem explícitos; dados quantitativos não são completados automaticamente e a função somente simula.

## Capacidade de suporte ecológico (ciclo 9)

```js
import {previewSupportCapacity,previewPopulationFlow} from "./src/carcaca-support-capacity.mjs";
const p=await atlas.getSupportProfile("suporte:portomonte");
const indisponivel=previewSupportCapacity(p);
const outro=await atlas.searchSupportProfiles({natureza:"rede_de_abrigos"});
const indices=await atlas.getSupportIndexes();
```

A distribuição `support-profiles.json` contém três registros, todos sem quantidade informada, e `support-indexes.json` expõe índices por assentamento, natureza editorial e mobilidade sazonal. A simulação só opera com `premissasExplicitas:true` e todas as dimensões medidas, confirmadas e comparáveis no mesmo período; **não aplica efeitos DW**. A dinâmica demográfica exige contagem de residentes e eventos populacionais, sem converter viagens sazonais em migração.

Veja `docs/CAPACIDADE_DE_SUPORTE.md` para método e advertências de adequação nutricional, água potável, abrigo e tratamento de resíduos.

## Infraestrutura material (ciclo 10)

```js
import {auditInfrastructure,previewInfrastructureIssue} from "./src/carcaca-infrastructure.mjs";
const p=await atlas.getInfrastructureProfile("infraestrutura:portomonte");
const setoresSemDados=await atlas.searchInfrastructureProfiles({
 setorId:"saneamento",estadoSetor:"sem_documentacao"
});
const auditoria=auditInfrastructure(p,{sectorId:"construcao_abrigo"});
```

`auditInfrastructure` retorna **cópias** das âncoras de evidência, perguntas e lacunas; não cria instalações. `previewInfrastructureIssue(p,{sectorId,hipotese})` apenas produz lista de questões e relações potenciais, nunca um acontecimento de campanha ou atualização DW. Os índices permitem consultas por assentamento, natureza, setor documentado/não documentado e dependência.

## Guerra e fluxos territoriais (ciclo 11)

```js
import {previewTerritorialImpact} from "./src/carcaca-territorial.mjs";
const raids=await atlas.searchTerritorialDynamics({
 origemRegiaoId:"regiao:caatinga",destinoRegiaoId:"regiao:costa-sul"
});
const caso=previewTerritorialImpact(raids[0],{assentamentoId:"assentamento:portomonte"});
console.log(caso.atribuicao_automatica_bloqueada); // true
```

`getTerritorialDynamics`, `getTerritorialLabels`, `getTerritorialIndexes` e `getTerritorialDynamic(id)` permitem navegação do atlas. Os rótulos territoriais **não** são rótulos de assentamento. Todos os fatos deste lote têm `escala:regional`, sem vítima ou destino específicos, e não são eventos de campanha. Documento de referência: `docs/DINAMICAS_TERRITORIAIS_ALEM_SUL.md`.

## Dossiês regionais integrados (ciclo 12)

```js
import {reviewRegionalDossier} from "./src/carcaca-regional.mjs";
const dossie=await atlas.getRegionalDossier("dossie-regional:costa-sul");
const reuniao=reviewRegionalDossier(dossie);
const semAssentamentos=await atlas.searchRegionalDossiers({semAssentamentosCurados:true});
const mobilidade=await atlas.searchRegionalDossiers({temaPergunta:"mobilidade"});
```

A documentação agora possui **quatro dossiês** com referência às fichas existentes, indexáveis por região, local, assentamento, dinâmica e tema de pergunta. `reviewRegionalDossier` não afirma existência ou ausência física de população, não calcula perigo e não aplica DW. Ver `docs/DOSSIES_REGIONAIS_M3.md`.

## Prioridades de pesquisa e lacunas (ciclo 13)

```js
import {reviewResearchBacklog} from "./src/carcaca-research.mjs";
const fila=await atlas.getResearchBacklog();
const criticas=await atlas.searchResearchBacklog({faixaPrioridade:"primeiro_lote"});
const caatinga=await atlas.searchResearchBacklog({regiaoId:"regiao:caatinga"});
const indice=await atlas.getResearchBacklogIndexes();
const revisao=reviewResearchBacklog(fila);
```

**Todas as 16 questões permanecem sem resposta nova registrada**. Oito estão ordenadas; as demais aguardam prioridade. `reviewResearchBacklog` apresenta dependências editoriais e lacunas, não responde automaticamente às questões ou aprova qualquer mudança de cânone. Veja `docs/FILA_CURADORIA_M3.md`.

## Consulta ao manuscrito Hack Carcaça DW (2026-10-27)

```js
const itens=await atlas.searchLore({query:"Yokai",tipo:"povo"});
const cronologia=await atlas.getLoreChronology();
const revisoes=await atlas.getLoreReviewNotes();
const link=await atlas.searchLoreAtlasLinks({perguntaId:"pergunta:costa-sul-migracao"});
const indice=await atlas.getLoreIndexIndexes();
```

`getLoreIndex`, `getLoreEntity(id)`, `searchLore({query,tipo,pagina})`, `getLoreChronology`, `getLoreReviewNotes`, `getLoreAtlasLinks`, `getLoreAtlasLinkIndexes` e `searchLoreAtlasLinks` consultam **afirmações de manuscrito em revisão**. O trecho de Portomonte é resposta parcial **para alguns druidas**, não para todos os refugiados. Os objetos do manuscrito não alteram tags DW ou mapas. Fonte por página em `fontes/autoria/hack-carcaca-dw-capitulo-i.paginas.json` e discussão em `docs/LORE_HACK_CARCACA_DW.md`.

## Segunda auditoria do Hack DW — glossário e páginas mecânicas

```js
const divindades=await atlas.searchLore({tipo:"divindade"}); // 54 verbetes
const movs=await atlas.searchHackMechanicsPages({query:"Portomontense"});
const requer=await atlas.searchHackMechanicsPages({comRequer:true});
const mec=await atlas.getHackMechanicsIndex();
```

**Atenção:** `hack-mechanics-index.json` é catálogo preliminar de títulos visuais e referências por página; **não** é o conjunto dos movimentos aprovados. Página 91 está explicitamente marcada como sem texto extraível. Veja `docs/REVISAO_AMPLIADA_HACK_CARCACA_DW.md`.
