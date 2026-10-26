# Monstros da Carcaça

Banco de criaturas compartilhado pelos jogos ambientados na **Carcaça**.

Este repositório organiza criaturas por identificador estável, origem, edição, licença, tipo, nível de desafio, ambiente, taxonomia e adaptações de jogo.

## Princípios

- **Uma fonte de verdade por variante**: estatísticas de D&D 2014, 2024, SRDs alternativos e criaturas originais nunca são sobrepostas silenciosamente.
- **Identificador estável**: `{origem}:{edicao}:{slug}`, independentemente de tradução ou formato.
- **Separação mecânica**: atributos de regras, metadados de ambientação e atributos do jogo ficam em camadas distintas.
- **Licenciamento**: apenas material reutilizável conforme a licença é distribuído. Catálogos proprietários são referências externas, não espelhos.
- **Offline-first**: índices JSON estáticos e manifesto para jogos sem servidor.

Consulte `docs/ARQUITETURA.md`, `docs/FONTES_E_LICENCAS.md` e `scripts/sincronizar.py`.

O conteúdo gerado será publicado em `dist/`, e os jogos podem usar o adaptador `scripts/peren-adapter.mjs`.
