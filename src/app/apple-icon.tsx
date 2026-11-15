import { ImageResponse } from 'next/og';

/**
 * The home-screen icon on iOS.
 *
 * iOS ignores the SVG favicon and ignores `manifest` icons when a visitor uses
 * "Add to Home Screen", so without this the site gets a grey screenshot with a
 * tiny letter on it. One plain saffron tile with the site's initial is enough —
 * the point is that it is recognisably the same tile every time, not that it
 * carries the whole design.
 */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EA7400',
          color: '#FFF8ED',
          fontSize: 108,
          fontWeight: 800,
        }}
      >
        V
      </div>
    ),
    { ...size },
  );
}
