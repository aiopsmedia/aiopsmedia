import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050816 0%, #0B1220 50%, #0F172A 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #22D3EE, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
              color: '#050816',
              fontFamily: 'sans-serif',
            }}
          >
            AI
          </div>
          <span
            style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#F8FAFC',
              fontFamily: 'sans-serif',
              letterSpacing: '-1px',
            }}
          >
            AIOpsMedia
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: '400',
            color: '#94A3B8',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: '1.4',
          }}
        >
          Democratizing AI for Every Business
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            width: '120px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #22D3EE, #8B5CF6)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
