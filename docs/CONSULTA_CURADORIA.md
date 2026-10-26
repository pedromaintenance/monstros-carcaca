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
