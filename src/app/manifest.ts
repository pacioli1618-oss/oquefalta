import type {MetadataRoute} from 'next';

// /manifest.webmanifest: lets people add "oquefalta" to the home screen. No service worker:
// the list is live (Supabase + Realtime). Opens on "/", which jumps to the last list used.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'oquefalta',
    short_name: 'oquefalta',
    description: 'Lista de compras compartilhada, sem cadastro.',
    lang: 'pt-BR',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f3f4f6',
    theme_color: '#c2410c',
    icons: [
      {src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
      {src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
    ],
  };
}
