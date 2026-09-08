# Pasta de mapeamento dos documentos físicos

## Como usar

1. Tire uma foto de cada tipo de documento distinto (um exemplar em branco/exemplo de cada, não precisa foto de todo paciente).
2. Salve em `mapeamento/fotos/`, nomeando assim:

   ```
   01-ficha-acolhimento.jpg
   02-termo-acolhimento.jpg
   03-controle-saida.jpg
   05-avaliacao-psicologica.jpg
   ...
   ```

   - O número no início é o mesmo `ID` que vai usar em `mapeamento-documentos.csv` e no `modelo-anotacao-documentos.txt` — assim tudo fica cruzável (foto ↔ linha da planilha ↔ bloco de anotação).
   - Nome curto depois do número, sem acento/espaço, só pra identificar visualmente.
   - Pode já ter tirado nota manual (pelo `modelo-anotacao-documentos.txt`) pra alguns e não pra outros — sem problema, eu cruzo o que tiver.

3. Quando tiver um lote pronto (não precisa esperar os ~40 todos), me avisa. Eu vou:
   - Ler cada foto e extrair: nome do documento, campos visíveis (com tipo e se parece obrigatório), quem assina (pelos rótulos de assinatura no papel).
   - Cruzar com as anotações manuais que você já tiver feito (cole o texto do bloco de notas na conversa).
   - Consolidar tudo em `documentos-mapeados.md` (um arquivo com uma seção por tipo de documento — essa vira a fonte de verdade única, junto com o CSV).
   - Atualizar `mapeamento-documentos.csv` com as linhas novas.
   - Sinalizar o que ficou sem resposta (campos tipo "quem preenche" ou "aparece na auditoria" que só a instituição responde, não dá pra ver só na foto) pra vocês validarem depois.

## Depois do mapeamento completo

Com `documentos-mapeados.md` fechado, os próximos passos que eu ajudo:

- **Desenho visual de cada documento** (o "papel" renderizado em A4, cabeçalho institucional + conteúdo + assinaturas — como o protótipo já faz para os 4 tipos que existem hoje, só que agora pros ~40 reais).
- **Script de seed do banco**: insere `TIPO_DOCUMENTO` + `CAMPO_TIPO_DOCUMENTO` direto no Postgres a partir do `documentos-mapeados.md`/CSV, em vez de cadastrar um por um na mão.

Isso ainda depende de fechar a estrutura do repositório/ORM (ver CLAUDE.md seção 13), mas o mapeamento em si já pode começar agora, independente disso.
