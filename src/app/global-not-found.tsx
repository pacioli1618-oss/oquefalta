import Link from 'next/link';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './globals.css';

// 404 for URLs that match no route. It lives outside [locale], so it has no
// translations: one short line in the three languages.
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body>
        <main className="screen">
          <div className="empty" style={{marginTop: 80}}>
            <p className="emptyTitle">Página não encontrada · Página no encontrada · Page not found</p>
            <div style={{marginTop: 24}}>
              <Link className="primary" href="/">
                o que falta
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
