# Ciclo LVIII — Redes de Vida da Carcaça

**Estado:** proposta de worldbuilding não homologada, sem novas cidades, espécies, estradas ou ocorrências. [JSON integral](../data/propostas/redes-de-vida-ecossistemas-ciclo58.json).

## Método: do habitat isolado ao sistema

Em vez de inventar mais dez monstros, testamos **três ecossistemas regionais** baseados em **seis habitats** e **nove comunidades** já presentes nos dossiês XLV–LVII. O objetivo é encadear recursos, fauna, trabalho, decisões coletivas e consequências ambientais. Os modelos possuem **18 nós**, **18 nexos condicionais**, **nove estados ambientais possíveis** e **seis pessoas** (três reaproveitadas e três novas). **Não comprovam vizinhança ou interação histórica**: compartilhar setor não significa ocupar o mesmo local.

**Critério de verdade:** organismo já proposto ≠ espécie homologada; elo alimentar plausível ≠ alimentação observada; estado ambiental hipotético ≠ data sazonal fixa; comunidade do mesmo setor ≠ comunidade vizinha.

## Caatinga — O pacto entre escamas e lanternas

Um território onde um brilho pode atrair polinizadores, comerciantes ou pessoas desesperadas. A sobrevivência depende de água obtida de verdade, alimento e confiança nos sinais.

**Ambiente de trabalho:** Mosaico hipotético de substrato pedregoso, abrigos secos e manchas vegetadas; a existência de um único lugar contendo os dois habitats não foi confirmada.

**Habitats-base:** Território das Cascavéis de Vidro (`habitat:xlvi:01`); Florada das Lanternas Secas (`habitat:xlvi:02`).

**Comunidades que poderiam estar relacionadas, se houver contato efetivo:** Conselho das Sete Cumbucas (`povoamento:liv:01`); A Horta das Sombras Curtas (`povoamento:liv:03`); Ferro e Capim Quebrado (`povoamento:xlvi:caatinga:04`).

**Cuidado de canon:** A florada não fornece água. As Cascavéis de Vidro não formam sociedade sapiente. As cactáceas inteligentes da Horta das Sombras Curtas não representam todas as plantas da Caatinga.

### Matérias e meios de vida

**Água e recipientes.** Necessita de fontes ou captação ainda desconhecidas, recipientes e tempo de transporte. **Uso possível:** Beber, cuidar de pessoas e materiais conforme qualidade verificada **Risco social:** Promessas de nascente com base na florada e controle coercitivo da distribuição **O que investigar:** Distinguir origem, uso, disponibilidade real e perdas de água antes de narrar abundância

**Flores, sementes e polinizadores.** Necessita de plantas hospedeiras e visitantes entomológicos propostos. **Uso possível:** Continuidade reprodutiva e observação de fenômeno luminoso **Risco social:** Coleta integral para venda de luzes que elimina a próxima geração de flores **O que investigar:** Registrar manchas de florada, visitantes e sementes sem impor estação fixa

**Escamas descartadas e presas.** Necessita de peles de cascavéis naturalmente abandonadas, lagartos e pequenos roedores hipotéticos. **Uso possível:** Artefatos raros de baixo volume, apenas com coleta não lesiva **Risco social:** A demanda por escamas incentiva perseguição de serpentes e distúrbio de tocas **O que investigar:** Separar material abandonado de captura, verificar efeito sobre presas

### Rede alimentar e social: nós e relações

- **Flores luminescentes** — `produtor_fotossintetico` · referência `habitat:xlvi:02`
- **Insetos visitantes não individualizados** — `consumidor_primario_ou_polinizador` · referência `habitat:xlvi:02`
- **Pequenos lagartos candidatos** — `consumidor_insetivoro` · grupo funcional hipotético
- **Cascavel de Vidro** — `predador` · referência `criatura:lvii:01`
- **Cactáceas conscientes da Horta** — `pessoas_vegetais_propostas_nao_recursos` · referência `povoamento:liv:03`
- **Coletores e famílias residentes** — `agentes_sociais` · referência `povoamento:liv:01`

