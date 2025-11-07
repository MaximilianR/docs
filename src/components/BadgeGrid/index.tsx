import React from 'react';
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
  logo?: string; // Optional logo image path (e.g., "/img/logos/curve-monitor.png")
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
  const hasMoreThanTwo = cards.length > 2;
  
  return (
    <section className={styles.section}>
      <div className={`${styles.grid} ${hasMoreThanTwo ? styles.gridFour : ''}`}>
        {cards.map((card, cardIdx) => {
          const CardContent = (
            <>
              <div className={styles.cardTitle}>
                {card.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.logo} alt="" className={styles.cardTitleLogo} />
                )}
                {card.title}
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
            <div key={cardIdx} className={styles.card}>
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

