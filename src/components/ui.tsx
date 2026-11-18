'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useRef, type ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import {iconPath} from '@/lib/icons';
import {appCommit, appVersion} from '@/lib/app-version';

/** The "o que falta" symbol: a checklist page on a tomato square (logo concept 1). */
export function LogoMark({size = 28}: {size?: number}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100">
      <rect width="100" height="100" rx="23" fill="#C2410C" />
      <rect x="23" y="17" width="54" height="66" rx="8" fill="#FFFFFF" />
      <rect x="31" y="28" width="11" height="11" rx="3" fill="#C2410C" />
      <path d="M33.8 33.6 l2.4 2.4 l4.2 -4.4" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="48" y="31" width="21" height="5" rx="2.5" fill="#C2410C" fillOpacity="0.35" />
      <rect x="32.5" y="45.5" width="8" height="8" rx="2" fill="none" stroke="#C2410C" strokeWidth="3" />
      <rect x="48" y="47" width="21" height="5" rx="2.5" fill="#C2410C" />
      <rect x="32.5" y="61.5" width="8" height="8" rx="2" fill="none" stroke="#C2410C" strokeWidth="3" />
      <rect x="48" y="63" width="15" height="5" rx="2.5" fill="#C2410C" />
    </svg>
  );
}

export function Brand({href = '/listas'}: {href?: string}) {
  const t = useTranslations('Brand');
  return (
    <Link href={href} className="brand" aria-label={t('homeLabel')}>
      <LogoMark />
      <span className="wordmark">
        oque<span className="wordmarkAccent">falta</span>
      </span>
    </Link>
  );
}

/** Stroke icon from a path (24px grid). */
export function Icon({d, size = 20, strokeWidth = 1.75}: {d: string; size?: number; strokeWidth?: number}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function CategoryIcon({icon, size = 18}: {icon: string; size?: number}) {
  return <Icon d={iconPath(icon)} size={size} />;
}

export const paths = {
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  chevronDown: 'm6 9 6 6 6-6',
  chevronUp: 'm6 15 6-6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  chevronLeft: 'm15 6-6 6 6 6',
  tag: 'M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7l8.8 8.8a1.5 1.5 0 0 1 0 2.1l-7.1 7.1a1.5 1.5 0 0 1-2.1 0ZM8 7a1 1 0 1 1 0 2 1 1 0 1 1 0-2Z',
  share: 'M18 2a3 3 0 1 1 0 6 3 3 0 1 1 0-6ZM6 9a3 3 0 1 1 0 6 3 3 0 1 1 0-6ZM18 16a3 3 0 1 1 0 6 3 3 0 1 1 0-6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  list: 'M9 6h11M9 12h11M9 18h7M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
  copy: 'M9 9h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2ZM5 15V5a2 2 0 0 1 2-2h10',
  message: 'M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6ZM9 12l2 2 4-4',
  phone: 'M8.5 2.5h7a2.5 2.5 0 0 1 2.5 2.5v14a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 19V5a2.5 2.5 0 0 1 2.5-2.5ZM11 18.5h2',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  pencil: 'M4 20h4L19 9l-4-4L4 16ZM13.5 6.5l4 4',
  install: 'M8.5 2.5h7a2.5 2.5 0 0 1 2.5 2.5v14a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 19V5a2.5 2.5 0 0 1 2.5-2.5ZM12 7v7M9 11l3 3 3-3M11 18.5h2',
};

/** "Gratuito · Open source · Sem cadastro", the GR1618 Labs endorsement, the legal links and the app version. */
export function Disclaimers() {
  const t = useTranslations('Footer');
  return (
    <>
      <p className="fine">
        {t('badges')}
        <br />
        {t('endorsement')}
      </p>
      <nav className="legalLinks" aria-label={t('linksLabel')}>
        <Link href="/sobre">{t('about')}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacidade">{t('privacy')}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/termos">{t('terms')}</Link>
      </nav>
      <p className="appVersion">
        {t('version', {version: appVersion})}
        {appCommit && ` · ${appCommit}`}
      </p>
    </>
  );
}

/** Bottom sheet dialog. Closes on backdrop tap and Escape. */
export function Sheet({title, onClose, children}: {title: string; onClose: () => void; children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="sheetBackdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="grabber" aria-hidden="true" />
        <h2 className="sheetTitle">{title}</h2>
        {children}
      </div>
    </div>
  );
}
