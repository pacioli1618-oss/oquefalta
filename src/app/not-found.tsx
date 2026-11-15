import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="screen">
      <div className="empty" style={{marginTop: 80}}>
        <p className="emptyTitle">Página não encontrada</p>
        Confira se o link está completo.
        <div style={{marginTop: 24}}>
          <Link className="primary" href="/">
            Abrir o o que falta
          </Link>
        </div>
      </div>
    </main>
  );
}
