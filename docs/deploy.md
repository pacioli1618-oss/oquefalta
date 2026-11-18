# Deploy

Produção na **Vercel** com o **Supabase do QuemLeva** (sa-east-1, São Paulo), schema `oqfalta`.

## 1. Banco

As migrations em `supabase/migrations/` criam o schema `oqfalta` e as funções `public.of_*`.
Elas não mexem em nada do QuemLeva (schema `quemleva`, funções `ql_*`).

Realtime: canais públicos permitidos ("private only" desligado), como no QuemLeva.

## 2. Vercel

1. Importe o repositório na Vercel (preset Next.js, sem mudar build nem output).
2. Variáveis de ambiente (Production e Preview):

   | Nome | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://uqkyhzvdwynpkqdiuvyn.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | a chave publicável (`.env.example`) |
   | `NEXT_PUBLIC_SITE_URL` | opcional: `https://oquefalta.gr1618.io` |

3. Região das funções: São Paulo (`gru1`), já definida em `vercel.json`.

## 3. Domínio

Validação: `oquefalta.gr1618.io`.

1. Vercel → Project → Settings → Domains → adicione `oquefalta.gr1618.io`.
2. No DNS do `gr1618.io`: `CNAME` · nome `oquefalta` · valor indicado pela Vercel.
3. O HTTPS sai sozinho quando a Vercel marcar o domínio como válido.

## 4. Teste depois de cada deploy

1. Celular A: abra o site, adicione "banana" e "detergente". Confira que caem em Hortifruti e Limpeza.
2. Toque em Compartilhar e mande o link para o celular B.
3. Celular B: abra o link, marque "banana". O celular A vê a mudança em até um segundo, sem recarregar.
4. Toque e segure um item: troque a categoria e apague.
5. Categorias: renomeie, mude a ordem, crie uma nova e salve. A lista segue a nova ordem.
6. Minhas listas: crie "Churrasco" e confira que as duas listas aparecem.
7. Idioma: no rodapé, troque para English e depois para Español. A tela muda sem mudar o link.
   Crie uma lista nova em cada idioma e confira que as categorias padrão nascem nesse idioma.
