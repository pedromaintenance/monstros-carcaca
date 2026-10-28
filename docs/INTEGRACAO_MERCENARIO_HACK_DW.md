# Integração integral — Mercenário

Fonte: `Hack Carcaça Dungeon World(1).docx`; SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`; parágrafos DOCX 2736–2810 (zero-based).

## Integridade e mecânicas

**31 movimentos**, **37 opções**, **75 trechos**, **11 REQUER de referência direta**. As mecânicas de Domínio, contratos, risco, pirataria e marinharia foram preservadas sem alterações.

**CAPITÃO** é a origem de nove movimentos com requisitos diretos ou transitivos, incluindo a cadeia SAQUE ORGANIZADO → ABORDAGEM → CAPITÃO. **O PREÇO DA GUERRA** dá origem a ADIANTAMENTO e ISSO NÃO ESTAVA NO CONTRATO. Nenhuma dessas duas linhagens depende da outra.

Ausência de REQUER em CONTRABANDISTA, O MAR SEMPRE COBRA e PRECISO DE PROFISSIONAIS significa que CAPITÃO não foi promovido a pré-requisito universal.

## Arquivos

- `data/lore/hack-carcaca-dw-mercenario-integrais.json.gz`: fonte integral compactada.
- `scripts/extrair_mercenario_docx.py`: extrator reproduzível; requer manuscrito privado.
- `dist/carcaca/hack-mercenary-movements.json`: movimentos legíveis.
- `dist/carcaca/hack-mercenary-movement-indexes.json`: índices de dependências.
- `src/carcaca-client.mjs`: leitura e diagnóstico não mutável.

```javascript
const moves=await atlas.getMercenaryMovements(); // 31
const command=await atlas.searchMercenaryMovements({raizDependencia:"movimento-classe:paragrafo-2736"});
const preview=await atlas.getMercenaryRequirementPreview("movimento-classe:paragrafo-2802",{
  movimentosPossuidos:["movimento-classe:paragrafo-2736"]
});
// ABORDAGEM ausente; habilitado_para_compra continua null.
```

Todos permanecem `aplicacao_canonica:false`. REQUER é obrigatório, mesmo em concessão gratuita; nenhuma compra é autorizada automaticamente.
