# Ciclo XXXIV — Geografia física de Golzdov

## Por que esta etapa é macro

A Carcaça é literalmente um continente formado sobre Golzdov, o Dragão Ancestral morto. A sua anatomia informa as grandes regiões, mas **não basta para preencher um mapa com cidades, estradas ou coordenadas**.

O objetivo deste ciclo é distinguir cuidadosamente **orientação cardeal**, **anatomia do corpo**, **relações espaciais relativas** e **posições desconhecidas**, tornando os termos do manuscrito inspecionáveis em uma estrutura única.

Nova fonte estruturada: [geografia-fisica-ciclo34.json](../data/atlas/geografia-fisica-ciclo34.json) — **20 marcos físicos/históricos**, **12 vínculos espaciais explícitos** e **9 questões autorais pendentes**.

Não há mapa topográfico novo nem revisões de cânone. Cada marco remete ao capítulo I paginado e, onde existe lugar estruturado correspondente, usa seu mesmo ID da árvore.

## O que está orientado pelo manuscrito

| Referência física | Orientação ou relação conhecida | Fonte |
|---|---|---|
| Crânio e Garganta | **Extremo leste**; cidade-fortaleza no crânio | Hack pp. 2, 4 |
| Rio Ancestral | Atravessa o continente e **termina no Abismo** | Hack pp. 4–5 |
| O Abismo | **Extremo oeste**, queda colossal e ruptura entre mundos | Hack pp. 5, 8 |
| Templo das Sombras | **Margem norte do Abismo**; antiga sede da Rainha, destruída | Hack pp. 5, 9 |
| Gualápolis | **Margem sul do Abismo**, antiga capital nativa | Hack pp. 5–6, 10 |
| Boca do Abismo | Fortaleza fundada por Ulorian sobre a antiga Gualápolis | Hack pp. 5–6 |
| Montanhas de Thargrid | **Norte**; Reino Sob a Montanha | Hack p. 6 |
| Ironwood | **Ao sul das montanhas**, na floresta; distância e limites desconhecidos | Hack p. 6 |
| Eldroth e Vandar | Região da **asa direita**; NÃO se presume que 'direita' signifique leste | Hack p. 5 |
| Caatinga e Costa Sul | Terras áridas e litoral do **Além Sul** | Hack p. 5 |
| Templo da Lua | Ilha no Rio Ancestral, sem localização longitudinal | Hack p. 4 |
| Mar de Sangue e águas azuis | Litoral e mar corrompido; águas azuis **além**, sem linha divisória cartografada | Hack pp. 5, 15 |
| Cauda e Templo do Crepúsculo | Palácio sobre a cauda, **do outro lado do Abismo**; acesso e orientação não determinados | Hack pp. 5–6, 8 |

### Anatomia do continente

O crânio é um marco oriental; a asa direita acolhe Eldroth e Vandar; a **coluna dorsal** contém historicamente uma fortaleza erguida por Voragar em 886 EC; reinos antigos ocuparam **costelas e cavernas**; a cauda sustenta o Templo do Crepúsculo.

Porém, estas afirmações **não** autorizam reconstruir a silhueta total de Golzdov, indicar onde se encontra a asa esquerda ou ligar a fortaleza de Voragar a um dos atuais setores sem decisão editorial.

## Conflitos e lacunas

1. **Asa direita:** orientação anatômica, sem tradução comprovada para leste/norte.
2. **Coluna dorsal:** fortaleza histórica de Voragar não possui endereço ou setor atual.
3. **Grama-Cortada:** condado conhecido, localização desconhecida no continente.
4. **Shadar-Riverie/Gualápolis/Boca:** sobreposição de descrições que exigirá reconciliação de autoria.
5. **Rio Ancestral:** nascente não individualizada.
6. **Templo da Lua:** ilha conhecida, trecho do rio não determinado.
7. **Cauda:** 'do outro lado' do Abismo não informa ponte, caminho ou direção cardeal.
8. **Ironwood/Thargrid/Eldroth:** localização relativa conhecida, fronteiras e contiguidade não fixadas.
9. **Mar de Sangue:** limite com as águas azuis não é um polígono conhecido.

O manuscrito também menciona reinos nas costelas, sem particularizar ruas ou núcleos antigos que possam ser situados no mapa atual. Isso fica explícito no índice.

## Interface em Pages

O Atlas passa a mostrar, **acima dos cartões regionais**:

- **Orientação continental:** grupos Leste, Oeste, Norte e Sul + posições relativas / sem orientação fixa.
- **Anatomia de Golzdov:** referências a crânio, asa direita, coluna, costelas e cauda, sem projetar o corpo em uma geometria inventada.
- **Relações espaciais:** 12 vínculos classificados, com ressalva quando uma relação é documental e não topográfica.
- **Questões abertas:** nove perguntas com página do manuscrito.
- **Inspetor:** cada marco mostra sua descrição, fonte, status, relações e atalho para sua posição na árvore hierárquica.

A sequência dos cartões **não é um mapa em escala**: a interface evita deliberadamente coordenadas falsas, cálculos de distância e animações que insinuem trajetos reais.

## Próxima camada macro

Depois deste ciclo, o ideal é **resolver em diálogo autoral três problemas que impedem uma cartografia coerente**: (1) sobreposição histórica de Shadar/Gualápolis/Boca, (2) posição de Grama-Cortada e (3) relação territorial Ironwood/Thargrid/Eldroth. Sem isso, qualquer mapa político acabado dará uma precisão que o texto não possui.

Se preferirmos ampliar a estrutura antes de responder essas questões, outra continuação segura será um **inventário físico do que ainda não está no mapa** (costelas, cavernas, litoral, arquipélagos, subsolos), marcado integralmente como território não localizado, sem criar novas cidades ou linhas de fronteira.

## Artefatos

- Dados: `data/atlas/geografia-fisica-ciclo34.json`
- Validação: `site/atlas/physical-geography.mjs`
- UI: `site/atlas/physical-geography-ui.mjs`
- Testes: `tests/atlas-macro.test.mjs`
- Workflow de publicação: `.github/workflows/publicar-atlas-pages.yml`

**Proteções:** fonte paginada; nenhuma cidade nova; nenhum demônio/Abissal marinho confundido; nenhum efeito mecânico DW modificado; nenhuma lacuna autoral resolvida automaticamente.

Acesso: https://pedromaintenance.github.io/monstros-carcaca/atlas/
