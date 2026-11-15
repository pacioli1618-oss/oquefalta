import type {Metadata} from 'next';
import {LegalPage} from '@/components/LegalPage';

export const metadata: Metadata = {title: 'Termos · o que falta'};

export default function Page() {
  return (
    <LegalPage title="Termos de uso" updated>
      <p>Ao usar o o que falta, você concorda com estes termos.</p>

      <h2>O serviço</h2>
      <p>O o que falta é gratuito e oferecido como está, sem garantia de que vai funcionar sempre ou sem erros. Ele pode mudar ou ser encerrado; sempre que possível, avisaremos antes.</p>

      <h2>O que você escreve</h2>
      <p>Você é responsável pelo que escreve na lista. Não use o o que falta para conteúdo ilegal, ofensivo ou enganoso, nem para spam. Podemos remover listas que descumpram estas regras.</p>

      <h2>Links</h2>
      <p>Quem tem o link da lista pode ver e editar a lista. Cuide de onde você compartilha o link.</p>

      <h2>Pagamentos</h2>
      <p>O o que falta não recebe nem intermedeia pagamentos, e não vende nada.</p>

      <h2>Código aberto</h2>
      <p>O código do o que falta está sob a licença AGPL-3.0.</p>

      <h2>Lei aplicável</h2>
      <p>Estes termos seguem as leis do Brasil.</p>
    </LegalPage>
  );
}
