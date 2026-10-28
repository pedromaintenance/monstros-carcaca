# Povoamento vivo da Carcaça — sementes inspiradas no Hack

## Objetivo

**Preencher a vida entre as grandes fortalezas, florestas e ruínas da Carcaça.** O Hack não serve aqui para avaliar equilíbrio de classes. Seus movimentos de povo e classe funcionam como testemunhos de ofícios, valores e práticas que podem existir no continente. São **possibilidades de mundo**, não efeitos automáticos nem prova de que tais assentamentos já existem.

O repositório contém **16 núcleos narrativos propostos em oito áreas**, cada um com pessoas, economia cotidiana, tensão política e escolha real para aventuras. Os pontos que constam do material autoral são identificados no campo `ancora_documentada`; os novos nomes, NPCs e microlocalidades são imaginação derivada, ainda sujeita à aprovação do autor.

## Três tramas que conectam o continente

### 1. Quem tem direito de nomear?
O **Cartório das Portas Raspadas** (Garganta) identifica nomes de propriedade escondidos sob inscrições antigas. A **Balsa dos Nomes Descartados** (Rio Ancestral) precisa decidir quando preservar ou destruir uma lista de passageiros. A **Escrivania da Foz** questiona a autoridade documental de Ulorian em Gualápolis. E as **Salas do Favor Não Pago** (Shadar-Riverie) negociam, sob etiqueta impecável, quem pode reivindicar tais registros. Não é uma organização única confirmada: são quatro pontos narrativos que podem compor a mesma campanha.

### 2. Quem paga pela água?
O **Poço Sem Bandeira** (Caatinga) tenta impedir que grupos armados privatizem uma fonte de sobrevivência. As **Hortas do Sal Devolvido** (Portomonte) disputam turnos de água para plantio, não necessariamente para consumo humano. A **Feira das Ferragens Trocadas** vende ferramentas de defesa e de pilhagem; o **Pátio do Soldo Que Não Veio** (Drakport) demonstra o custo político das cadeias de fornecimento. Nem todo orc é saqueador e a Corte não controla diretamente o Além Sul.

### 3. O que preservar durante a ocupação?
O **Correio das Raízes Molhadas** (Eldroth) usa a inspiração de Rede Micelial para imaginar mensagens clandestinas. O **Velório dos Insepultos** (Vandar) luta pelo direito de nomear os mortos sob a ameaça de Damaris. A **Escola das Trilhas que Somem** (Ironwood) ensina uma guerrilha que protege pessoas, não apenas rotas. O **Conselho dos Juramentos Quebrados** (Thargrid) negocia proteção aos refugiados que não pertencem a clã nenhum.

## Demais núcleos em destaque

- **O Turno das Escavadoras (Garganta):** o salário dos escavadores depende de destruir camadas que poderiam refutar a narrativa da ocupação.
- **O Farol das Memórias Emprestadas (ilhas da Costa Sul):** relatos de viagens tortles e tabaxis produzem mapas que também podem comprometer os mosteiros.
- **A Feira da Trégua Improvável (Boca do Abismo):** nativos e ocupantes cooperam provisoriamente contra demônios, sem transformar Ulorian em benfeitor.
- **O Ateliê das Máscaras Legíveis (Shadar-Riverie):** trabalhadores usam vestimentas e glamour para rastrear dívidas invisíveis da aristocracia.

## Regras de continuidade

1. **Não cadastrar automaticamente novas cidades no mapa:** todos os lugares e personagens acima são propostas, mesmo quando a área geral é conhecida.
2. **Não confundir abissais marinhos com demônios do Abismo:** a origem e a teologia são diferentes.
3. **Não tratar povos como facções uniformes:** kuo-toa, orcs, shadow fey e quaisquer outros povos incluem indivíduos com conflitos e interesses distintos.
4. **Não inferir subsistência ou números de população como fatos:** o cenário ainda possui lacunas materiais relevantes.
5. **Não atribuir automaticamente movimentos do Hack aos NPCs:** os movimentos são fontes de inspiração cultural e profissional.
6. **Não alterar campanhas e cânone:** `aprovacao_autoral:false` e `efeito_automatico_no_canon:false` em cada semente.

## Catálogo e API

Dados legíveis: `data/propostas/povoamento-regional-hack-carcaca.json` e `dist/carcaca/regional-population-proposals.json`.

Índices: `dist/carcaca/regional-population-proposal-indexes.json`, com `by_area`, `by_tema` e `by_movimento_hack`.

```javascript
const propostas = await atlas.getRegionalPopulationProposals();
const caatinga = await atlas.searchRegionalPopulationProposals({regiaoAtlasId:"regiao:caatinga"});
const micelio = await atlas.searchRegionalPopulationProposals({
  movimentoHack:"movimento-classe:paragrafo-2177"
});
const cartorio = await atlas.getRegionalPopulationProposal("povoamento-proposto:cartorio-das-portas-raspadas");
```

**Sugestão para próximos ciclos:** escolher uma região de cada vez e desenvolver uma dessas sementes em bairro, rede de ofícios, 3–5 NPCs, calendário de acontecimentos, bens comercializados, segredos e relações com lugares **já documentados**. A aprovação canônica deve ser decisão criativa, não consequência automática de indexação.
