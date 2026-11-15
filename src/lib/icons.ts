// Category icons: 24px grid, 1.75 stroke, round caps. One path per icon so they can be
// rendered from data. The keys are stored in the database (categories.icon); the spoken
// label of each icon comes from messages/<locale>.json → Icons.

export const ICONS = {
  hortifruti: {
    d: 'M12 7.5c-1.6-1.3-5.2-1.6-6.3 1.4-1.1 3.1.6 7.6 3.2 9.7 1 .8 2.1.6 3.1 0 1 .6 2.1.8 3.1 0 2.6-2.1 4.3-6.6 3.2-9.7C17.2 5.9 13.6 6.2 12 7.5ZM12 7.5c0-2.2 1.1-3.8 3.2-4.5',
  },
  padaria: {
    d: 'M6 11.5C4.3 11 3.5 9.6 4 8.2 4.7 6 8 5 12 5s7.3 1 8 3.2c.5 1.4-.3 2.8-2 3.3V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2ZM10 9.5l-1 2.5M15 9.5l-1 2.5',
  },
  laticinios: {
    d: 'M8.5 2.5h7v3l2.5 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V9.5l2.5-4ZM8.5 5.5h7M6 9.5h12M10 14h4',
  },
  carnes: {
    d: 'M7 4.5c5-1.5 13 2 13 8 0 4.5-4 7-9 7-4.5 0-7.5-2.5-7.5-6 0-4 1-7.5 3.5-9ZM12.5 11a2 2 0 1 1 0 4 2 2 0 1 1 0-4Z',
  },
  mercearia: {d: 'M6 3.5h12v3.5H6ZM7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2ZM10 12h4'},
  bebidas: {d: 'M10 2.5h4v3.5l2 3V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20V9l2-3ZM8 13h8'},
  congelados: {
    d: 'M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2 3.8 16.8M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2',
  },
  limpeza: {
    d: 'M8 10h6l1.5 3v7a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20v-7ZM9 10V5h5.5l2.5 2M12 5V3M19.5 4h.01M19.5 8h.01M21 6h.01',
  },
  higiene: {
    d: 'M5 12h11a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3ZM17 2.5a2 2 0 1 1 0 4 2 2 0 1 1 0-4ZM11 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 1 1 0-3Z',
  },
  pet: {
    d: 'M12 13c-2.8 0-5 2.6-5 5 0 1.5 1.2 2.5 2.7 2.5.9 0 1.5-.5 2.3-.5s1.4.5 2.3.5c1.5 0 2.7-1 2.7-2.5 0-2.4-2.2-5-5-5ZM6 8.5a1.8 2.2 0 1 1 0 4.4 1.8 2.2 0 1 1 0-4.4ZM18 8.5a1.8 2.2 0 1 1 0 4.4 1.8 2.2 0 1 1 0-4.4ZM9.5 3.5a1.8 2.2 0 1 1 0 4.4 1.8 2.2 0 1 1 0-4.4ZM14.5 3.5a1.8 2.2 0 1 1 0 4.4 1.8 2.2 0 1 1 0-4.4Z',
  },
  farmacia: {d: 'M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7ZM8.5 8.5l7 7'},
  casa: {d: 'M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20ZM9.5 21.5V14h5v7.5'},
  presente: {
    d: 'M3.5 8h17v4h-17ZM5 12h14v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20ZM12 8v13.5M12 8C10.5 5 6.5 4 6.5 6.5S10 8 12 8Zm0 0c1.5-3 5.5-4 5.5-1.5S14 8 12 8Z',
  },
  outros: {
    d: 'M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7l8.8 8.8a1.5 1.5 0 0 1 0 2.1l-7.1 7.1a1.5 1.5 0 0 1-2.1 0ZM8 7a1 1 0 1 1 0 2 1 1 0 1 1 0-2Z',
  },
} satisfies Record<string, {d: string}>;

export type IconKey = keyof typeof ICONS;

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export function isIconKey(key: string): key is IconKey {
  return key in ICONS;
}

export function iconPath(key: string): string {
  return ICONS[isIconKey(key) ? key : 'outros'].d;
}
