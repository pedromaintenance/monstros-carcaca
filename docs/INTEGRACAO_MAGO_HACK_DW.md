# Décimo grupo integral — Mago

**Ciclo:** 27/10/2026. **Fonte:** manuscrito autoral `Hack Carcaça Dungeon World(1).docx`. SHA-256: `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Integridade documental

Transcritos os **42 movimentos de MAGO** (parágrafos DOCX 2209–2334, zero-based) com **77 opções**, **131 partes** e **21 REQUER diretos**. O grupo começa em MAGO, parágrafo 2207, e termina diante de FEITICEIRO, parágrafo 2346.

As dependências estão distribuídas por **14 movimentos-base** documentados: GRIMÓRIO, ESTUDO RÁPIDO, ALTERAR A FÓRMULA, ASSINATURA ARCANA, RITUAL, ABJURAÇÃO, CONJURAÇÃO, ADIVINHAÇÃO, ENCANTAMENTO, EVOCAÇÃO, ILUSÃO, TRANSMUTAÇÃO, TELECINESE e CONTRAMÁGICA. Não são subclasses inferidas.

Em particular, `REQUER: Grimório` aparece em PESQUISA ARCANA; não é requisito geral de todas as escolas. NÃO ERA EU depende de ILUSÃO; VOO ARCANO depende de TELECINESE. Nenhuma dependência composta foi registrada nos cabeçalhos dos 42 movimentos.

## Arquivos

| Camada | Caminho |
| --- | --- |
| Fonte editável compactada | `data/lore/hack-carcaca-dw-mago-integrais.json.gz` |
| Extrator reproduzível | `scripts/extrair_mago_docx.py` |
| JSON distribuído | `dist/carcaca/hack-mage-movements.json` |
| Índices | `dist/carcaca/hack-mage-movement-indexes.json` |
| Gerador | `scripts/gerar_indices_curadoria.py` |
| Validador | `scripts/validar_curadoria.py` |
| Cliente JS | `src/carcaca-client.mjs` |

A origem é armazenada como JSON UTF-8 compactado para preservar todas as partes em um arquivo menor. O workflow usa `gzip.decompress` e publica JSON legível em `dist`.

## Consultas

```javascript
const magia=await atlas.getMageMovements(); // 42
const ramificacoes=await atlas.searchMageMovements({
  raizDependencia:"movimento-classe:paragrafo-2241"
});
const necessidade=await atlas.getMageRequirementPreview("movimento-classe:paragrafo-2322",{
  movimentosPossuidos:["movimento-classe:paragrafo-2241"]
});
// Mesmo com a ILUSÃO identificada: habilitado_para_compra === null.
```

**Limites:** a transcrição mantém `aplicacao_canonica:false` e `estado:transcricao_integral_sem_revisao_mecanica`. Reconhecer pré-requisitos não libera compra ou atribuição e não altera automaticamente cânone, fichas ou campanhas.
