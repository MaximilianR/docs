import React from 'react';
import styles from './styles.module.css';

export default function ProtocolCard({ 
  name, 
  logo,
  logos // For multiple logos (like liquid lockers)
}) {
  // If multiple logos are provided, render them side by side
  if (logos && logos.length > 0) {
    return (
      <div className={styles.protocolCard}>
        <div className={styles.protocolCardContent}>
          <div className={styles.protocolCardMultipleLogos}>
            {logos.map((logoItem, index) => {
              // Special case for "100+" - show as text instead of image
              if (logoItem === "100+") {
                return (
                  <div 
                    key={`${logoItem}-${index}`}
                    className={styles.protocolCardTextLogo}
                  >
                    {logoItem}
                  </div>
                );
              }
              
              // Check if it's a valid image file (has .svg, .png, .jpg extension)
              const isImageFile = /\.(svg|png|jpg|jpeg)$/i.test(logoItem);
              
              if (!isImageFile) {
                // If it's not an image file, show as text
                return (
                  <div 
                    key={`${logoItem}-${index}`}
                    className={styles.protocolCardTextLogo}
                  >
                    {logoItem}
                  </div>
                );
              }
              
              const logoPath = `/img/logos/${logoItem}`;
              return (
                <div 
                  key={`${logoItem}-${index}`}
                  className={styles.protocolCardOverlappingLogo}
                >
                  <img 
                    src={logoPath} 
                    alt={`${name} logo ${index + 1}`}
                    loading="eager"
                    onLoad={() => console.log(`✅ Loaded: ${logoPath}`)}
                    onError={(e) => {
                      console.error(`❌ Failed to load: ${logoPath}`);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                  <div 
                    className={styles.protocolCardLogoFallback} 
                    style={{ display: 'none' }}
                  >
                    {logoItem.charAt(0).toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.protocolCardTitle}>
            {name}
          </div>
        </div>
      </div>
    );
  }

  // Single logo rendering
  return (
    <div className={styles.protocolCard}>
      <div className={styles.protocolCardContent}>
        <div className={styles.protocolCardLogo}>
          {logo === "100+" ? (
            <div className={styles.protocolCardTextLogo}>
              {logo}
            </div>
          ) : logo ? (
            <img 
              src={`/img/logos/${logo}`} 
              alt={name} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div className={styles.protocolCardLogoFallback} style={{ display: logo ? 'none' : 'block' }}>
            {name.charAt(0)}
          </div>
        </div>
        <div className={styles.protocolCardTitle}>
          {name}
        </div>
      </div>
    </div>
  );
}
