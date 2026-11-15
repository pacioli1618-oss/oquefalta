import {useFormatter, useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {site} from '@/lib/site';
import {Icon, LogoMark, paths} from './ui';

export function LegalPage({title, updated, children}: {title: string; updated?: boolean; children: ReactNode}) {
  const t = useTranslations('Legal');
  const common = useTranslations('Common');
  const format = useFormatter();
  const date = format.dateTime(new Date(`${site.legalUpdatedAt}T12:00:00Z`), {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

  return (
    <main className="screen">
      <div className="header" style={{paddingLeft: 12}}>
        <Link href="/" className="linkButton" style={{display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', textDecoration: 'none', padding: '0 8px'}}>
          <Icon d={paths.chevronLeft} size={20} strokeWidth={2} />
          {common('back')}
        </Link>
        <div style={{paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8}}>
          <LogoMark size={36} />
          <h1 className="title">{title}</h1>
          {updated && <span className="label">{t('updatedAt', {date})}</span>}
        </div>
      </div>
      <article className="legal">
        {children}
        <h2>{t('contactTitle')}</h2>
        <p>
          {t.rich('contact', {
            label: site.contact.label,
            link: (chunks) => <a href={site.contact.href}>{chunks}</a>,
          })}
        </p>
      </article>
    </main>
  );
}
