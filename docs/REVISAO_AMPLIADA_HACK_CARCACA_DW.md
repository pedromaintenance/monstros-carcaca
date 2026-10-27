# Segunda auditoria do manuscrito Hack Carcaça DW

**Data da revisão:** 27 de outubro de 2026  
**Documento:** `Hack Carcaça Dungeon World.docx`, 181 páginas.  
**Objetivo:** encontrar lore ainda não indexada e oferecer localização pesquisável das mecânicas sem confundir exemplos de movimentos com verdades canônicas.

## Resultado publicado

| Conjunto | Antes | Após a auditoria | Observação |
| --- | ---: | ---: | --- |
| Entradas da ambientação | 100 | **157** | +38 divindades e +19 conceitos culturais, materiais e políticos |
| Marcos da cronologia EC | 18 | 18 | Preservados; não duplicados |
| Questões históricas em aberto | 7 | 7 | Permanecem abertas |
| Pontes editoriais com o M3 | 14 | 14 | Nenhuma promoção automática ao cânone |
| Texto dos capítulos II–III por página | 0 | **155 páginas** | Páginas 26–181; página 91 sem texto extraível |
| Rótulos visuais candidatos nos capítulos II–III | 0 | **653** | **Não são 653 movimentos validados** |
| Páginas com menções a `REQUER:` | 0 | **86** | Detecção por página, sem atribuição certificada de pré-requisitos |

Os novos termos não surgiram de pesquisa externa: derivam do **próprio manuscrito**, em especial de suas seções **Povos da Carcaça** e **Fé na Carcaça**, no Capítulo I (páginas 12–25). Cada entrada conserva o identificador da fonte e suas páginas.

### Novo detalhamento da teologia

Foram individualizados deuses anteriormente agregados sob a expressão genérica *panteões*: divindades dos **anões e gigantes de Thargrid**; os nomes gregos, nórdicos e egípcios usados pelos povos do Rio Ancestral e do Além Sul; além de **Corellon, Rillifane, Hécate e Boccob**, já citados como referências de fé e conhecimento. O verbete **Rá** conserva seu nome de duas letras, em vez de ser alterado artificialmente para satisfazer um validador.

As descrições distinguem **culto** de **autoridade política ou moral**. A presença de um nome no índice não demonstra que toda uma comunidade o venere nem transforma a divindade em patrono automático de uma região.

### Novo detalhamento dos sistemas materiais e sociais

Entraram temas específicos: **infraestrutura e depósitos de Thargrid**, agricultura e despensas de **Grama-Cortada**, **cartografia gnômica** útil a comércio e guerrilha, **patrulhas tritãs** na fronteira variável do Mar de Sangue, **memória oral das sereias**, **tributos e alianças abissais marinhas**, organização ritual **kuo-toa**, viagens de formação **tabaxi** e mosteiros **tortles**.

Esses elementos são *descrições qualitativas do rascunho*, não produção per capita, inventário numérico, dados demográficos ou mudança automática de prosperidade DW. Permanecem possíveis conflitos com textos posteriores, a serem revisados antes de integrar fichas canônicas.

## O que há no restante das 181 páginas?

A primeira indexação havia trabalhado apenas o **Capítulo I**. Nesta revisão, uma extração por página preservou a camada textual das páginas **26–181** em quatro arquivos, organizados para consulta:

- `fontes/autoria/hack-carcaca-dw-mecanicas-p26-64.json`: regras gerais, desenho de movimentos e primeira lista de movimentos de raça;
- `fontes/autoria/hack-carcaca-dw-mecanicas-p65-109.json`: listas de movimentos de classe;
- `fontes/autoria/hack-carcaca-dw-mecanicas-p110-154.json`: continuidade das classes;
- `fontes/autoria/hack-carcaca-dw-mecanicas-p155-181.json`: últimas práticas, inclusive Escriba Yokai, Nobre e Arqueólogo.

**Atualização da terceira auditoria:** a página 91 foi conferida visualmente na renderização do DOCX e **está realmente vazia** (apenas o fundo de pergaminho). O campo `paginas_sem_texto_extraivel:[91]` foi conservado por compatibilidade, com `conferencia_pagina_91.confirmada_em_renderizacao_docx:true`.

A transcrição pode conter **ordem de leitura imperfeita em páginas com duas colunas**. Por isso **não** foi transformada automaticamente em movimentos individuais, nem foram atribuídas dependências `REQUER` a um movimento sem validação humana.

### O índice de mecânicas é conservador

`data/lore/hack-carcaca-dw-indice-mecanicas.json` contém 155 registros de página com:

- categoria editorial: regras fundamentais, teoria dos movimentos, movimentos de povo ou movimentos de classe;
- rótulos em maiúsculas detectados visualmente, incluindo possíveis títulos e cabeçalhos;
- menções literais a `REQUER:` encontradas naquela página;
- caminho exato do arquivo de texto-fonte correspondente.

O gerador publica esta tabela em `dist/carcaca/hack-mechanics-index.json`. Os **653 rótulos são candidatos à revisão**, não uma contagem validada de movimentos. As **86 páginas com `REQUER:`** indicam onde buscar pré-requisitos; não certificam uma árvore de dependências.

Um exemplo do motivo desta cautela é o movimento racial **Portomontense**: o texto mecânico pode conceder ao personagem a capacidade de obter água potável na costa. Isso **não prova** que Portomonte já possua serviço coletivo de abastecimento potável na lore, questão que segue aberta no M3.

## Consulta pelo cliente ESM

```js
const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});

// Lore explicitamente citada no Capítulo I
const gods=await atlas.searchLore({tipo:"divindade"});
const culture=await atlas.searchLore({query:"Thargrid"});

// Títulos candidatos, páginas e menções mecânicas, não regras já revisadas
const index=await atlas.getHackMechanicsIndex();
const race=await atlas.searchHackMechanicsPages({query:"Portomontense"});
const prerequisites=await atlas.searchHackMechanicsPages({
  categoria:"movimentos_de_classe",
  comRequer:true
});
```

A pesquisa retornada aponta para as páginas das fontes em `fontes/autoria/`. A API **não** cria movimentos, não altera fichas nem garante interpretação fiel de títulos em colunas justapostas.

## Preservação canônica e testes

O schema do índice da ambientação valida todas as 157 entradas e conserva `afirmado_no_rascunho`/`referencia_sem_mutar_canonico`. O validador da camada mecânica confere a correspondência entre os quatro arquivos de fonte e o índice de páginas, assim como sua condição `nao_usar_como_fato_de_ambientacao:true`.

Testes Python validam o gerador real, contagens e separação do cânone; testes Node cobrem busca por categoria, página, termo, e menções a `REQUER`. Os **7 monstros e 3 assentamentos** do atlas existentes antes da auditoria não foram alterados.

## Próximo lote de revisão

O próximo trabalho de qualidade deve ser transformar **rótulos candidatos** em fichas de movimentos **somente após parsing e revisão de cada bloco** na ordem original do DOCX, incluindo gatilho, texto, categoria e `REQUER: X` explícito. Isso evitará atribuir um requisito à coluna ou classe vizinha.

A revisão de povos/ambientes deve continuar em paralelo, valorizando primeiro os verbetes que oferecem evidência material concreta (Thargrid, Grama-Cortada, oceanos azuis) e mantendo perguntas em aberto da Caatinga e de Portomonte quando o texto não fornece detalhe suficiente.