| Origem → destino | Relação condicional | Natureza |
|---|---|---|
| Flores luminescentes → Insetos visitantes não individualizados | fornece alimento ou sinal atrativo; visitantes podem polinizar | `hipotese_ecologica` |
| Insetos visitantes não individualizados → Pequenos lagartos candidatos | podem servir de alimento, dependendo de coocorrência | `hipotese_ecologica` |
| Pequenos lagartos candidatos → Cascavel de Vidro | podem servir de presa; dieta não é exclusiva | `hipotese_ecologica` |
| Coletores e famílias residentes → Flores luminescentes | colheita excessiva pode limitar próxima florada | `tensao_de_uso` |
| Coletores e famílias residentes → Cascavel de Vidro | coleta de escamas pode pressionar tocas | `tensao_de_uso` |
| Coletores e famílias residentes → Cactáceas conscientes da Horta | direitos de mudas e necessidade de comida podem entrar em disputa | `conflito_etico_condicional` |

As setas descrevem **alimentação possível, influência ambiental ou disputa social**; não significam deslocamento real, um hábito confirmado ou uma obrigação moral da natureza.

### Três estados possíveis, sem calendário fixo

**Manchas isoladas.** **Observação de entrada:** Poucas flores e visitantes identificados em observações locais **O que pode mudar:** A sobrevivência depende de provisões e da distinção entre água real e boato de fonte **Sinais verificáveis no cenário:** Pólen escasso e marcas de caça sem sinal de produção hídrica

**Florada observável.** **Observação de entrada:** Aumento local de flores luminosas e insetos, se de fato ocorrer **O que pode mudar:** Coletores e comerciantes tentam orientar circulação; a predação acompanha visitantes **Sinais verificáveis no cenário:** Pontos de brilho e insetos, sem que isso determine mês ou chuva

**Coleta e desconfiança.** **Observação de entrada:** Remoção intensa de flores ou perseguição às serpentes, caso escolhidas na narrativa **O que pode mudar:** Diminui a disponibilidade de sementes ou abrigos e cresce conflito sobre apropriação **Sinais verificáveis no cenário:** Casulos ausentes, tocas revolvidas e acusações públicas

### Pessoas, não só espécies

**Tamar do Vento Baixo** — Observador orc da Roda das Lanternas Apagadas (retomado de `uso:lvii:01`). **Quer:** Divulgar quando o brilho não significa água **Precisa:** Receber alimento ou pagamento pelo tempo de observação **Contradição:** Vender registros a um intermediário que os converta em publicidade falsa

**Akra da Cerâmica Rachada** — Oleira goblin proposta do Conselho das Sete Cumbucas (novo personagem candidato). **Quer:** Criar marcas de proveniência para recipientes comunitários **Precisa:** Argila, combustível e proteção para aprendizes; fontes ainda indefinidas **Contradição:** Marcar recipientes pode abrir caminho a fiscalização coercitiva da distribuição

### Pressão que pode transformar a região

**Problema:** Uma promessa de água foi anunciada a partir de uma florada que nunca foi evidência de nascente.

**Quem pode ganhar se nada mudar:** Intermediário que vende a falsa promessa e quem monopoliza recipientes

**Quem suporta os custos:** Viajantes sem reserva, crianças, cuidadores e famílias que deixaram outros abrigos

**Respostas possíveis:** Verificar água e publicar a incerteza com risco de perder remuneração; Criar gestão de recipientes sob controle comunitário com garantia de acesso; Proteger a florada sem proibir injustamente toda coleta de subsistência.

**Se o problema persistir:** Mais pessoas se deslocam confiando em sinais falsos, aumentando competição por recursos realmente disponíveis.

