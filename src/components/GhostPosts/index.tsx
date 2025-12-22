import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { GHOST_CONFIG, getGhostApiUrl, getGhostApiParams } from '@site/src/config/ghost';

interface GhostPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published_at: string;
  feature_image?: string;
  url: string;
  reading_time?: number;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

interface GhostPostsProps {
  limit?: number;
  showPinned?: boolean;
}

export default function GhostPosts({ 
  limit = GHOST_CONFIG.postLimit,
  showPinned = true,
}: GhostPostsProps): React.ReactNode {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [pinned, setPinned] = useState<GhostPost[]>([]);
  const [featured, setFeatured] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = getGhostApiUrl();

        // Fetch latest posts
        const latestParams = getGhostApiParams(limit);
        const latestResp = await fetch(`${apiUrl}?${latestParams}`, {
          headers: {
            'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v', '')}`
          }
        });
        if (!latestResp.ok) throw new Error(`Failed to fetch posts: ${latestResp.status}`);
        const latestData = await latestResp.json();
        setPosts(latestData.posts || []);

        // Build featured (landing hero): first = newest post, next = static slugs
        try {
          const newestParams = getGhostApiParams(1, { order: 'published_at DESC' });
          const newestResp = await fetch(`${apiUrl}?${newestParams}`, { headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v','')}` } });
          const newestData = await newestResp.json();
          const first = newestData?.posts?.[0] as GhostPost | undefined;
          let list: GhostPost[] = [];
          if (first) list.push(first);
          if (GHOST_CONFIG.featuredStaticSlugs?.length) {
            const slugFilter = GHOST_CONFIG.featuredStaticSlugs.map((s) => `slug:${s}`).join(',');
            const staticParams = getGhostApiParams(GHOST_CONFIG.featuredStaticSlugs.length, { filter: slugFilter });
            const staticResp = await fetch(`${apiUrl}?${staticParams}`, { headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v','')}` } });
            const staticData = await staticResp.json();
            const staticPosts: GhostPost[] = staticData?.posts || [];
            // preserve requested order
            const orderMap = new Map(GHOST_CONFIG.featuredStaticSlugs.map((s, i) => [s, i]));
            staticPosts.sort((a, b) => (orderMap.get(a.slug) ?? 0) - (orderMap.get(b.slug) ?? 0));
            // ensure uniqueness vs newest
            const seen = new Set(list.map(p => p.id));
            for (const p of staticPosts) if (!seen.has(p.id)) list.push(p);
          }
          setFeatured(list);
        } catch {}

        // Fetch pinned posts: prefer explicit slugs, then tagged fallback
        if (showPinned) {
          let pinnedList: GhostPost[] = [];

          if (GHOST_CONFIG.pinnedSlugs && GHOST_CONFIG.pinnedSlugs.length > 0) {
            const slugFilter = GHOST_CONFIG.pinnedSlugs.map((s) => `slug:${s}`).join(",");
            const bySlugParams = getGhostApiParams(GHOST_CONFIG.pinnedLimit, { filter: slugFilter });
            const bySlugResp = await fetch(`${apiUrl}?${bySlugParams}`, {
              headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v', '')}` }
            });
            if (bySlugResp.ok) {
              const bySlugData = await bySlugResp.json();
              pinnedList = bySlugData.posts || [];
            }
          }

          if (pinnedList.length < GHOST_CONFIG.pinnedLimit) {
            const pinnedParams = getGhostApiParams(GHOST_CONFIG.pinnedLimit, { filter: `tag:${GHOST_CONFIG.pinnedTag}` });
            const pinnedResp = await fetch(`${apiUrl}?${pinnedParams}`, {
              headers: { 'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v', '')}` }
            });
            if (pinnedResp.ok) {
              const pinnedData = await pinnedResp.json();
              const fallback = pinnedData.posts || [];
              // merge unique by id
              const seen = new Set(pinnedList.map(p => p.id));
              for (const p of fallback) if (!seen.has(p.id)) pinnedList.push(p);
            }
          }

          setPinned(pinnedList.slice(0, GHOST_CONFIG.pinnedLimit));
        }
      } catch (err) {
        console.error('Error fetching Ghost posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className={styles.ghostPosts}>
        <div className="container">
        <div className={styles.sectionTitle}>INTERESTING READS</div>
          <div className={styles.loading}>Loading latest posts...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.ghostPosts}>
        <div className="container">
          <div className={styles.sectionTitle}>LATEST FROM CURVE</div>
          <div className={styles.error}>Unable to load posts: {error}</div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.ghostPosts}>
      <div className="container">
        <div className={styles.sectionTitle}>INTERESTING READS</div>

        {/* Featured block for landing: first = latest, next = static slugs */}
        {featured.length > 0 && (
          <div className={styles.postsList}>
            {featured.map((post, idx) => (
              <article key={`featured-${post.id}-${idx}`} className={styles.postListItem}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className={styles.postListLink}>
                  <div className={styles.postListContent}>
                    {post.feature_image && (
                      <div className={styles.postListImage}>
                        <img src={post.feature_image} alt={post.title} loading="lazy" />
                      </div>
                    )}
                    <div className={styles.postListText}>
                      <h3 className={styles.postListTitle}>{post.title}</h3>
                      {post.excerpt && (
                        <p className={styles.postListExcerpt}>{post.excerpt.replace(/<[^>]*>/g, '')}</p>
                      )}
                      <div className={styles.postListMeta}>
                        <time className={styles.postDate}>{formatDate(post.published_at)}</time>
                        {post.reading_time && <span className={styles.readingTime}> · {post.reading_time} min read</span>}
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}

        {/* Recent list removed per request */}
        <div className={styles.viewAll}>
          <a 
            href={`${GHOST_CONFIG.url}/`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.viewAllLink}
          >
            View All Posts →
          </a>
        </div>
      </div>
    </section>
  );
}
