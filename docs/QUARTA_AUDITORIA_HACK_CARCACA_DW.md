# Quarta auditoria — movimentos integrais e tabelas do Hack Carcaça DW

**Data:** 27/10/2026  
**Fonte:** `Hack Carcaça Dungeon World.docx` (181 páginas)  
**Escopo:** transcrição integral de dois povos e inventário das tabelas estruturais. Não modifica o cânone do cenário ou saves.

## Síntese de cobertura

| Coleção | Quantidade | Estado |
| --- | ---: | --- |
| Glossário de ambientação | 157 | Verbetes da fonte em revisão |
| Relações de entidades | 26 | Com páginas e âncoras |
| Movimentos parcialmente conferidos | 41 | Títulos e REQUER, sem revisão de efeitos |
| **Movimentos com texto integral** | **12** | Seis Humanos e seis Orcs da Caatinga |
| **Opções recuperadas dos parágrafos de lista** | **4** | Pertencem a Saqueador da Caatinga |
| **Tabelas DOCX** | **33** | Inventário completo por posição |
| Quadros de movimentos gerais em tabelas | 21 | Títulos, texto integral ainda não revisto |

A coleção de `doc.paragraphs` do `python-docx` não inclui as tabelas. Essa foi uma lacuna real do processo anterior: **21 movimentos e quadros gerais** ficavam fora do mapeamento por parágrafos, embora possam aparecer na extração por páginas do PDF.

## Primeiro grupo: Humanos

Os seis movimentos transcritos integralmente são **Filho do Rio Ancestral**, **Cria de Garganta**, **Portomontense**, **Filho de Muitos Deuses**, **Povo de Fronteira** e **Sobrevivente da Ocupação**. Correspondem exatamente aos parágrafos de índices zero-based **827–832** do DOCX.

O movimento **Portomontense** descreve capacidade *pessoal e condicional* de obter abrigo, água potável **ou** alimento suficiente para um pequeno grupo por um dia, dados tempo e recursos mínimos, e um benefício numa jornada no Mar de Sangue. Não comprova abastecimento público nem potabilidade da água distribuída pelo templo de Deméter: a lacuna material de Portomonte permanece aberta.

## Segundo grupo: Orcs da Caatinga

Os seis movimentos transcritos são **Filho da Caatinga**, **Guerra de Nove Anos**, **Não Morremos Aqui**, **Saqueador da Caatinga**, **Aliados Antigos** e **Nada a Provar**. Suas âncoras são os parágrafos **834–837** e **842–843**.

**Saqueador da Caatinga** exige especial cuidado: o cabeçalho está no parágrafo 837; as escolhas estão em quatro `List Paragraph` separados (**838–841**). O texto preserva **10+: escolha 2** e **7–9: escolha 1**, e a nova coleção preserva cada opção por inteiro.

**Guerra de Nove Anos** é o nome de um movimento de memória cultural, **não** prova automática de que uma guerra do calendário canônico durou exatamente nove anos. **Saqueador** é uma opção mecânica individual, não descrição normativa de todo o povo orc.

Os 12 movimentos têm `requisito_explicito_no_cabecalho:null` porque não possuem `REQUER:` nesse cabeçalho; isso não significa isenção de regras gerais de aquisição.

## Inventário das 33 tabelas

A posição `tabela_docx_indice` é **zero-based**, não número de página.

- **0–9:** 10 quadros narrativos de ambientação; títulos editoriais são explicitamente marcados.
- **10–11:** duas tabelas numéricas (`Valor / Modificador`, `CON / PV`).
- **12–32:** 21 quadros de movimentos/regras gerais, como **Matar e Pilhar**, **Disparar**, **Desafiar o Perigo**, **Defender**, **Falar Difícil**, **Discernir Realidades**, **Negociar**, **Ajudar ou Interferir**, **Último Suspiro**, **Sobrecarga**, **Preparar Acampamento**, **Montar Guarda**, **Empreender uma Jornada Perigosa**, **Encerrar Sessão**, **Avançar de Nível**, **Farrear**, **Abastecer**, **Recuperar-se**, **Recrutar**, **Preparar** e **Servos**.

Esses 21 quadros estão **identificados, não transcritos integralmente**. Cada registro traz `texto_integral_curado:false` e `aplicacao_canonica:false`. Sua revisão deve preservar os blocos e eventuais escolhas que estejam em células distintas da tabela.

## Arquitetura e uso

Fontes editáveis:

- `data/lore/hack-carcaca-dw-movimentos-integrais-piloto.json` — transcrição completa dos 12 movimentos, com opções, grupo, marcador e parágrafos de origem.
- `data/lore/hack-carcaca-dw-tabelas-docx.json` — os 33 títulos de quadros e seus tipos.

Distribuição gerada:

- `dist/carcaca/hack-complete-pilot-movements.json`
- `dist/carcaca/hack-complete-pilot-movement-indexes.json`
- `dist/carcaca/hack-docx-tables.json`
- `dist/carcaca/hack-docx-table-indexes.json`

```js
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const humanos=await atlas.searchCompletePilotMovements({grupo:"HUMANOS"});
const saqueador=await atlas.searchCompletePilotMovements({
  grupo:"ORCS DA CAATINGA",comOpcoes:true
});
const movimentosGerais=await atlas.searchDocxTables({
  tipo:"quadro_movimento_geral"
});
const perigo=await atlas.searchDocxTables({titulo:"Desafiar o Perigo"});
```

A API também expõe `getCompletePilotMovements`, `getCompletePilotMovementIndexes`, `getDocxTables` e `getDocxTableIndexes`.

## Verificações e próximo lote

O validador confere a presença dos **12 parágrafos corretos**, divisão seis/seis, títulos compartilhados com a terceira auditoria, ausência de requisitos inventados, preservação de **quatro escolhas de Saqueador**, existência e ordem das **33 tabelas**, divisão **10/2/21**, além da proibição de aplicação automática.

A suíte de integração Python trabalha sobre o gerador real, com testes Node para buscas por povo, marcador, opção e tipo de tabela. Não foram alteradas as **sete criaturas** ou os **três assentamentos** da curadoria.

**Próximo ciclo:** recuperar integralmente **os 21 quadros gerais nas tabelas**, com gatilhos, resultados, opções e custos. Em seguida continuar por grupos de povo e classe, sempre distinguindo *título localizado*, *texto integral conferido* e *movimento aprovado para jogo*.
