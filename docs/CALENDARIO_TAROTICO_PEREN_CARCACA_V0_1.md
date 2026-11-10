# Calendário tarótico de Peren — incorporação à lore da Carcaça (v0.1)

**Estado da fonte:** criação interpretativa proposta em conversa, sem calendário natal nem datas de nascimento definidas.

**Natureza desta integração:** transcrição fiel de uma proposta presente no dossiê de Peren para consulta no repositório principal de lore. **Não é uma homologação de calendário civil completo, nem substitui a Era da Carcaça (EC).**

Fonte primária: [Dossiê de Peren Kerrhylon, versão 1.0.0](https://github.com/pedromaintenance/peren-o-bruxo/blob/main/lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json), seção `sistema_tarot_sugerido`. Identificador do blob de origem: `14e6e391f1a02a4bbc123bf55902fd1bba7d345b`.

Dados estruturados: [JSON deste registro](../data/worldbuilding/calendario-tarotico-peren-v0.1.json). Cronologia de anos existente, mantida: [`data/lore/hack-carcaca-dw-cronologia.json`](../data/lore/hack-carcaca-dw-cronologia.json).

## 1. Princípio estabelecido no dossiê de Peren

> um arcano maior representa o mês; um arcano menor representa o dia; outro arcano menor representa a hora; planeta colore a regência

O Tarô constitui uma **linguagem simbólica de marcação e interpretação temporal**. A fonte atribui o **mês** a um Arcano Maior, o **dia** a um Arcano Menor e a **hora** a outro Arcano Menor. A **regência astrológica** acrescenta significado à leitura. Isso não basta, por si só, para calcular datas: não há quantidade de meses por ano, numeração de dias, duração de horas, ordem de arcanos ou conversão para EC especificadas.

| Unidade | Referência simbólica | O que o registro permite afirmar |
|---|---|---|
| Mês | Arcano Maior | Há associação interpretativa de um arcano ao mês, sem lista completa de meses |
| Dia | Arcano Menor | Há associação interpretativa de um arcano ao dia, sem duração de mês |
| Hora | Outro Arcano Menor | Há uma referência horária simbólica, sem relógio de horas definido |
| Regência | Astros simbólicos | A regência colore a leitura, sem regra de cálculo comprovada |

## 2. Os sete astros propostos e seus domínios

| Astro | Domínio na fonte |
|---|---|
| **Lua Negra** | sonhos, medo e memória |
| **Mercúrio-Corvo** | linguagem, contrato e comércio |
| **Vênus de Osso** | vínculos e lealdade |
| **Marte Rubro** | violência e coragem |
| **Júpiter-Coroa** | patronato e hierarquia |
| **Saturno-Ossário** | dívida e limites |
| **Sol Pálido** | exposição e identidade |

A lista é **fechada apenas no recorte presente do dossiê**: sete astros ali propostos. O texto não confirma que sejam planetas físicos, divindades ou entidades cosmológicas, tampouco uma religião comum de toda a Carcaça. Não há calendário sacerdotal ou mapa celeste definido nesta fonte.

## 3. Aplicações interpretativas preservadas

O dossiê registra um exemplo para o familiar **Presas** e quatro exemplos para integrantes da companhia de Peren. Esses exemplos **não são datas de nascimento** e **não autorizam converter cartas em aniversários**. Na própria fonte: as cartas dos companheiros foram atribuídas por personalidade, NÃO derivadas de datas de nascimento

| Personagem | Mês (Arcano Maior) | Dia (Arcano Menor) | Hora (Arcano Menor) | Regência registrada |
|---|---|---|---|---|
| Presas | A Estrela | Pajem de Paus | Dois de Copas | Sol Pálido em Vênus de Osso |
| Veyra Sull | A Justiça | Rainha de Espadas | Dois de Ouros | Mercúrio-Corvo em Saturno-Ossário |
| Dren | O Carro | Sete de Paus | Cinco de Ouros | Marte Rubro em Saturno-Ossário |
| Orel | A Lua | Pajem de Copas | Nove de Copas | Lua Negra em Vênus de Osso |
| Tavin Rook | Temperança | Seis de Espadas | Oito de Ouros | Mercúrio-Corvo em Júpiter-Coroa |

Essas combinações ajudam a reconhecer como o sistema foi usado para caracterizar pessoas. A expressão de regência composta, como **«Sol Pálido em Vênus de Osso»**, foi preservada literalmente; não há base para definir por inferência o que a preposição «em» significa no céu do cenário.

## 4. Elementos necessários antes de formalizar um calendário civil

**1. meses por ano.** O dossiê não fixa quantos meses compõem um ano nem distribui todos os Arcanos Maiores.

**2. ordem dos meses.** O dossiê não fixa sequência, nomes completos ou posição do primeiro mês.

**3. dias por mes.** Não há duração de cada mês nem atribuição completa de Arcanos Menores.

**4. horas por dia.** A hora simbólica não implica quantidade de horas ou duração física de uma hora.

**5. calculo de regencia.** Não há algoritmo para associar os sete astros aos arcanos, a datas ou aos pares de regência dos exemplos.

**6. calendario natal.** As cartas dos companheiros foram atribuídas por interpretação da personalidade, não por nascimento.

**7. marco epocal.** Não se define conversão entre esta linguagem simbólica e a contagem de anos EC.

**8. observabilidade.** Os astros são símbolos no dossiê, sem confirmação de que sejam corpos astronômicos observáveis, deuses ou entidades.

**9. adesao social.** Não está estabelecido que todos os povos da Carcaça reconheçam ou utilizem esse sistema.

**10. efeitos mecanicos.** Não existem regras de presságio, vantagem, magia, iniciativa, testes, feriados ou festivais derivadas automaticamente do calendário.

## 5. Relação com a cronologia da Era da Carcaça

O repositório já organiza **18 marcos** do manuscrito usando a convenção **EC**, em [`data/lore/hack-carcaca-dw-cronologia.json`](../data/lore/hack-carcaca-dw-cronologia.json). Isso representa uma contagem de **anos históricos**, enquanto a proposta de Peren descreve correspondências interpretativas entre cartas, unidades nomeadas de tempo e astros.

Não há uma equivalência documentada entre essas duas camadas. Por isso, **não se converte 999 EC, uma data de campanha ou a idade de Peren em uma combinação de cartas**. A cronologia EC permanece como estava, e a interpretação tarótica permanece rastreável à sua fonte original.

## 6. Como utilizar sem inventar cânone

O mestre e o autor podem referir-se às **associações de arcanos e aos sete astros** como uma ideia de linguagem simbólica surgida na campanha de Peren. O registro ainda **não permite afirmar** que toda a Carcaça organize seus dias assim, que existam doze ou vinte e dois meses, que uma carta represente um dia num ciclo fixo, que os signos sejam determinados pelo nascimento ou que a regência afete mecanicamente magias e testes.

Para uma versão canônica e calculável, ainda seria necessário definir número e duração de meses, sequência de cartas, convenção de horas, cálculo das regências, início do ano, sincronização com EC e grau de adoção por povo ou região. Tais escolhas devem ser **decisões autorais posteriores**, não correções invisíveis feitas nesta importação.

## 7. Controle de integração

- Origem consultada: `pedromaintenance/peren-o-bruxo`, `lore/peren/Dossie_Peren_Kerrhylon_RPG_Carcaca.json`.
- Destino: repositório de lore `pedromaintenance/monstros-carcaca`.
- Importação: sistema tarótico, sete astros e cinco leituras interpretativas; sem inventar regras adicionais.
- Não houve mudança em `data/lore/hack-carcaca-dw-cronologia.json`, nos anos EC, na cronologia de campanhas, no atlas, em `dist/carcaca/` ou na cosmologia canônica.
