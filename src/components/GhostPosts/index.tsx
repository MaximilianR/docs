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
}

export default function GhostPosts({ 
  limit = GHOST_CONFIG.postLimit 
}: GhostPostsProps): React.ReactNode {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ghost Content API endpoint
        const apiUrl = getGhostApiUrl();
        const params = getGhostApiParams(limit);

        const response = await fetch(`${apiUrl}?${params}`, {
          headers: {
            'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v', '')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.posts || []);
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
          <div className={styles.sectionTitle}>LATEST FROM CURVE</div>
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
        <div className={styles.sectionTitle}>LATEST FROM CURVE</div>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              {post.feature_image && (
                <div className={styles.postImage}>
                  <img 
                    src={post.feature_image} 
                    alt={post.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <time className={styles.postDate}>
                    {formatDate(post.published_at)}
                  </time>
                  {post.reading_time && (
                    <span className={styles.readingTime}>
                      {post.reading_time} min read
                    </span>
                  )}
                </div>
                <h3 className={styles.postTitle}>
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.postLink}
                  >
                    {post.title}
                  </a>
                </h3>
                {post.excerpt && (
                  <p className={styles.postExcerpt}>
                    {post.excerpt.replace(/<[^>]*>/g, '')} {/* Strip HTML tags */}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag.slug} className={styles.tag}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
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
