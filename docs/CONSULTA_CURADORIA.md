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
