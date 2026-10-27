# Sexto grupo de classe integrado — Artista Marcial

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx` (manuscrito autoral).  
**SHA256:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Escopo e proveniência

O grupo **ARTISTA MARCIAL** possui **42 movimentos** no inventário de 632 títulos de classe, com âncoras de parágrafo DOCX **1862–1963** (índices zero-based). A extração contempla os **101 trechos textuais** efetivos (corpos, continuações e escolhas) e **54 opções** presentes nos parágrafos em estilo de lista.

São **19** movimentos com `REQUER:` literal: **18** apontam para um único título identificado e **1** exige conjunção. Os demais **23** não têm `REQUER:` no cabeçalho. Todos continuam `aplicacao_canonica:false`.

Os registros oferecem `titulo`, `requisito_literal`, `requisito_estruturado`, `partes`, `opcoes`, `texto_original`, `paragrafo_docx`, estado de revisão e ID idêntico ao do inventário original. `texto_original` concatena os trechos de origem na ordem documental, **sem converter continuação em opção nem inventar efeitos**.

## REQUER especial: VOO

| Movimento | Índice | Regra literal |
| --- | ---: | --- |
| FORMA DO AR | 1949 | Sem REQUER |
| CORPO SEM PESO | 1950 | REQUER: Forma do Ar |
| VOO | 1962 | REQUER: Forma do Ar e Corpo Sem Peso |

`VOO` guarda:

```json
{
  "tipo": "todos",
  "operador_literal": "e",
  "itens": [
    {"tipo": "movimento_exato", "movimento_id": "movimento-classe:paragrafo-1949"},
    {"tipo": "movimento_exato", "movimento_id": "movimento-classe:paragrafo-1950"}
  ],
  "status": "interpretacao_literal_pendente_homologacao"
}
```

Ter apenas Forma do Ar não satisfaz o REQUER de VOO. E obter Corpo Sem Peso por qualquer meio **não dispensa** o REQUER de Corpo Sem Peso: a cadeia continua obrigatória.

## Contrato de dados

| Camada | Arquivo |
| --- | --- |
| Transcrição editável | `data/lore/hack-carcaca-dw-artista-marcial-integrais.json` |
| Inventário base | `data/lore/hack-carcaca-dw-inventario-classes-requer.json` |
| Extrator reproduzível | `scripts/extrair_artista_marcial_docx.py` |
| Índices | `scripts/hack_movimentos_personagem.py` |
| Gerador | `scripts/gerar_indices_curadoria.py` |
| Catálogo publicado | `dist/carcaca/hack-martial-artist-movements.json` |
| Índices publicados | `dist/carcaca/hack-martial-artist-movement-indexes.json` |
| Cliente | `src/carcaca-client.mjs` |
| Validações | `scripts/validar_curadoria.py`, `tests/carcaca-client.test.mjs` |

O catálogo principal de classes continua com **632 títulos**, agora com **315 movimentos integrais disponíveis** (Guerreiro 77, Bárbaro 59, Caçador 53, Ladino 52, Bardo 32, Artista Marcial 42). O campo legado `texto_integral_curado:false` permanece intacto — disponibilidade da transcrição não equivale a homologação.

## Exemplo de consumo

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
const atlas=createCarcacaAtlas({
  baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"
});
const todos=await atlas.getMartialArtistMovements(); // 42
const elemental=await atlas.searchMartialArtistMovements({query:"água"});
const comRequer=await atlas.searchMartialArtistMovements({comRequer:true});
const voo=await atlas.getMartialArtistMovement("movimento-classe:paragrafo-1962");
const index=await atlas.getMartialArtistMovementIndexes();
const parcial=await atlas.getMartialArtistRequirementPreview(voo.id,{
  movimentosPossuidos:["movimento-classe:paragrafo-1949"]
});
// parcial.componentes_identificados_presentes === false
// parcial.habilitado_para_compra === null

const ambos=await atlas.getMartialArtistRequirementPreview(voo.id,{
  movimentosPossuidos:[
    "movimento-classe:paragrafo-1949",
    "movimento-classe:paragrafo-1950"
  ]
});
// ambos.componentes_identificados_presentes === true
// ambos.habilitado_para_compra === null: aprovação exige avaliação autoral/do Mestre
```

## Limites de interpretação

A transcrição não adjudica ações nem afere condições ficcionais, não confirma automaticamente técnica, treino, nível, vínculo de campanha ou aquisição de movimento. O sistema informa apenas correspondências estruturais. `REQUER: X` continua sendo uma dependência mecânica obrigatória, inclusive se o movimento for concedido gratuitamente.

Próximo objetivo de integração: transcrever integralmente outro grupo de classe ainda indexado, sem mudar a lógica de aquisição e sem afetar fichas importadas ou material do Peren.
