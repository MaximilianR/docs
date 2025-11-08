import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import styles from '../ChainPresence/styles.module.css';

/**
 * BadgeGrid - A reusable component for displaying styled badge boxes
 * 
 * Reuses the same styling as ChainPresence but accepts data as props instead of fetching from APIs.
 * 
 * @example
 * ```tsx
 * <BadgeGrid
 *   cards={[
 *     {
 *       title: "DEX",
 *       logo: "/img/logos/curve-monitor.png",
 *       description: "Curve is deployed on multiple chains",
 *       badges: [
 *         { label: "Ethereum" },
 *         { label: "Arbitrum" },
 *         { label: "Base" }
 *       ]
 *     },
 *     {
 *       title: "Lending",
 *       badges: [
 *         { label: "Ethereum" },
 *         { label: "Arbitrum" }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */

type BadgeItem = {
  label: string;
  icon?: string; // Optional custom icon path (overrides automatic chain icon lookup)
};

type Card = {
  title: string;
  logo?: string | { light: string; dark: string }; // Optional logo image path(s) - can be a single path or an object with light/dark paths
  description?: string; // Optional description text
  href?: string; // Optional link URL (makes the card clickable)
  badges?: BadgeItem[]; // Optional badges/chips to display (e.g., chain names)
};

type BadgeGridProps = {
  cards: Card[];
};

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Badge({ label, icon }: { label: string; icon?: string }) {
  const slug = toSlug(label);
  const exts = ['svg', 'png', 'webp'];
  const [idx, setIdx] = React.useState(0);
  const [hasTried, setHasTried] = React.useState(false);
  
  // Use custom icon if provided, otherwise try to find chain icon
  const src = icon || (idx < exts.length ? `/img/chains/${slug}.${exts[idx]}` : '');

  const handleError = () => {
    if (!icon && idx < exts.length - 1) {
      setIdx(idx + 1);
    } else {
      setHasTried(true);
    }
  };

  return (
    <span className={styles.badge}>
      {!hasTried && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={styles.badgeIcon} onError={handleError} />
      )}
      {label.toUpperCase()}
    </span>
  );
}

export default function BadgeGrid({ cards }: BadgeGridProps): React.ReactNode {
  const {colorMode} = useColorMode();
  const cardCount = cards.length;
  let gridClass = '';
  
  if (cardCount === 3) {
    gridClass = styles.gridThree;
  } else if (cardCount > 3) {
    gridClass = styles.gridFour;
  }
  
  const getLogoPath = (logo: string | { light: string; dark: string } | undefined): string | null => {
    if (!logo) return null;
    
    if (typeof logo === 'string') {
      return logo;
    }
    
    // Logo is an object with light/dark paths
    return colorMode === 'dark' ? logo.dark : logo.light;
  };
  
  return (
    <section className={styles.section}>
      <div className={`${styles.grid} ${gridClass}`}>
        {cards.map((card, cardIdx) => {
          const logoPath = getLogoPath(card.logo);
          
          const CardContent = (
            <>
              <div className={styles.cardTitle}>
                {logoPath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPath} alt="" className={styles.cardTitleLogo} />
                )}
                {/* Guide icon for clickable cards */}
                {card.href && (
                  <svg 
                    className={styles.guideIcon}
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )}
                <span style={{ flex: 1 }}>{card.title}</span>
                {/* Arrow icon for clickable cards */}
                {card.href && (
                  <svg 
                    className={styles.arrowIcon}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </div>
              {card.description && (
                <div className={styles.groupLabel}>{card.description}</div>
              )}
              {card.badges && card.badges.length > 0 && (
                <div className={styles.badgeWrap}>
                  {card.badges.map((badge, badgeIdx) => (
                    <Badge 
                      key={badgeIdx} 
                      label={badge.label} 
                      icon={badge.icon}
                    />
                  ))}
                </div>
              )}
            </>
          );

          return (
            <div key={cardIdx} className={`${styles.card} ${card.href ? styles.cardClickable : ''}`}>
              {card.href ? (
                <a href={card.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  {CardContent}
                </a>
              ) : (
                CardContent
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