**Cena possível (não ocorrida):** Uma criança traz um punhado de pétalas luminosas ao Conselho. Um comerciante jura que isso prova a existência de um poço. Tamar nega, mas deve dinheiro a ele; Akra teme que a discussão termine com o confisco das cumbucas.

## Rio Ancestral — O leito, o barro e as aves cegas

A margem não é uma coisa só: conchas filtram partículas, garças ocupam espaços de cria, horticultores dependem do solo e autoridades tentam transformar riscos em tributos.

**Ambiente de trabalho:** Possíveis micro-habitats distintos ao longo do Rio Ancestral; não está demonstrado que o leito de conchas, os ninhos e as comunidades citadas estejam próximos.

**Habitats-base:** Leito das Conchas de Vidro (`ecologia:xlv:01`); Ninhos de Barro das Garças Cegas (`ecologia:xlv:02`).

**Comunidades que poderiam estar relacionadas, se houver contato efetivo:** Assembleia da Greda Escura (`ciclo52:comunidade:r-greda`); As Toldas da Última Colheita (`ciclo52:comunidade:r-toldas`); Casa dos Sinos sem Badalo (`ciclo52:comunidade:r-sinos`).

**Cuidado de canon:** Filtração não implica potabilidade. Garças são aves propostas, não observadoras sobrenaturais infalíveis. A Assembleia da Greda Escura é povo sapiente, não um depósito de matéria-prima.

### Matérias e meios de vida

**Sedimentos e argila.** Necessita de depositos de margem de características não medidas. **Uso possível:** Habitação e cerâmica condicionais, além de possível cultivo de margem **Risco social:** Extração degrada habitat de indivíduos da Greda e margens de outros seres **O que investigar:** Diferenciar corpo sapiente, área de habitat, material retirável e efeitos da escavação

**Água e alimentos de margem.** Necessita de água de qualidade desconhecida, solo disponível e sementes guardadas. **Uso possível:** Horticultura e consumo apenas com tratamento ou verificação **Risco social:** Perda de safra ou alteração do leito vira cobrança de imposto sobre alimento inexistente **O que investigar:** Registrar nível observado, perdas e reservas de semente, não inventar vazão ou safra

**Conchas, aves e sinais.** Necessita de moluscos hipotéticos, aves e presas dependentes de habitats apropriados. **Uso possível:** Observar mudança ecológica e alertar trabalhadores **Risco social:** Conchas como prova comercial de pureza; ninhos como justificativa de ocupação territorial **O que investigar:** Separar sinal de inferência e observar se os dois habitats de fato coexistem

### Rede alimentar e social: nós e relações

- **Partículas orgânicas suspensas** — `materia_organica` · grupo funcional hipotético
- **Molusco de Vidro** — `filtrador` · referência `criatura:lvii:05`
- **Pequenos consumidores aquáticos não definidos** — `presa_possivel` · grupo funcional hipotético
- **Garças Cegas** — `predador_aereo_proposto` · referência `ecologia:xlv:02`
- **Hortas e sementes das Toldas** — `pratica_agricola_humana` · referência `ciclo52:comunidade:r-toldas`
- **Assembleia da Greda Escura** — `comunidade_sapiente` · referência `ciclo52:comunidade:r-greda`

| Origem → destino | Relação condicional | Natureza |
|---|---|---|
| Partículas orgânicas suspensas → Molusco de Vidro | podem servir de substrato alimentar à filtração | `hipotese_ecologica` |
| Pequenos consumidores aquáticos não definidos → Garças Cegas | poderia servir de presa onde as aves de fato nidificam | `hipotese_ecologica` |
| Molusco de Vidro → Assembleia da Greda Escura | retirada de conchas e alteração do leito pode provocar conflito de habitat se houver sobreposição | `tensao_de_uso_condicional` |
| Hortas e sementes das Toldas → Assembleia da Greda Escura | horticultura e retirada de argila podem afetar o mesmo sedimento se forem vizinhas | `hipotese_funcional_sem_vizinhanca` |
| Garças Cegas → Hortas e sementes das Toldas | mudança dos ninhos pode ser observada, mas não é medidor comprovado do nível do rio | `indicador_incerto` |
| Molusco de Vidro → Hortas e sementes das Toldas | chamar a água de pura por ver conchas pode expor famílias a riscos | `risco_de_inferencia` |

