import React, { useEffect, useState } from 'react';
import { GHOST_CONFIG, getGhostApiParams, getGhostApiUrl } from '@site/src/config/ghost';

export default function Root({ children }) {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const url = getGhostApiUrl();
        const params = getGhostApiParams(1, { order: 'published_at DESC' });
        const resp = await fetch(`${url}?${params}`, { headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v','')}` } });
        if (!resp.ok) return;
        const data = await resp.json();
        const p = data?.posts?.[0];
        if (p) {
          setBanner({ title: p.title, url: p.url, image: p.feature_image });
          // Also inject into the announcement bar placeholder (after hydration)
          const el = document.getElementById('latest-annc');
          if (el) {
            const img = p.feature_image ? `<img src="${p.feature_image}" style="width:18px;height:18px;object-fit:cover;border-radius:3px;vertical-align:-3px;margin-right:6px;" alt=""/>` : '';
            el.innerHTML = `${img}<a target="_blank" rel="noopener noreferrer" href="${p.url}">${p.title}</a>`;
          }
        }
      } catch {}
    };
    fetchLatest();
  }, []);

  return (
    <>
      {banner && (
        <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--Layer-2-Fill)',borderBottom:'1px solid var(--Layer-2-Outline)',padding:'6px 12px'}}>
          {banner.image && <img src={banner.image} alt="" style={{width:24,height:24,objectFit:'cover',borderRadius:4}} />}
          <a href={banner.url} target="_blank" rel="noopener noreferrer" style={{color:'var(--Text-TextColors-Primary)',fontWeight:600,textDecoration:'none'}}>Latest: {banner.title}</a>
        </div>
      )}
      {children}
    </>
  );
}


