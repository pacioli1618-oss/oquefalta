import Link from 'next/link';
import type {ReactNode} from 'react';
import {site} from '@/lib/site';
import {Icon, LogoMark, paths} from './ui';

export function LegalPage({title, updated, children}: {title: string; updated?: boolean; children: ReactNode}) {
  return (
    <main className="screen">
      <div className="header" style={{paddingLeft: 12}}>
        <Link href="/" className="linkButton" style={{display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', textDecoration: 'none', padding: '0 8px'}}>
          <Icon d={paths.chevronLeft} size={20} strokeWidth={2} />
          Voltar
        </Link>
        <div style={{paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8}}>
          <LogoMark size={36} />
          <h1 className="title">{title}</h1>
          {updated && <span className="label">Atualizado em {site.legalUpdatedAt}</span>}
        </div>
      </div>
      <article className="legal">
        {children}
        <h2>Contato</h2>
        <p>
          Dúvidas, pedidos sobre seus dados ou algo errado: <a href={site.contact.href}>{site.contact.label}</a>.
        </p>
      </article>
    </main>
  );
}