As setas descrevem **alimentação possível, influência ambiental ou disputa social**; não significam deslocamento real, um hábito confirmado ou uma obrigação moral da natureza.

### Três estados possíveis, sem calendário fixo

**Margem em observação.** **Observação de entrada:** Marcas de água, aves e conchas disponíveis para comparação local **O que pode mudar:** Cuidadores podem revisar uso de solo e água sem garantir travessias **Sinais verificáveis no cenário:** Registros concordantes ou discordantes entre testemunhas

**Mudança no leito.** **Observação de entrada:** Variação observada de sedimento ou água; evento não necessariamente periódico **O que pode mudar:** Aumenta pressão sobre horticultura, tocas e ninhos onde se sobrepuserem **Sinais verificáveis no cenário:** Conchas soterradas, barro deslocado ou ninhos inacessíveis apenas como possibilidades

**Disputa por recuperação.** **Observação de entrada:** Depois de perdas, caso ocorram, grupos negociam reconstrução e impostos **O que pode mudar:** É possível escolher entre restaurar margens e cobrar perdas como se fossem produção **Sinais verificáveis no cenário:** Contabilidade divergente de sementes, sedimentos e equipamentos

### Pessoas, não só espécies

**Mara Concha-Opaca** — Observadora humana da Mesa das Marcas do Leito (retomado de `uso:lvii:04`). **Quer:** Manter registros que expressem incerteza sobre a água **Precisa:** Ferramentas de observação e reconhecimento de seu trabalho **Contradição:** Perder credibilidade ao recusar anunciar uma água milagrosamente pura

**Délo Barro-Contado** — Horticultor goblin proposto das Toldas da Última Colheita (novo personagem candidato). **Quer:** Guardar sementes antes de satisfazer fiscais **Precisa:** Um acordo de uso do solo que não destrua o habitat da Greda **Contradição:** Usar o registro de perdas para reivindicar sozinho uma margem comunitária

### Pressão que pode transformar a região

**Problema:** Uma cobrança é calculada sobre colheitas que não nasceram, enquanto agentes vendem água supostamente purificada pelas conchas.

**Quem pode ganhar se nada mudar:** Fiscais e intermediários que transferem o risco ambiental para famílias sem reservas

**Quem suporta os custos:** Famílias das Toldas, aprendizes de ofício, indivíduos da Greda e barqueiros sem capital

**Respostas possíveis:** Registrar perdas com testemunhas sem expor listas de refugiados; Negociar retirada de sedimento com consentimento de possíveis moradores da Greda; Separar indicadores ecológicos de alegações sobre água potável.

**Se o problema persistir:** Sementes são tomadas para pagar imposto e danos ao leito tornam a próxima tentativa de cultivo mais incerta.

**Cena possível (não ocorrida):** Mara registra conchas opacas após uma alteração no leito. Délo mostra um saco de sementes reservado ao replantio. Um fiscal insiste que ambos comprovam uma safra escondida, enquanto representantes da Greda denunciam retirada de barro.

## Eldroth — A memória que cresce nas cinzas

Uma floresta ocupada em que madeira resistente a fogo, fungos, besouros e habitantes deslocados disputam os limites entre conservação, abrigo e exploração.

**Ambiente de trabalho:** Manchas de mata em decomposição ou atingidas por fogo; não se presumem adjacentes às ruínas de Vandar, nem rotas seguras entre comunidades.

**Habitats-base:** Raízes dos Besouros Escribas (`ecologia:xlv:06`); Madeira que Recusa o Fogo (`ecologia:xlv:09`).

