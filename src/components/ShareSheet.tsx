'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {site} from '@/lib/site';
import {Icon, Sheet, paths} from './ui';

export function listUrl(slug: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : site.siteUrl ?? '';
  return `${origin}/l/${slug}`;
}

export function ShareSheet({slug, listName, onClose}: {slug: string; listName: string; onClose: () => void}) {
  const t = useTranslations('Share');
  const common = useTranslations('Common');
  const [copied, setCopied] = useState<'ok' | 'failed' | null>(null);
  const url = listUrl(slug);
  const message = t('message', {name: listName});
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied('ok');
    } catch {
      setCopied('failed');
    }
  }

  async function shareNative() {
    try {
      await navigator.share({title: listName, text: message, url});
    } catch {
      // Cancelled: nothing to do.
    }
  }

  return (
    <Sheet title={common('share')} onClose={onClose}>
      <p className="sheetText">{t('intro')}</p>
      <div className="linkBox">
        <span>{url.replace(/^https?:\/\//, '')}</span>
        <button type="button" className="linkButton" onClick={copy} style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600}}>
          <Icon d={paths.copy} size={18} />
          {copied === 'ok' ? t('copied') : t('copy')}
        </button>
      </div>
      {copied === 'failed' && <p className="error">{t('copyFailed')}</p>}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <a className="primary" href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`} target="_blank" rel="noopener noreferrer">
          <Icon d={paths.message} />
          {t('whatsapp')}
        </a>
        {canShare && (
          <button type="button" className="secondary" onClick={shareNative}>
            <Icon d={paths.share} />
            {t('more')}
          </button>
        )}
      </div>
      <div className="trust">
        <span style={{color: 'var(--ink-soft)', flexShrink: 0, marginTop: 1}}>
          <Icon d={paths.shield} size={18} />
        </span>
        <span>{t('safety')}</span>
      </div>
    </Sheet>
  );
}
