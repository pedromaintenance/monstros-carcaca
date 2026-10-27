# Quinta auditoria — integridade dos movimentos gerais do Hack Carcaça DW

**Data:** 27/10/2026
**Fonte:** DOCX enviado pelo autor, 181 páginas, 33 tabelas.
**SHA-256 da fonte auditada:** `b53d1d5a057e8f6cba8a5d5ccd70747df3ce94d07ff2e2ffb9031368ea773b3d`

## Resultado verificável

Os **21 quadros gerais** estão nas tabelas de índice zero-based **12–32**. A leitura direta das células identificou **44 blocos/células textuais**, sem colunas adicionais. Os quadros **12–29** e **31–32** têm duas linhas; o quadro **30**, identificado como `RECRUTAR`, possui **quatro linhas**.

Lacuna estrutural da quarta auditoria: a tabela de `RECRUTAR` contém outro movimento inteiro, **MANDADOS PENDENTES**, nas linhas 2 e 3 (índice zero-based), que não deve ser apagado nem fundido à mecânica de Recrutar. Já o quadro `SERVOS` inclui a seção **LEALDADE DOS SERVOS**, com criação, distribuição de pontos, variações e custos. Por isso, **21 tabelas não significam necessariamente 21 unidades de regra**.

## Extração reproduzível

`scripts/extrair_quadros_hack.py` extrai diretamente todas as células dos 21 quadros, preservando texto, separação e posição. Exemplo:

```bash
python -m pip install python-docx
python scripts/extrair_quadros_hack.py "Hack Carcaça Dungeon World.docx" -o quadros_gerais_auditoria5.json
```

O documento-fonte deve ser provido localmente, porque não foi incorporado ao repositório. A exportação completa foi produzida nesta auditoria e entregue como arquivo separado.

## Situação editorial

- **Concluído:** extração integral dos 21 quadros, com preservação de 44 blocos, sem inferir regras.
- **Confirmado:** `Mandados Pendentes` é uma unidade de movimento separada dentro do quadro `Recrutar`.
- **Confirmado:** `Lealdade dos Servos` integra o material de Servos e não pode ser reduzida ao simples teste de Lealdade.
- **Não realizado:** divisão semântica em gatilho, 10+, 7–9, 6-, opções e custos; isso exige revisão editorial independente.
- **Não realizado:** integração desses textos ao índice público `dist/carcaca/`, pois o arquivo DOCX não foi versionado neste repositório.
- **Não realizado:** aprovação de novas mecânicas ou alterações do cânone.
- **Pendente:** testes CI da extração com uma fixture DOCX permissivamente distribuível, sem publicar integralmente textos cuja licença ainda esteja sob análise.

## Próximo passo

Integrar um catálogo derivado com blocos separados e metadados de proveniência, validar a correspondência exata com a fonte e depois criar o modelo semântico de efeitos. Nenhum texto extraído deve ser apresentado automaticamente como regra revisada/aprovada.
