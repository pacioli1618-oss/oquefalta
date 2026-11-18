// Who runs "OQueFalta" and how to reach them: shown on the About, Privacy and Terms pages.

const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL || 'https://github.com/pacioli1618-oss/oquefalta';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

export const site = {
  name: 'OQueFalta',
  operator: 'GR1618',
  repositoryUrl,
  /**
   * Contact goes through comments on the app's launch post on gr1618.io. WordPress holds every
   * comment until the editor approves it, so data requests are read but never published.
   */
  contact: {label: 'gr1618.io/apresentando-o-o-que-falta', href: 'https://gr1618.io/apresentando-o-o-que-falta/#respond'},
  /** "oquefalta.gr1618.io", for "links start with …"; null when unknown. */
  host: siteUrl ? new URL(siteUrl).host : null,
  siteUrl,
  /** Date of the current Privacy and Terms text (ISO; formatted in each language). */
  legalUpdatedAt: '2026-11-18',
} as const;
