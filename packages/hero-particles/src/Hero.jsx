import { useRef, useCallback } from 'react';
import HeroParticles from './components/HeroParticles.jsx';

/**
 * Hero
 *
 * Owns mouse tracking — the section element is the event target,
 * so the cursor is always visible and interactions work normally.
 * HeroParticles is pointer-events: none and sits purely as a visual layer.
 */
export default function Hero() {
  // Screen-pixel mouse position relative to the hero section.
  // Lives in a ref → never triggers a React re-render on mouse move.
  const mouseRef = useRef({ x: -99999, y: -99999 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -99999, y: -99999 };
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position:       'relative',
        width:          '100%',
        height:         '100vh',
        overflow:       'hidden',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     "'Inter', 'Geist', system-ui, sans-serif",
        userSelect:     'none',
        cursor:         'default',  // ← cursor always visible
      }}
    >
      {/* ── WebGL Particle Canvas (behind everything, no pointer events) ── */}
      <HeroParticles mouseRef={mouseRef} />

      {/* ── Hero text content ─────────────────────────────────────────── */}
      <div
        style={{
          position:      'relative',
          zIndex:        10,
          textAlign:     'center',
          padding:       '0 24px',
          pointerEvents: 'none',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize:      '10px',
            fontWeight:    700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         '#3B82F6',
            marginBottom:  '28px',
          }}
        >
          Interactive — React Three Fiber · WebGL · Spring Physics
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize:      'clamp(2.8rem, 7vw, 6rem)',
            fontWeight:    700,
            lineHeight:    0.88,
            letterSpacing: '-0.06em',
            color:         '#FFFFFF',
            margin:        0,
          }}
        >
          Particle
          <br />
          <span
            style={{
              background:           'linear-gradient(90deg, #3B82F6 0%, #60A5FA 40%, #93C5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            Universe.
          </span>
        </h1>

        {/* Sub-heading */}
        <p
          style={{
            margin:     '28px auto 0',
            fontSize:   '14px',
            fontWeight: 400,
            lineHeight: 1.7,
            color:      'rgba(255,255,255,0.42)',
            maxWidth:   '400px',
          }}
        >
          6,336 particles · spring physics · Gaussian repulsion · wave propagation.
          <br />Move your cursor to disturb the field.
        </p>

        {/* CTA — re-enable pointer events for the button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '8px',
            marginTop:      '44px',
            padding:        '12px 28px',
            borderRadius:   '999px',
            border:         '1px solid rgba(59,130,246,0.4)',
            background:     'rgba(59,130,246,0.1)',
            color:          '#93C5FD',
            fontSize:       '11px',
            fontWeight:     700,
            letterSpacing:  '0.14em',
            textTransform:  'uppercase',
            textDecoration: 'none',
            backdropFilter: 'blur(12px)',
            pointerEvents:  'all',
            cursor:         'pointer',
            transition:     'all 0.28s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background   = 'rgba(59,130,246,0.25)';
            e.currentTarget.style.borderColor  = 'rgba(59,130,246,0.7)';
            e.currentTarget.style.color        = '#DBEAFE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background   = 'rgba(59,130,246,0.1)';
            e.currentTarget.style.borderColor  = 'rgba(59,130,246,0.4)';
            e.currentTarget.style.color        = '#93C5FD';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>

      {/* ── Bottom fade vignette ───────────────────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          right:         0,
          height:        '180px',
          background:    'linear-gradient(to bottom, transparent, #050505)',
          zIndex:        5,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
