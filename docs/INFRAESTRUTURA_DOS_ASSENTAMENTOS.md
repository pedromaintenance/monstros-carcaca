# Infraestrutura material — abrigo, armazenamento e saneamento (ciclo 10)

**Natureza do documento:** curadoria com evidência e perguntas em aberto. Não é um catálogo de prédios construídos ou de sistemas reais de saneamento. Fonte primária: `Ambientação - A Carcaça - Visão Geral.txt`, seção "O Além Sul". Complemento de referência: `docs/CAPACIDADE_DE_SUPORTE.md` e `data/dependencias_materiais_costa_sul.json`.

## Hipótese de trabalho

Para ter uma povoação **materialmente habitável** precisamos investigar onde se obtêm e armazenam bens, onde os habitantes se abrigam, como tratam seus resíduos e como os recursos chegam. Mas **necessidade física não é evidência de que uma instalação específica exista**.

A lore afirma que:
- **Portomonte:** grande povoado humano escondido por penhascos, com templo de Deméter que purifica água do Mar de Sangue, lavouras possibilitadas pela purificação e função comercial entre povoados costeiros.
- **Ilhas tortles e tabaxis:** coletividade de ilhas habitadas; cada ilha guarda tradições monásticas próprias; indivíduos viajam sazonalmente e muitos atuam como marinheiros.
- **Kuo-toa:** habitantes de cavernas costeiras **e** cidades subaquáticas (não o mesmo assentamento); envolvidos em guerra ritual na costa.

A fonte **não afirma** que há casas de pedra em Portomonte, técnicas de construção com ossos de Golzdov nesses lugares, celeiros, armazéns, cais, porto organizado, rede de esgoto, poços potáveis, docas monásticas ou sistemas de armazenamento kuo-toa. Tampouco informa suas quantidades, materiais ou medidas.

## Estrutura de dados: quatro setores por perfil

`data/infraestrutura_assentamentos_costa_sul.json` mapeia cada assentamento/região coletiva em quatro setores:

| Setor | Questão de curadoria | Exemplo de distinção |
| --- | --- | --- |
| `construcao_abrigo` | Quais abrigos, obras e materiais são conhecidos? | **Penhasco** é geografia, não prova de uma parede construída em pedra |
| `armazenamento` | Que bens são conservados, onde e por quanto tempo? | **Comércio** não prova armazém nem celeiro |
| `saneamento` | Como são obtidas águas adequadas e tratados resíduos? | **Purificação para lavoura** não é evidência de água potável ou esgoto |
| `acessos_logistica` | Como chegam pessoas, bens e serviços? | **Marinheiros** não comprovam porto nem cais localizado |

Cada setor guarda `estado`, `ancoras_documentadas` (texto, classe, fonte, status), `materiais_construtivos_confirmados`, `instalacoes_especificas_confirmadas`, `problemas_em_aberto`, `perguntas_para_o_mestre` e `dependencias_relacionadas`. Há exatamente **3 perfis e 12 setores** neste primeiro lote, com rótulos de estado `evidencia_parcial` ou `sem_documentacao`. Um setor pode ter fatos que justificam perguntas sem revelar solução de engenharia.

**Única instalação arquitetônica nominal explícita neste lote:** o **Templo de Deméter em Portomonte**, registrado como instalação existente de função ritual. Seu material construtivo é desconhecido. A categoria `materiais_construtivos_confirmados` permanece vazia em todos os setores. Cavernas são habitats do relevo e não construção comprovada; tradições monásticas não provam mosteiros edificados.

## Vínculos com a economia material

Portomonte:
- armazenamento → lavouras e comércio; **não** indica que já existam celeiros, apenas que a investigação desses processos é relevante;
- saneamento → purificação de água para lavouras; **não** associa purificação a rede de esgoto;
- acessos → comércio costeiro; **não** define cais nem estrada.

Ilhas:
- armazenamento e acessos → viagens sazonais; **não** afirma comércio direto com Portomonte, pesca, alimentos ou ponto de embarque específico.

Cavernas kuo-toa:
- nenhuma infraestrutura é vinculada automaticamente à origem de incursões rituais regionais, pois a origem em cavernas ou cidades subaquáticas ainda não está estabelecida.

**A relação entre setor e dependência não afirma que a instalação exista; sinaliza o que deve ser observado caso o mestre individualize o assentamento.**

## Consulta no cliente

```js
import {createCarcacaAtlas} from "./src/carcaca-client.mjs";
import {auditInfrastructure,previewInfrastructureIssue} from "./src/carcaca-infrastructure.mjs";

const atlas=createCarcacaAtlas({baseUrl:"./dist/carcaca"});
const p=await atlas.getInfrastructureProfile("infraestrutura:portomonte");
const semSaneamento=await atlas.searchInfrastructureProfiles({
  setorId:"saneamento",estadoSetor:"sem_documentacao"
});
const auditoria=auditInfrastructure(p,{sectorId:"construcao_abrigo"});
const hipotese=previewInfrastructureIssue(p,{
  sectorId:"armazenamento",
  hipotese:"Um bloqueio imaginário impede o transporte de provisões nesta campanha"
});
```

**Cuidado:** `sem_documentacao` significa **informação ausente**, não prova de que a comunidade não possua saneamento. `previewInfrastructureIssue` devolve perguntas e referências, não calcula escassez, não confirma bloqueio, não registra eventos e não modifica dados canônicos ou rótulos do Dungeon World.

## Garantias e testes

- **Schema:** `schemas/infraestrutura-assentamento.schema.json`; exatamente quatro setores diferentes, IDs estáveis e referência a fonte.
- **Integridade:** cada perfil aponta para um assentamento e perfil de suporte existentes, ambos da mesma natureza territorial. Dependências relacionadas devem apontar para processos daquele mesmo assentamento.
- **Evidência:** `estado:evidencia_parcial` exige âncora documental; `sem_documentacao` exige lista de âncoras vazia. Materiais e instalações confirmados exigem proveniência.
- **Não mutação:** todo setor tem `efeitos_dw_automaticos:false` e `risco_narrativo_proposto:null`.
- **Distribuição:** `dist/carcaca/infrastructure-profiles.json` e `infrastructure-indexes.json`, com filtros por assentamento, natureza, setor conhecido/desconhecido e dependência.
- **Testes JS:** leitura/filtro, distinção entre âncora geográfica e material construtivo, cópias de evidências imutáveis e prévias explicitamente hipotéticas.

## Próximo lote

Avaliar se a infraestrutura costeira é influenciada por **guerra e localização** sem inventar relações já ocorridas; detalhar paisagens da Caatinga e regiões de guerra com evidência autoral específica antes de cadastrar outro assentamento. Futuramente, quando nomes e técnicas forem estabelecidos por canonização, os setores poderão receber materiais e instalações de fato.

*Não atribuir rótulos especiais à comunidade apenas para justificar uma hipótese; o rótulo deve ser sustentado por fonte ou aprovado pelo autor.*
