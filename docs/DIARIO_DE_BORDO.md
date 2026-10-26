# Diário de bordo — Monstros da Carcaça

## 2026-10-26 · Ciclo 1 (concluído anteriormente)

- Fundação: 14 tipos de criatura autorais da Carcaça independentes dos tipos D&D.
- Regiões piloto: Foz, Costa Sul e Eldroth; sete lugares, três agrupamentos/facções de indexação.
- Duas criaturas: Jorō e Gharoz.
- Uma frente proposta sobre a Lança da Perdição e um assentamento de Portomonte parcialmente especificado.
- Validação por JSON Schema e referências por IDs.

## 2026-10-26 · Ciclo 2 (este incremento)

**Conteúdo lido:** `Arquivo dos Mortos Afogados.docx`, fichas de Akaname do Espelho Fundo e Kappa-Escribas Afogados, e `dungeon-world-divisoria-do-mestre-biblioteca-elfica.pdf` como referencial das práticas de movimentos do MJ.

**Conteúdo adicionado:**
- Akaname — yokai singular do Arquivo; ficha autoral CR 10 / CA 17 / PV 168; instinto e três movimentos DW propostos.
- Kappa-Escribas — grupo yokai de manutenção ritual; ficha autoral CR 7 / CA 16 / PV 95; instinto e três movimentos DW propostos.
- Preservada incerteza: origem genealógica dos Kappa não é fechada; associação a uma facção formal dos guardiões é **inferência de indexação**.
- Arquivos de consulta: gerador determinístico, cliente ESM, testes unitários, artefatos `dist/carcaca/`.
- Validador ampliado a todos os JSON em `curadoria/criaturas`, `curadoria/frentes` e `curadoria/assentamentos`, com integridade de referências cruzadas.
- GitHub Actions: valida, testa, regenera artefatos e publica snapshot autoral sem modificar `dist/creatures/`.

**Escopo mantido:** nenhuma alteração em `pedromaintenance/peren-o-bruxo`, nos 222 parâmetros de jogo, ou nas 2.021 variantes de D&D.

**Próximo lote proposto:** Veren Marés-Rubras e Morgat, combinando curadoria de cosmologia demoníaca e relações políticas; Lampreias depois. Atualizar M1 como concluído quando publicação e testes de Actions confirmarem sucesso.

## Decisões para não esquecer

1. Quando um grupo é mencionado em texto como linhagem ou tradição, isso não prova organização política formal.
2. A ficha de Dungeon World usa instinto/movimentos derivados da ficção, não transformação de atributos D&D.
3. Regiões exigem fonte; não criar habitats de fantasia genéricos como fatos estabelecidos.
4. Fatos da campanha e presságios ainda não realizados pertencem a estados diferentes.

### Verificação final do ciclo 2

Workflow: https://github.com/pedromaintenance/monstros-carcaca/actions/runs/40420863395

Resultado observado: **success** em todas as etapas de checkout, Python, Node, JSON Schema, testes JavaScript, geração, conferência e publicação.

Snapshot publicado: `dist/carcaca/manifest.json` indica 4 criaturas, 3 regiões, 7 lugares, 3 facções, 1 frente e 1 assentamento. `dist/carcaca/catalog.json` relaciona Jorō, Gharoz, Akaname e Kappa-Escribas.

**Marco M1 (núcleo 0.1)** concluído: consultas por nome, tipos, região, lugar, facção e estado; indexação reproduzível e cliente consumível por jogos. Continuidade de M2: 3 fichas restantes do Arquivo.
