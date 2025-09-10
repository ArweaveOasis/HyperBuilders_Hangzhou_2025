import React from 'react';

type Props = {
  product?: any;
  // simple fallback props for sample nodes
  title?: string;
  description?: string;
  image?: string;
};

export default function ProductCard({ product, title, description, image }: Props) {
  const p = product || { title, description, image, votes: 0 };
  const votes = p.votes ?? 0;
  const THRESHOLD = 100; // right-side number
  const bulbOn = votes > THRESHOLD;
  return (
    <article className="card">
      <div className="card-visual">
        {p.image ? (
          (() => {
            // p.image may be a data URL, a raw base64 string (no prefix), or a remote URL
            let src = p.image as string;
            if (!src.startsWith('data:') && !/^https?:\/\//.test(src)) {
              // assume raw base64 -> prefix as png
              src = `data:image/png;base64,${src}`;
            }
            return <img src={src} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          })()
        ) : (
          <div className="muted">No image</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{p.title}</div>
        {p.tagline && <div className="card-desc">{p.tagline}</div>}
        {p.description && <div style={{ marginTop: 8 }} className="card-desc">{p.description}</div>}
        {/* tags */}
        {Array.isArray(p.tags) && p.tags.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {p.tags.map((t: string) => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        <div className="actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="actions-left" style={{ display: 'flex', gap: 8 }}>
            <button className="btn">Submit Contribution</button>
            <button className="btn-ghost">Details</button>
          </div>

          <div className="actions-right" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: 13 }}>
            <div>{`${votes}/100`}</div>
            <div className="bulb-wrap" style={{ width: 24, height: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <defs>
                  <linearGradient id={`bulbGrad-${p.id}`} x1="0" x2="1">
                    <stop offset="0%" stopColor={bulbOn ? '#FDE68A' : '#D1D5DB'} />
                    <stop offset="100%" stopColor={bulbOn ? '#F59E0B' : '#9CA3AF'} />
                  </linearGradient>
                </defs>
                <path d="M9 21h6" stroke={bulbOn ? '#F59E0B' : '#9CA3AF'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 21h4v-1a2 2 0 00-2-2h-0a2 2 0 00-2 2v1z" fill={bulbOn ? `url(#bulbGrad-${p.id})` : '#f3f4f6'} stroke={bulbOn ? '#F59E0B' : '#9CA3AF'} strokeWidth="0.6"/>
                <path d="M12 2a6 6 0 00-4 10.5V15a1 1 0 001 1h6a1 1 0 001-1v-2.5A6 6 0 0012 2z" fill={bulbOn ? `url(#bulbGrad-${p.id})` : '#f3f4f6'} stroke={bulbOn ? '#F59E0B' : '#9CA3AF'} strokeWidth="0.6" style={{ filter: bulbOn ? 'drop-shadow(0 6px 12px rgba(245,158,11,0.18))' : 'none', opacity: bulbOn ? 1 : 0.45 }} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}