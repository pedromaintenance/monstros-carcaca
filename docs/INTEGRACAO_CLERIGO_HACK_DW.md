# Integração integral de Clérigo — Hack Carcaça Dungeon World

**Ciclo:** 27/10/2026. **Fonte:** `Hack Carcaça Dungeon World(1).docx`, SHA-256 `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`.

## Integridade

A transcrição integral cobre os **37 movimentos** de CLÉRIGO, os parágrafos DOCX 2056–2126 (zero-based), **26 opções**, **68 trechos textuais** e **19 REQUER literais de alvo direto**. Não há concessões gratuitas literais nessa seção. A próxima classe é DRUIDA (parágrafo 2128).

## Dependências por linhagem documental

As dezenove dependências se distribuem em **seis raízes** com vínculos exatos:
- **Sacerdote:** 5 movimentos dependentes
- **Presságio:** 2 dependentes
- **Runa:** 5 dependentes, incluindo PELE ESCRITA, que depende imediatamente de RUNA VIVA
- **Espíritos Estão por Toda Parte:** 1 dependente
- **Empreste Seu Corpo:** 1 dependente
- **Círculo de Convocação:** 5 dependentes

Essas são **raízes mecânicas de pré-requisito**, não subclasses ou religiões inventadas. Clérigo inclui diferentes rituais e práticas no manuscrito; a disponibilidade de um ramo não torna todos os demais dependentes de Sacerdote.

## Arquivos

| Uso | Arquivo |
| --- | --- |
| Transcrição versionada (JSON gzip) | `data/lore/hack-carcaca-dw-clerigo-integrais.json.gz` |
| Extrator | `scripts/extrair_clerigo_docx.py` |
| Catálogo integral distribuído | `dist/carcaca/hack-cleric-movements.json` |
| Índices e raízes | `dist/carcaca/hack-cleric-movement-indexes.json` |
| Gerador e validador | `scripts/gerar_indices_curadoria.py`, `scripts/validar_curadoria.py` |
| Cliente ESM | `src/carcaca-client.mjs` |

## Consultas

```javascript
const all=await atlas.getClericMovements(); // 37
const runicos=await atlas.searchClericMovements({raizDependencia:"movimento-classe:paragrafo-2089"});
const cadeia=await atlas.getClericDependencyChain("movimento-classe:paragrafo-2100",{
  movimentosPossuidos:["movimento-classe:paragrafo-2089"]
});
// Identifica RUNA VIVA ausente; habilitado_para_compra === null.
```

**Critérios:** nenhuma compra é autorizada, nenhum movimento é concedido gratuitamente sem fonte e nenhuma mecânica é homologada por extração automática. O texto preserva `estado:transcricao_integral_sem_revisao_mecanica`, `aplicacao_canonica:false` e proveniência do parágrafo de origem.
