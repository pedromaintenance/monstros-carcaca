# Integração integral de Paladino — Hack Carcaça Dungeon World

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Escopo e integridade

**28 movimentos integrais** (parágrafos DOCX 1968–2048), **47 opções**, **83 partes** e **13 REQUER** de correspondência direta. A próxima classe é CLÉRIGO (parágrafo 2054).

**MISSÃO SAGRADA** concede livremente **JURAMENTO QUEBRADO** e **PENITÊNCIA**. A gratuidade não dispensa seus respectivos `REQUER: Missão Sagrada`. Concessões e pré-requisitos são relações estruturais distintas; nenhum movimento é concedido automaticamente.

## Artefatos

| Camada | Caminho |
| --- | --- |
| Fonte versionada | `data/lore/hack-carcaca-dw-paladino-integrais.json.gz` |
| Extrator reproduzível | `scripts/extrair_paladino_docx.py` |
| JSON integral público | `dist/carcaca/hack-paladin-movements.json` |
| Índices | `dist/carcaca/hack-paladin-movement-indexes.json` |
| Gerador | `scripts/gerar_indices_curadoria.py` |
| Validador | `scripts/validar_curadoria.py` |
| Cliente ESM | `src/carcaca-client.mjs` |

O conteúdo fonte foi versionado como JSON UTF-8 comprimido por gzip determinístico, recuperável com `gzip.decompress`, e é distribuído como JSON legível. Para reproduzir o gzip localmente, é necessário ter o DOCX autoral original e executar o extrator com `python-docx`.

```bash
pip install python-docx
python scripts/extrair_paladino_docx.py 'Hack Carcaça Dungeon World(1).docx' data/lore/hack-carcaca-dw-inventario-classes-requer.json
```

## Consulta no cliente

```javascript
const origem = 'movimento-classe:paragrafo-1968';
const missao = await atlas.getPaladinMovement(origem);
const movimentos = await atlas.getPaladinMovements(); // 28
const concedidos = await atlas.getPaladinGrantPreview(origem,{movimentosPossuidos:[origem]});
const requisito = await atlas.getPaladinRequirementPreview('movimento-classe:paragrafo-1976',{movimentosPossuidos:[origem]});
// habilitado_para_compra: null; atribuicao_automatica: false
```

**Limites:** todos os movimentos mantêm `aplicacao_canonica:false` e estado de transcrição ainda sem revisão mecânica. Nenhum juramento, voto, personagem ou campanha é alterado automaticamente.
