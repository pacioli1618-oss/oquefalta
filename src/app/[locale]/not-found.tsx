import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <main className="screen">
      <div className="empty" style={{marginTop: 80}}>
        <p className="emptyTitle">{t('title')}</p>
        {t('text')}
        <div style={{marginTop: 24}}>
          <Link className="primary" href="/">
            {t('open')}
          </Link>
        </div>
      </div>
    </main>
  );
}
