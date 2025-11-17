import React, { useEffect, useState } from 'react';
import { GHOST_CONFIG, getGhostApiUrl, getGhostApiParams } from '@site/src/config/ghost';
import styles from './styles.module.css';

interface GhostPost {
  id: string;
  title: string;
  html: string;
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

interface GhostArticleProps {
  slug: string;
  ghostApiKey?: string; // Optional override for different API key
  showTitle?: boolean;
  showMeta?: boolean;
  preview?: boolean; // Show preview (excerpt) instead of full content
  previewLength?: number; // Max characters for preview if excerpt not available
  className?: string;
}

export default function GhostArticle({
  slug,
  ghostApiKey,
  showTitle = true,
  showMeta = true,
  preview = true,
  previewLength = 300,
  className = '',
}: GhostArticleProps): React.ReactNode {
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use provided API key or fall back to config
        const apiUrl = getGhostApiUrl();
        
        // Fetch post by slug using the same pattern as GhostPosts
        const params = getGhostApiParams(1, { filter: `slug:${slug}` });
        
        // Override API key if provided
        if (ghostApiKey) {
          params.set('key', ghostApiKey);
        }

        const response = await fetch(`${apiUrl}?${params}`, {
          headers: {
            'Accept-Version': `v${GHOST_CONFIG.apiVersion.replace('v', '')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.status}`);
        }

        const data = await response.json();
        const posts = data.posts || [];
        
        if (posts.length === 0) {
          throw new Error(`Article with slug "${slug}" not found`);
        }

        setPost(posts[0]);
      } catch (err) {
        console.error('Error fetching Ghost article:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, ghostApiKey]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={className}>
        <div className={styles.loading}>Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className={styles.error}>
          Unable to load article: {error}
          <br />
          <a 
            href={`https://news.curve.finance/${slug}/`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Read on Curve News →
          </a>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <a 
      href={post.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${styles.postCard} ${styles.postCardLink} ${className}`}
    >
      {post.feature_image && (
        <div className={styles.postImage}>
          <img src={post.feature_image} alt={post.title} loading="lazy" />
        </div>
      )}
      
      <div className={styles.postContent}>
        {showMeta && (
          <div className={styles.postMeta}>
            <time className={styles.postDate}>{formatDate(post.published_at)}</time>
            {post.reading_time && (
              <span className={styles.readingTime}>{post.reading_time} min read</span>
            )}
          </div>
        )}
        
        {showTitle && (
          <h3 className={styles.postTitle}>
            {post.title}
          </h3>
        )}

        {preview ? (
          <>
            {post.excerpt ? (
              <p className={styles.postExcerpt}>{post.excerpt.replace(/<[^>]*>/g, '')}</p>
            ) : (
              <p className={styles.postExcerpt}>
                {post.html.replace(/<[^>]*>/g, '').substring(0, previewLength)}
                {post.html.replace(/<[^>]*>/g, '').length > previewLength && '...'}
              </p>
            )}
          </>
        ) : (
          <div 
            className={styles.postExcerpt}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        )}
      </div>
    </a>
  );
}

