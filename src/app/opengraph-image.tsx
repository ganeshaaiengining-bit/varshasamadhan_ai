import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_URL } from '@/server/seo';

/**
 * The picture under a shared link.
 *
 * WhatsApp, Telegram and Facebook all show a card rather than a bare URL, and
 * the card is whatever this route returns. It is generated rather than drawn so
 * that the site's name appears on it once, from the same constant the pages
 * read, instead of being typed a second time into a PNG where it can go stale.
 *
 * ── Why the words on it are in English ─────────────────────────────────────
 * The default font bundled with `next/og` covers Latin only. Devanagari,
 * Tamil, Urdu and the rest would render as empty boxes, which is worse than a
 * language the visitor may not read — a broken card looks like a broken site.
 * The page itself, which is the thing being linked to, is in their language.
 */
export const alt = 'VARSHA SAMADHAN AI — free answers in your own words';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const host = SITE_URL.replace(/^https?:\/\//, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF8ED 0%, #FFE6C2 60%, #FFD08A 100%)',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 148,
            height: 148,
            borderRadius: 999,
            background: '#EA7400',
            color: '#FFF8ED',
            fontSize: 82,
            fontWeight: 800,
          }}
        >
          V
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 38,
            fontSize: 74,
            fontWeight: 800,
            letterSpacing: 1,
            color: '#3A2A17',
            textAlign: 'center',
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 22,
            fontSize: 38,
            color: '#6B4A21',
            textAlign: 'center',
          }}
        >
          Free answers in your own words — every Indian language
        </div>

        <div style={{ display: 'flex', marginTop: 46, fontSize: 28, color: '#8A5A20' }}>
          {host}
        </div>
      </div>
    ),
    { ...size },
  );
}
