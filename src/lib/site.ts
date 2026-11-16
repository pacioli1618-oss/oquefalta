// Who runs "OQueFalta" and how to reach them: shown on the About, Privacy and Terms pages.

const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL || 'https://github.com/pacioli1618-oss/oquefalta';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

export const site = {
  name: 'OQueFalta',
  operator: 'GR1618',
  repositoryUrl,
  /** Without an e-mail, people are pointed to the repository's issues page. */
  contact: contactEmail
    ? {label: contactEmail, href: `mailto:${contactEmail}`}
    : {label: repositoryUrl.replace('https://', '') + '/issues', href: `${repositoryUrl}/issues`},
  /** "oquefalta.gr1618.io", for "links start with …"; null when unknown. */
  host: siteUrl ? new URL(siteUrl).host : null,
  siteUrl,
  /** Date of the current Privacy and Terms text (ISO; formatted in each language). */
  legalUpdatedAt: '2026-11-15',
} as const;
