# Ecossistema material de assentamentos — Carcaça v0.1

O bestiário passa a mapear **condições de permanência** e não apenas pontos no mapa: água, alimento, abrigo, materiais, produção, rotas de abastecimento, ameaças e formas de continuidade populacional.

## Dungeon World como referência

As *steadings* de Dungeon World são comunidades relativamente estáveis com habitação. Possuem Prosperidade, População e Defesas; rótulos adicionais tratam de Recursos, Necessidades, Comércio, Religião, Juramentos e Inimizade. Seus valores mudam conforme o mundo muda — comércio interrompido, captura de recursos, colapso ou auxílio. Fonte: https://www.dungeonworldsrd.com/gamemastering/the-world/

**Carcaça estende, não substitui, esse modelo.** Mantemos os campos oficiais em `tags_dw` e os rótulos autorais separados em `rotulos_carcaca`. Não convertemos as categorias DW a partir de expressões vagas como “grande assentamento”.

Nem todo covil é uma steading: cavernas habitadas por múltiplas comunidades podem ser representadas como **rede de abrigos**, sem atribuir prosperidade ou população a uma cidade imaginária.

## Mínimo vital: seis perguntas

1. **Água** — onde o grupo obtém água e como a trata? Água de habitat não é necessariamente água potável.
2. **Alimento** — planta, caça, coleta, troca, saqueia, absorve mana ou energia psíquica? Se não consta da fonte, deixar desconhecido.
3. **Abrigo** — onde dorme, se resguarda, é defendido e permanece? O que mudaria se perdesse o abrigo?
4. **Continuidade** — nascimentos, migração, conversão, reprodução sobrenatural ou outros meios? *Nunca presumir* reprodução biológica universal.
5. **Recursos, trabalho e resíduos** — o que transforma ou consome e qual o efeito na paisagem?
6. **Conflito e conexão** — que rotas atravessa, quem disputa os recursos, quais ameaças ou alianças estão documentadas?

Sem medidas de população, quantidades de comida, duração do ritual ou capacidade militar nas fontes, manter nulo.

## Rótulos próprios: proposta de vocabulário

O vocabulário está em `data/rotulos_assentamentos_carcaca.json`. Os rótulos **descrevem** e podem sugerir gatilhos narrativos, mas as consequências enumeradas são *propostas*. Eles NÃO concedem modificadores de Dungeon World automaticamente.

Exemplos que agora têm suporte na lore:
- `agua_sangrenta_purificada`: no templo de Deméter, a água do Mar de Sangue é purificada.
- `lavoura_sobre_pedra`: Portomonte cultiva em superfícies normalmente hostis.
- `enclave_dos_penhascos`: a geografia esconde e abriga Portomonte.
- `devocao_daegon`: comunidades kuo-toa da Costa Sul veneram Daegon.
- `guerra_liturgica`: incursões em busca de pessoas para sacrifício, não simples pilhagem.

Outros rótulos (ruína habitada, ocupação feérica, ossário habitável etc.) aguardam aplicações curadas em regiões apropriadas.

## Primeiro ecossistema: Costa Sul

### Portomonte

**Documentado:** povoação humana entre penhascos, produção agrícola viabilizada por purificação da água no templo de Deméter e comércio com outros assentamentos da costa.

**Indeterminado:** populações, defesa, disponibilidade de alimento por pessoa, água doméstica, reprodução demográfica, duração/alcance do rito de purificação.

**Hipótese de jogo, não fato:** se a purificação cessar, a agricultura pode perder sua principal condição excepcional; isso produz pressão sobre as rotas de abastecimento.

### Cavernas kuo-toa da Costa Sul

**Documentado:** Kuo-Toa ocupam cavernas da costa e cidades subaquáticas; veneram Daegon; realizam incursões de captura com objetivo sacrificial.

**Indeterminado:** número de cavernas, localização de cidades individuais, dieta, água potável, população, defesas ou reprodução. **Não** tratar as pessoas capturadas como recurso alimentar, nem pressupor que todos os Kuo-Toa participem de toda incursão.

**Observação:** `assentamento:rede-cavernas-kuo-toa-costa-sul` representa vários abrigos conhecidos coletivamente. Não é uma cidade única e não recebe classificação DW até que uma comunidade distinta seja delimitada.

## Rede de fluxos

`data/fluxos_costa_sul.json` registra três processos: **purificação de água para lavoura**, **comércio costeiro** e **incursões sacrificiais**. Destinos desconhecidos ficam sem IDs de assentamento; isso evita inventar rotas comerciais com rivais.

`curadoria/assentamentos/` guarda o material editorial. `dist/carcaca/` distribui os dados para jogos; uma atualização de campanha não pode reescrever o cânone.

## Próximo lote

Aprofundar **as comunidades insulares tortles/tabaxis**, mas identificar ilhas, alimentos, rotas e tradições somente após curadoria das fontes. Iniciar ciclos de prosperidade e falta (*Want*, *Trade*, *Capture*, *Aid*) apenas como cenários simulados, não mudanças canônicas ocorridas.

**Fontes:** `Ambientação - A Carcaça - Visão Geral.txt` (Costa Sul); Dungeon World SRD `The World`, https://www.dungeonworldsrd.com/gamemastering/the-world/. 
