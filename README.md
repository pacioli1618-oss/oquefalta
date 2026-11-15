# o que falta

Lista de compras compartilhada, sem cadastro. Você digita o que falta, manda o link para quem faz
compras com você e os dois veem a mesma lista, ao vivo.

Um experimento do GR1618 Labs. Gratuito, open source (AGPL-3.0), sem cadastro.

## Como funciona

- **Uma tela, um campo, um link.** Abrir o app já mostra a lista. A lista só é criada no banco
  quando entra o primeiro item.
- **Categorias automáticas.** "banana" vai para Hortifruti, "detergente" para Limpeza
  (`src/lib/categorize.ts`). O que o app não reconhece vai para Outros. Categorias podem ser
  renomeadas, reordenadas (na ordem dos corredores do mercado), criadas e apagadas.
- **Sem conta.** Ter o link é a permissão. As listas abertas ficam salvas no navegador
  ("Minhas listas"); o mesmo link abre a lista em qualquer aparelho.
- **Ao vivo.** Cada escrita manda um aviso no canal Realtime `oqfalta:<slug>` e os aparelhos
  abertos recarregam a lista.

## Stack

Next.js 16 + Supabase (Postgres, Realtime). Mesmo projeto Supabase do QuemLeva, em São Paulo:

- tabelas no schema privado `oqfalta`, fora da Data API, com RLS ligada e sem policies;
- o navegador só chama as funções `public.of_*` (`supabase/migrations/`), embrulhadas em
  `src/lib/api.ts`;
- criação de listas limitada por aparelho e por IP (hash com sal, apagado em 1 dia).

## Rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

Antes de publicar: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Publicar

Veja [docs/deploy.md](docs/deploy.md).
