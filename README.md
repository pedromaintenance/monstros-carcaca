# Monstros da Carcaça

Banco de criaturas compartilhado pelos jogos ambientados na **Carcaça**.

**O projeto tem duas camadas independentes:** um acervo importado de fichas licenciadas de D&D e similares (`dist/`) e uma **curadoria autoral** (`curadoria/`) que dá às criaturas identidade, ecologia, regiões e movimentos inspirados em Dungeon World.

## Comece por aqui

- [ROADMAP.md](ROADMAP.md) — milestones e critérios de aceite, execução em lotes pequenos.
- [docs/ONTOLOGIA_E_DUNGEON_WORLD.md](docs/ONTOLOGIA_E_DUNGEON_WORLD.md) — tipos de criatura, instintos, frentes e assentamentos.
- [data/taxonomia_carcaca.json](data/taxonomia_carcaca.json) — Tipo de Criatura da Carcaça, separado da referência D&D.
- [data/regioes_carcaca.json](data/regioes_carcaca.json), [data/lugares_carcaca.json](data/lugares_carcaca.json) e [data/faccoes_carcaca.json](data/faccoes_carcaca.json) — vocabulários de geografia e relações.
- [curadoria/criaturas/arquivo-dos-mortos-afogados.json](curadoria/criaturas/arquivo-dos-mortos-afogados.json) — 2 pilotos (Jorō e Gharoz).
- [curadoria/frentes/disputa-pela-lanca.json](curadoria/frentes/disputa-pela-lanca.json) — frente de Dungeon World **proposta**, não fatos já ocorridos.
- [curadoria/assentamentos/portomonte.json](curadoria/assentamentos/portomonte.json) — assentamento piloto com campos desconhecidos nulos.
- [docs/FONTES_E_LICENCAS.md](docs/FONTES_E_LICENCAS.md) e [docs/CURADORIA_E_LICENCAS.md](docs/CURADORIA_E_LICENCAS.md) — licença, atribuição e política de conteúdo.

## Consumo pelos jogos

As fichas importadas estão em `dist/manifest.json`, `dist/catalog.json` e `dist/creatures/`.
O cliente existente é `src/client.mjs` (ESM), com `createBestiary`, `toPerenDraft`, `getGameData` e `getPerenLinks`.

A curadoria de Dungeon World ainda não substitui nem altera automaticamente os 222 monstros jogáveis de Peren. Sua futura integração será uma etapa do roadmap.

## Qualidade

```bash
python -m pip install 'jsonschema>=4,<5'
python scripts/validar_curadoria.py
python scripts/sincronizar.py  # opcional; depende de rede, atualiza somente dist/
python scripts/validar.py
```

As duas pipelines são separadas: a importação das fontes não deve apagar ou alterar a curadoria manual.
