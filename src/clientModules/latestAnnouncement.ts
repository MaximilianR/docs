import { GHOST_CONFIG, getGhostApiParams, getGhostApiUrl } from '@site/src/config/ghost';

async function updateAnnouncement() {
  try {
    const el = document.getElementById('latest-annc');
    if (!el) return;
    const url = getGhostApiUrl();
    const params = getGhostApiParams(1, { order: 'published_at DESC' });
    const resp = await fetch(`${url}?${params}`, {
      headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v','')}` },
    });
    if (!resp.ok) return;
    const data = await resp.json();
    const p = data?.posts?.[0];
    if (!p) return;
    const imgHtml = p.feature_image
      ? `<img src="${p.feature_image}" style="width:18px;height:18px;object-fit:cover;border-radius:3px;vertical-align:-3px;margin-right:6px;" alt=""/>`
      : '';
    el.innerHTML = `${imgHtml}<a target="_blank" rel="noopener noreferrer" href="${p.url}">${p.title}</a>`;
  } catch {
    // ignore
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateAnnouncement());
  } else {
    updateAnnouncement();
  }
}