**Comunidades que poderiam estar relacionadas, se houver contato efetivo:** O Casulo das Sete Vigílias (`povoamento:liii:09`); Horta dos Anéis de Cinza (`povoamento:liii:10`); Sala de Vigília das Ervas sem Sombra (`povoamento:liii:12`).

**Cuidado de canon:** A Madeira que Recusa o Fogo não é imune a qualquer chama, nem espécie controlada por Sylara. Besouros que fazem marcas não escrevem língua Yokai. Miconídeos e aranhas sapientes possuem agência própria.

### Matérias e meios de vida

**Madeira morta, fungos e húmus.** Necessita de troncos caídos, umidade local e tempo de decomposição. **Uso possível:** Reciclagem de matéria e possível cultivo, sujeito a consentimento das comunidades **Risco social:** Retirar madeira viva como combustível destrói ninhos e pode apagar lugares de memória **O que investigar:** Distinguir árvore viva, tronco caído, estrutura habitada e memorial antes de cortar

**Ervas e material de cuidado.** Necessita de plantas com eficácia desconhecida e trabalhadores de cura clandestina. **Uso possível:** Tratamento condicional e observação de pacientes **Risco social:** Promessas de cura garantida; exposição de refúgios pela busca de plantas **O que investigar:** Registrar espécie, origem, efeitos observados e risco de recolha, sem poderes automáticos

**Registros e sinais na casca.** Necessita de marcas naturais de besouros, inscrições humanas antigas e memórias locais. **Uso possível:** Distinguir sinais intencionais de atividade de decompositores **Risco social:** Patrulhas usam o padrão de besouros como acusação de resistência **O que investigar:** Comparar vários troncos com testemunhas sem revelar localização de famílias

### Rede alimentar e social: nós e relações

- **Madeira morta e cascas** — `materia_organica` · referência `ecologia:xlv:06`
- **Besouro Escriba** — `fragmentador_de_materia` · referência `criatura:lvii:06`
- **Fungos e decompositores** — `decompositor` · referência `ecologia:xlv:06`
- **Solo com matéria devolvida** — `recurso_do_ambiente` · grupo funcional hipotético
- **Aranhas sapientes do Casulo** — `comunidade_sapiente_nao_recurso` · referência `povoamento:liii:09`
- **Miconídeos da Horta dos Anéis de Cinza** — `comunidade_sapiente_nao_recurso` · referência `povoamento:liii:10`

| Origem → destino | Relação condicional | Natureza |
|---|---|---|
| Madeira morta e cascas → Besouro Escriba | serve como substrato e possível recurso alimentar | `hipotese_ecologica` |
| Besouro Escriba → Fungos e decompositores | fragmentação pode facilitar decomposição | `hipotese_ecologica` |
| Fungos e decompositores → Solo com matéria devolvida | decomposição pode devolver nutrientes ao substrato | `hipotese_ecologica` |
| Aranhas sapientes do Casulo → Besouro Escriba | poderia haver disputa ou observação de insetos, não caça estabelecida | `hipotese_condicional` |
| Miconídeos da Horta dos Anéis de Cinza → Madeira morta e cascas | cultivo e preservação de memória podem disputar madeira | `conflito_de_uso` |
| Aranhas sapientes do Casulo → Miconídeos da Horta dos Anéis de Cinza | as duas sociedades não partilham necessariamente linguagem, valores ou localização | `limite_de_inferencia` |

As setas descrevem **alimentação possível, influência ambiental ou disputa social**; não significam deslocamento real, um hábito confirmado ou uma obrigação moral da natureza.

### Três estados possíveis, sem calendário fixo

**Cobertura protegida.** **Observação de entrada:** Madeira caída e decompositores podem agir sem remoção intensa **O que pode mudar:** O solo recebe matéria e refugiados podem observar processos sem cortar tudo **Sinais verificáveis no cenário:** Sulcos naturais e fungos em madeira caída

