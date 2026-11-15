import type {Metadata} from 'next';
import {LegalPage} from '@/components/LegalPage';
import {site} from '@/lib/site';

export const metadata: Metadata = {title: 'Sobre · o que falta'};

export default function Page() {
  return (
    <LegalPage title="Sobre o o que falta">
      <p>O o que falta é uma lista de compras que você compartilha com quem mora com você ou com os amigos. É gratuito, sem cadastro e de código aberto.</p>

      <h2>Como saber que é seguro</h2>
      <p>O o que falta não pede nada: nem nome, nem senha, código de verificação, telefone, CPF, dados de cartão ou pagamento. Se uma página pedir isso, não é o o que falta.</p>
      <p>O link chega de alguém que você conhece. Na dúvida, pergunte a quem mandou antes de abrir.</p>
      {site.host && <p>Os links do o que falta começam com {site.host}.</p>}

      <h2>Quem faz</h2>
      <p>O o que falta é um experimento do GR1618 Labs, um projeto independente feito no Brasil e mantido por {site.operator}.</p>

      <h2>Código aberto</h2>
      <p>
        O código é aberto, sob a licença AGPL-3.0, e qualquer pessoa pode conferir como ele funciona <a href={site.repositoryUrl}>no GitHub</a>.
      </p>
    </LegalPage>
  );
}
