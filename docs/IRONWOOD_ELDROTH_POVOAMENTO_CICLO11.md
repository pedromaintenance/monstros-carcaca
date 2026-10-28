# Povoamento XI — Ironwood e Eldroth: resistência, abrigo e memória

**Estado:** proposta narrativa (40 entradas). **Aprovação autoral:** não. **Aplicação automática ao cânone ou às campanhas:** não.

## Continuidade do povoamento X

O ciclo anterior investigou a resistência de Thargrid como sociedade livre sob ameaça, acolhendo refugiados, com uma mensageira proposta chamada **Vaelis das Folhas Cifradas**. Este ciclo segue a possibilidade de correspondência com **Ironwood**, sem colocar a fortaleza sob uma cadeia de comando de Thargrid, nem tornar a circulação de Vaelis um fato consumado.

O Atlas possui região canônica `regiao:eldroth`; Ironwood permanece ligado à geografia documentada ao sul de Thargrid. **Não** se deve deslocar Ironwood para o interior de Eldroth simplesmente para reunir o módulo sob um tema comum.

## Fatos conhecidos e o que não sabemos

- **Eldroth:** floresta na asa direita de Golzdov, vigiada e governada por **Lady Sylara Nightwhisper**; a resistência sofre perseguição.
- **Vandar:** ruínas controladas por **Lord Damaris Blackthorn** e por mortos-vivos.
- **Ironwood:** fortaleza de patrulheiros e druidas conduzidos por **Elara Stormoak**, que empregam guerrilha, sabotagem e proteção de sobreviventes.
- Existem pessoas deslocadas pela ocupação, mas ainda **não** temos números, itinerários individuais, taxas de sobrevivência ou localização precisa de cada abrigo.
- As três sementes vindas da primeira rodada de povoamento regional — **Correio das Raízes Molhadas**, **Velório dos Insepultos** e **Escola das Trilhas que Somem** — seguem `proposta_de_povoamento`. Nenhuma delas foi transformada em organização real.

## Estrutura de 40 propostas

| Categoria | Quantidade | Exemplos |
|---|---:|---|
| Microespaços | 5 | Pouso das Bainhas Viradas; Canteiro da Lua Ferida; Sala dos Nomes Frios |
| Coletivos | 5 | Remendadores da Seiva Negra; Copistas do Último Nome |
| Pessoas | 8 | Sava Pó-de-Musgo; Elian Chuva-Fina; Eron Sem-Última-Palavra; Vaelis |
| Dilemas | 4 | A Árvore que Pode Ouvir; O Fugitivo com Selo da Corte |
| Fluxos hipotéticos | 5 | Aviso sem Rastro; Nome que Chega sem Corpo |
| Acordos não assinados | 4 | Prova antes da Pira; Abrigo não É Juramento |
| Cenas | 6 | O Pássaro que Não Cantou; O Velório sem Corpo |
| Arcos | 3 | Voltar Não É Entregar; A Floresta Guarda Testemunhas; Salvem as Árvores, Salvem as Pessoas |

**Conflito material central:** uma rede clandestina precisa cultivar, acolher, defender e preservar memória; porém a coleta de dados, a vigilância e a centralização que parecem úteis para a defesa também podem entregar os sobreviventes aos ocupantes. Os personagens devem decidir como manter a solidariedade sem reproduzir estruturas coloniais.

## Relacionamentos e proveniência

- O arquivo-fonte é `data/propostas/ironwood-eldroth-resistencia-hack.json`.
- Todos os 40 registros têm **IDs imutáveis**, rotina, tensão social, `estado: proposta_nao_canonica`, vínculos verificáveis com as três sementes e referências a movimentos já indexados no Hack.
- Os movimentos da tradição dos **elfos da floresta** (`paragrafo-1002` a `paragrafo-1006`) e a tradição **shadow fey** são **inspirações**; não constituem compra de habilidade, atribuição a NPC ou dispensa de `REQUER`.
- **Vaelis** é uma continuação editorial da pessoa proposta em Thargrid (`reutiliza: thargrid-social:pessoa:vaelis`), sem nova localização factual.
- Os fluxos são explicitamente `efetivado:false`, `quantidade_confirmada:false`, `rota_operacional:false`. As cenas usam `ocorreu:false`; os acordos `vigente:false`; os arcos `resultado_confirmado:false`.

## API de consulta

```js
const atlas=createCarcacaAtlas({baseUrl:"https://raw.githubusercontent.com/pedromaintenance/monstros-carcaca/main/dist/carcaca"});
const documento=await atlas.getIronwoodEldrothResistance();
const indice=await atlas.getIronwoodEldrothResistanceIndexes();
const sobreviventes=await atlas.searchIronwoodEldrothResistance({
  categoria:"pessoas",povo:"elfa_da_floresta"
});
const marco=await atlas.getIronwoodEldrothEntity(
  "ironwood-eldroth:acordo:refugio-sem-obediencia"
);
```

Filtros: `categoria`, `povo`, `ambiente`, `funcao`, `setor`, `movimentoHack`, `vinculo` e `query`. A consulta é somente leitura; nenhum método confirma um acordo ou grava um evento.

## Para a próxima iteração

1. Investigar a relação material entre **refugiados e abastecimento florestal** sem números inventados.
2. Confrontar canonicamente os relatos do Hack e as fontes cartográficas sobre **Ironwood, Eldroth e Vandar**.
3. Propor encontros de **Dungeon World** com instintos e consequências graduais, conservando a separação entre monstros curados e NPCs sociais.
4. Só depois de avaliação autoral, promover individualmente elementos narrativos; nunca promover o lote inteiro por padrão.
