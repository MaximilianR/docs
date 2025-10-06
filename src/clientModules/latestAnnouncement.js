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
    if (!resp.ok) {
      el.innerHTML = `Latest from Curve: <a target="_blank" rel="noopener noreferrer" href="https://news.curve.finance/">Read the newest post</a>`;
      return;
    }
    const data = await resp.json();
    const p = data && data.posts && data.posts[0];
    if (!p) {
      el.innerHTML = `Latest from Curve: <a target="_blank" rel="noopener noreferrer" href="https://news.curve.finance/">Read the newest post</a>`;
      return;
    }
    const imgHtml = p.feature_image
      ? `<img src="${p.feature_image}" style="width:18px;height:18px;object-fit:cover;border-radius:3px;vertical-align:-3px;margin-right:6px;" alt=""/>`
      : '';
    el.innerHTML = `${imgHtml}<a target="_blank" rel="noopener noreferrer" href="${p.url}">${p.title}</a>`;
  } catch (e) {
    // leave default content
  }
}

if (typeof window !== 'undefined') {
  const tryInit = () => {
    const el = document.getElementById('latest-annc');
    if (el) updateAnnouncement();
    else setTimeout(tryInit, 200);
  };
  tryInit();
}


