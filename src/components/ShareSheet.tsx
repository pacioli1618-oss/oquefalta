'use client';

import {useState} from 'react';
import {site} from '@/lib/site';
import {Icon, Sheet, paths} from './ui';

export function listUrl(slug: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : site.siteUrl ?? '';
  return `${origin}/l/${slug}`;
}

export function ShareSheet({slug, listName, onClose}: {slug: string; listName: string; onClose: () => void}) {
  const [copied, setCopied] = useState<'ok' | 'failed' | null>(null);
  const url = listUrl(slug);
  const message = `Fiz a lista "${listName}" no o que falta. Abra o link para ver e marcar o que já comprou (não precisa de cadastro):`;
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
    <Sheet title="Compartilhar lista" onClose={onClose}>
      <p className="sheetText">Quem abrir o link vê e edita a mesma lista. Não precisa instalar nada nem criar conta.</p>
      <div className="linkBox">
        <span>{url.replace(/^https?:\/\//, '')}</span>
        <button type="button" className="linkButton" onClick={copy} style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600}}>
          <Icon d={paths.copy} size={18} />
          {copied === 'ok' ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      {copied === 'failed' && <p className="error">Não deu para copiar. Toque e segure no link para copiar.</p>}
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <a className="primary" href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`} target="_blank" rel="noopener noreferrer">
          <Icon d={paths.message} />
          Enviar pelo WhatsApp
        </a>
        {canShare && (
          <button type="button" className="secondary" onClick={shareNative}>
            <Icon d={paths.share} />
            Outras opções
          </button>
        )}
      </div>
      <div className="trust">
        <span style={{color: 'var(--ink-soft)', flexShrink: 0, marginTop: 1}}>
          <Icon d={paths.shield} size={18} />
        </span>
        <span>Mande o link só para quem faz compras com você: quem tem o link pode editar a lista. O o que falta nunca pede senha, telefone, CPF ou pagamento.</span>
      </div>
    </Sheet>
  );
}
