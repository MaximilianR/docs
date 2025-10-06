import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { GHOST_CONFIG, getGhostApiParams, getGhostApiUrl } from '@site/src/config/ghost';

type GhostPost = {
  id: string;
  title: string;
  url: string;
  feature_image?: string;
  published_at: string;
  reading_time?: number;
};

const storageKey = (id: string) => `ghostBannerDismissed:${id}`;

export default function GhostTopBanner(): React.ReactNode {
  const [post, setPost] = useState<GhostPost | null>(null);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const url = getGhostApiUrl();
        // Always get the newest single post
        const params = getGhostApiParams(1, { order: 'published_at DESC' });
        const resp = await fetch(`${url}?${params}`, {
          headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v','')}` }
        });
        if (!resp.ok) return;
        const data = await resp.json();
        const p = (data?.posts?.[0]) as GhostPost | undefined;
        if (!p) return;
        if (localStorage.getItem(storageKey(p.id))) {
          setHidden(true);
          return;
        }
        setPost(p);
      } catch (e) {
        // ignore
      }
    };
    fetchLatest();
  }, []);

  const date = useMemo(() => {
    if (!post) return '';
    return new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [post]);

  if (!post || hidden) return null;

  return (
    <div className={styles.banner} role="region" aria-label="Latest article">
      {post.feature_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.thumb} src={post.feature_image} alt="" />
      )}
      <div className={styles.content}>
        <div className={styles.kicker}>Latest from Curve</div>
        <a href={post.url} target="_blank" rel="noopener noreferrer" className={styles.title}>{post.title}</a>
        <div className={styles.meta}>{date}{post.reading_time ? ` · ${post.reading_time} min read` : ''}</div>
      </div>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss"
        onClick={() => { if (post) localStorage.setItem(storageKey(post.id), '1'); setHidden(true); }}
      >×</button>
    </div>
  );
}


