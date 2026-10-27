# Hack Carcaça Dungeon World — Integração da classe Bruxo

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Integridade e escopo

Transcritos **49 movimentos**, **59 opções** e **120 trechos** nos parágrafos DOCX **2454–2572** (base zero). **43 REQUER literais** com correspondência exata e sem requisitos compostos identificados. Próxima classe no manuscrito: NECROMANTE, cabeçalho no parágrafo 2579.

## Dependências preservadas

| Movimento-raiz documental | Movimentos dependentes (direta ou indiretamente) |
| --- | ---: |
| Pacto | 30 |
| Maldição | 5 |
| Magia Simpática | 3 |
| Caldeirão | 2 |
| Olho Gordo | 3 |

**Sabá** é a sexta raiz, mas não possui `REQUER` nem movimentos dependentes. Essa tabela representa apenas a árvore de `REQUER`, não subclasses ou seleção de patrono. Os movimentos de Maldição, Magia Simpática, Caldeirão, Olho Gordo e Sabá **não exigem Pacto** no texto original.

A cadeia **Mais Uma Invocação → Invocador Místico → Rajada Mística → Pacto** foi preservada. O cliente diagnostica toda a cadeia, sem autorizar compra ou fornecer habilidades automaticamente. O movimento Pacto conserva a escolha de Patrono e suas condições ficcionais originais, sem padronização cosmológica indevida.

## Arquivos e consultas

| Finalidade | Arquivo |
| --- | --- |
| Fonte integral versionada (JSON gzip determinístico) | `data/lore/hack-carcaca-dw-bruxo-integrais.json.gz` |
| Extrator auditável do DOCX | `scripts/extrair_bruxo_docx.py` |
| Catálogo de distribuição | `dist/carcaca/hack-warlock-movements.json` |
| Índices de requisito | `dist/carcaca/hack-warlock-movement-indexes.json` |
| Cliente de consulta | `src/carcaca-client.mjs` |
| Validação estrutural | `scripts/validar_curadoria.py` |

```javascript
const all=await atlas.getWarlockMovements(); // 49
const pactos=await atlas.searchWarlockMovements({
  raizDependencia:"movimento-classe:paragrafo-2454"
}); // 30 descendentes
const cadeia=await atlas.getWarlockRequirementPreview("movimento-classe:paragrafo-2527",{
  movimentosPossuidos:["movimento-classe:paragrafo-2454"]
});
// A cadeia aponta Invocador Místico e Rajada Mística como ausentes;
// habilitado_para_compra === null
```

## Limites de homologação

Os textos estão em `estado:transcricao_integral_sem_revisao_mecanica`, `aplicacao_canonica:false`. `REQUER` permanece obrigatório, inclusive nos movimentos concedidos gratuitamente por outro movimento. Este ciclo não altera fichas, personagens, campanhas ou o cânone da Carcaça.
