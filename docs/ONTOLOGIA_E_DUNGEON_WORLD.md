# Camadas do bestiário: D&D, Carcaça e Dungeon World

## 1. Regras de leitura

**Tipo D&D** = classificação de referência do conteúdo original (`classification.type` nos importados; `tipo_dnd_referencia` nos pilotos). **Tipo Carcaça** = ontologia própria dos nossos jogos (`tipo_carcaca`), com vocabulário em `data/taxonomia_carcaca.json`.

A criatura pode ter simultaneamente um tipo D&D `fey`, um Tipo Carcaça `yokai`, uma facção `guardioes_yokai` e o papel de `guardião`. Isso não é redundância: cada campo responde a uma pergunta diferente.

A origem do dado é obrigatória. Não atribuir distribuição regional com base no habitat genérico de D&D. `habitat` genérico é contexto; `ocorrencias[].regiao_id` exige referência da lore ou registro explícito como hipótese.

## 2. Três objetos diferentes inspirados em DW

**Criatura:** instinto (verbo + intenção), movimentos ficcionais, qualidades especiais, organização/tags e, numa etapa posterior, ficha mecânica DW criada segundo as perguntas do jogo.

**Frente:** agrupa perigos, seus impulsos, presságios sombrios e desastre iminente, com perguntas em aberto e elenco. `pressagios_propostos` nunca são cronologia canônica. Jorō pode figurar numa frente como guardiã sem ser um perigo maligno.

**Assentamento (steading):** população, prosperidade, defesas e outras tags DW. Os valores não são deduzidos de frases como “grande assentamento”. Ex.: Portomonte mantém esses campos `null` até curadoria.

## 3. Cânone versus proposta

- `documentado`: declarado na fonte do projeto.
- `inferido`: interpretação plausível, jamais promovida automaticamente.
- `proposto`: sugestão de design/encounter/movimento DW.
- `incerto`: fonte ambígua ou contraditória.
- `pendente` / `null`: ainda não sabemos.

Os instintos e movimentos dos pilotos são **adaptações novas e revisáveis**, não citações do Dungeon World nem novas afirmações canônicas.

## 4. Três nomes que não podemos confundir

- **Abismo**: contexto de ameaça demoníaca da foz.
- **Abissais marinhos**: seres das profundezas do Mar de Sangue, não inferir natureza demoníaca.
- **Meio-demônio**: ancestralidade de sangue misto, não uma cosmologia separada.

A ficha original do Gharoz usa o termo “corruptor (demônio)”; mantemos esse termo como dado de origem e o Tipo Carcaça como `demonio`, sem converter “corruptor” em uma categoria oficial de D&D.

## 5. Fontes

Consulte `data/fontes_projeto.json`, com referências à lore e ao SRD de Dungeon World. Original do Dungeon World: https://www.dungeonworldsrd.com/monsters/, https://www.dungeonworldsrd.com/gamemastering/fronts/, https://www.dungeonworldsrd.com/gamemastering/the-world/.
