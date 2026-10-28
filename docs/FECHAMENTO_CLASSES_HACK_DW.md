# Fechamento dos movimentos de classe — Hack Carcaça Dungeon World

## Auditoria de cobertura

**632/632 movimentos (100%)**, pertencentes a **18 grupos** inventariados no DOCX original. O inventário possui IDs estáveis `movimento-classe:paragrafo-XXXX`. A geração falha caso um ID fique ausente, duplicado ou fora da fonte.

O fechamento final engloba três grupos, três movimentos cada:

| Grupo | Parágrafos zero-based | Movimentos | Opções | REQUER |
| --- | --- | ---: | ---: | ---: |
| Escriba Yokai | 2812–2814 | 3 | 0 | 0 |
| Nobre | 2816–2818 | 3 | 0 | 0 |
| Arqueólogo | 2820–2822 | 3 | 0 | 0 |
| **Total do fechamento** | | **9** | **0** | **0** |

O checksum SHA-256 do manuscrito original utilizado para esses movimentos e para o inventário é `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`. Esse identificador refere-se ao arquivo-fonte anexado e não modifica a emenda autoral já registrada na seção do Artífice.

## Fontes, distribuição e API

As fontes versionadas estão em `data/lore/hack-carcaca-dw-escriba-yokai-integrais.json`, `data/lore/hack-carcaca-dw-nobre-integrais.json` e `data/lore/hack-carcaca-dw-arqueologo-integrais.json`.

O extrator `scripts/extrair_classes_finais_docx.py` reconstitui os arquivos usando o DOCX autoral e o inventário. O pipeline publica as três listas legíveis e seus índices em `dist/carcaca/hack-yokai-scribe-*.json`, `hack-noble-*.json` e `hack-archaeologist-*.json`.

```javascript
const escribas=await atlas.getYokaiScribeMovements();
const cortes=await atlas.searchNobleMovements({titulo:"protocolo"});
const ruinas=await atlas.searchArchaeologistMovements({query:"contexto"});
const movimento=await atlas.getFinalClassMovement("movimento-classe:paragrafo-2822");
```

Os grupos não possuem `REQUER` literal. Nenhuma dependência foi inferida ou aplicada a partir da ficção.

## Pendência editorial sem modificação de fonte

O movimento **CAMADAS** (parágrafo 2820) contém uma aspa inicial `‘` isolada antes de “Quando”, preservada na transcrição original e sujeita a confirmação do autor. Não se alterou essa grafia automaticamente.

## Limites da conclusão

**100% de cobertura documental não significa 100% de revisão ou homologação de regras.** Todos os novos movimentos têm `texto_integral_conferido:true`, `estado:transcricao_integral_sem_revisao_mecanica` e `aplicacao_canonica:false`. O atlas é fonte de consulta, não altera fichas, compras ou campanhas.