**Pressão de fogo ou extração.** **Observação de entrada:** Queimada, corte ou retirada de substrato caso ocorra na história **O que pode mudar:** Abrigos de insetos, memória material e materiais de cura podem ser perdidos **Sinais verificáveis no cenário:** Troncos queimados, fuga de pequenos animais e marcas difíceis de ler

**Regeneração disputada.** **Observação de entrada:** Após perturbação, se houver condições ambientais de recuperação **O que pode mudar:** Refugiados, miconídeos, aranhas e curadores disputam uso e preservação **Sinais verificáveis no cenário:** Fungos em fragmentos, novos brotos onde possível e ausência de antigos suportes

### Pessoas, não só espécies

**Selva Nó-de-Cinza** — Guardadora elfa do Marco das Cascas Não Queimadas (retomado de `uso:lvii:05`). **Quer:** Preservar memória e recuperar habitats **Precisa:** Proteger testemunhas e evitar que registros tragam patrulhas **Contradição:** Esconder toda evidência e deixar que o poder da Corte reescreva o passado

**Muer do Anel Partido** — Miconídeo proposto da Horta dos Anéis de Cinza (novo personagem candidato). **Quer:** Reservar madeira caída à decomposição e a possíveis cultivos **Precisa:** Habitat adequado e consentimento para negociar com visitantes **Contradição:** Desconsiderar que uma viga em decomposição também pode ser abrigo ou memorial de alguém

### Pressão que pode transformar a região

**Problema:** Uma patrulha trata os sulcos produzidos por besouros como código de refugiados e exige destruir os troncos.

**Quem pode ganhar se nada mudar:** Ocupantes que transformam indícios naturais em pretexto de vigilância

**Quem suporta os custos:** Refugiados, curadores, miconídeos e animais decompositores sem defesa militar

**Respostas possíveis:** Comparar cascas de árvores desabitadas para demonstrar padrão natural sem revelar refúgios; Salvar registros históricos sem sacrificar todo o substrato de decomposição; Negociar a retirada de madeira de construções ameaçadas com quem delas depende.

**Se o problema persistir:** Queimas e remoções reduzem habitat e multiplicam as suspeitas sobre quem tenta conservar a floresta.

**Cena possível (não ocorrida):** Uma árvore calcinada continua erguida. Soldados apontam suas marcas como prova de mensagem rebelde. Selva reconhece que os sulcos vieram de insetos; Muer afirma que a remoção do tronco destruirá parte do cultivo — mas nenhum dos dois deseja entregar a localização do outro.

## O que ganhamos, sem inflar o mundo

1. **Três redes regionais utilizáveis:** não são uma cadeia linear única nem um mapa com localizações falsas.
2. **Nove estados ambientais condicionais:** permitem ao mestre alterar a situação quando uma ação ou evento efetivamente muda os recursos; não são relógios de progresso inevitável.
3. **Seis personagens com contradições:** três reaproveitados do Ciclo LVII e três candidatos, sem multiplicar vilas ou inventar governantes.
4. **Dezoito relações com rastreabilidade:** cada seta só passa a representar fato se houver decisão autoral ou acontecimentos na campanha.
5. **Três conflitos de classe e uso do território:** uma mentira sobre água, a tributação de safra inexistente e a criminalização de marcas naturais.

## Protocolo editorial e próxima passagem

**Antes de inserir qualquer relação no atlas canônico:** (a) confirmar habitat e condições materiais, (b) verificar quais grupos realmente compartilham o território, (c) determinar se o elo é fato, lenda, hipótese de habitantes ou proposta de mestre, (d) apenas então criar coordenadas ou fichas de criatura.

Nada neste ciclo altera `dist/carcaca/creatures.json`, `dist/carcaca/settlements.json`, os mapas ou o resultado da campanha ativa de Shadar-Riverie. Nenhum habitante conhece a história de Kindau, da Lança ou do Arquivo dos Mortos Afogados apenas por estar neste sistema.
