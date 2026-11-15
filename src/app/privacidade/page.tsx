import type {Metadata} from 'next';
import {LegalPage} from '@/components/LegalPage';
import {site} from '@/lib/site';

export const metadata: Metadata = {title: 'Privacidade · o que falta'};

export default function Page() {
  return (
    <LegalPage title="Política de privacidade" updated>
      <p>
        Esta política explica, em linguagem simples, quais dados o o que falta guarda, para quê e por quanto tempo. O o que falta não tem cadastro e não vende nem compartilha dados para
        publicidade.
      </p>

      <h2>O que guardamos</h2>
      <p>O que você escreve na lista: o nome da lista, os itens, se já foram comprados e as categorias.</p>
      <p>Um código aleatório do aparelho, usado só para limitar quantas listas podem ser criadas em pouco tempo e evitar abuso.</p>
      <p>Para evitar abuso, registramos a criação de listas com uma versão embaralhada (hash) do endereço IP. Esse registro é apagado em até 1 dia.</p>

      <h2>Quem vê o quê</h2>
      <p>Quem tem o link da lista pode ver e editar tudo o que está nela. Por isso, mande o link só para quem faz compras com você.</p>

      <h2>No seu aparelho</h2>
      <p>O navegador guarda o código do aparelho e a lista de &quot;Minhas listas&quot;. Não usamos cookies de publicidade nem de rastreamento.</p>

      <h2>Serviços que usamos</h2>
      <p>
        Supabase (banco de dados, com servidores em São Paulo) e Vercel (hospedagem do site). Eles tratam os dados só para o o que falta funcionar e podem manter registros técnicos de
        acesso, como o endereço IP, conforme as próprias políticas.
      </p>

      <h2>Por quanto tempo</h2>
      <p>As listas ficam guardadas enquanto o o que falta estiver no ar, para que os links continuem funcionando. Você pode pedir a exclusão a qualquer momento.</p>

      <h2>Seus direitos</h2>
      <p>Pela LGPD, você pode pedir para ver, corrigir ou apagar os seus dados, ou uma lista inteira. Escreva para o contato abaixo e mande junto o link da lista.</p>
      <p>No próprio app, você pode apagar itens e limpar os comprados a qualquer momento.</p>

      <h2>Responsável</h2>
      <p>O responsável pelos dados é {site.operator}. Se esta política mudar, a data no topo é atualizada.</p>
    </LegalPage>
  );
}
