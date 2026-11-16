'use client';

import {useTranslations} from 'next-intl';
import {useCallback, useState, useSyncExternalStore} from 'react';
import {getInstallMode, getServerInstallMode, promptInstall, subscribeToInstall} from '@/lib/install';
import {Icon, Sheet, paths} from './ui';

/**
 * "Fixar na tela do celular". Hidden when the app is already installed or open from the home
 * screen, and on desktop browsers that can't install it.
 */
export function InstallButton() {
  const t = useTranslations('Install');
  const mode = useSyncExternalStore(subscribeToInstall, getInstallMode, getServerInstallMode);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (mode === 'hidden') return null;

  const steps = mode === 'ios' ? [t('ios1'), t('ios2'), t('ios3')] : [t('menu1'), t('menu2')];

  return (
    <>
      <button
        type="button"
        className="linkButton"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, width: '100%'}}
        onClick={async () => {
          if (mode === 'prompt' && (await promptInstall())) return;
          setOpen(true);
        }}
      >
        <Icon d={paths.install} size={20} />
        {t('button')}
      </button>
      {open && (
        <Sheet title={t('title')} onClose={close}>
          <p className="sheetText">{t('intro')}</p>
          <ol style={{margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 16, lineHeight: '24px'}}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <button type="button" className="primary" onClick={close}>
            {t('done')}
          </button>
        </Sheet>
      )}
    </>
  );
}
