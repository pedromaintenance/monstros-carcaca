# Integração de Necromante — Hack Carcaça Dungeon World

**Ciclo:** 27/10/2026. Manuscrito original: `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Integridade da transcrição

**29 movimentos**, **45 opções**, **83 trechos documentais** e **11 REQUER**, dos quais **nove diretos** e **dois compostos com operador E**. Parágrafos DOCX 2581 a 2666, indexação zero-based. Próxima classe: ARTÍFICE (2670).

## REQUER cumulativos

- **LEVANTE-SE COMO VOCÊ MESMO** — `REQUER: Animar os Mortos e Nome do Morto`
- **ABOMINAÇÃO COSTURADA** — `REQUER: Animar os Mortos e Colheita de Ossos`

Os componentes devem estar presentes simultaneamente; o operador é `todos` (`e`), jamais uma escolha exclusiva ou alternativa. A prévia é apenas diagnóstico estrutural, sem compra de movimentos, mudança de ficha ou homologação automática.

## Camadas e arquivos

| Finalidade | Arquivo |
| --- | --- |
| Fonte compactada (JSON gzip) | `data/lore/hack-carcaca-dw-necromante-integrais.json.gz` |
| Extrator de origem | `scripts/extrair_necromante_docx.py` |
| Movimentos legíveis | `dist/carcaca/hack-necromancer-movements.json` |
| Índices | `dist/carcaca/hack-necromancer-movement-indexes.json` |
| Gerador | `scripts/gerar_indices_curadoria.py` |
| Validador | `scripts/validar_curadoria.py` |
| Cliente | `src/carcaca-client.mjs` |

## Uso da API

```javascript
const lista = await atlas.getNecromancerMovements(); // 29
const todos = await atlas.searchNecromancerMovements({tipoRequisito:'todos'}); // 2
const resultado = await atlas.getNecromancerRequirementPreview('movimento-classe:paragrafo-2616', {
  movimentosPossuidos:['movimento-classe:paragrafo-2582']
});
// Nome do Morto ainda falta; resultado.habilitado_para_compra === null
```

Todos os movimentos permanecem com `aplicacao_canonica:false`, `estado:transcricao_integral_sem_revisao_mecanica` e proveniência original. Nenhuma campanha ou ficha é modificada.
