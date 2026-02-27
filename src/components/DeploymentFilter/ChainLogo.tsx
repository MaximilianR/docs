import React from 'react';
import { toSlug } from './constants';
import styles from './styles.module.css';

export function ChainLogo({ chain }: { chain: string }) {
  const slug = toSlug(chain);
  const exts = ['svg', 'png', 'webp'];
  const [idx, setIdx] = React.useState(0);
  const [hasTried, setHasTried] = React.useState(false);

  const src = idx < exts.length ? `/img/chains/${slug}.${exts[idx]}` : '';

  const handleError = () => {
    if (idx < exts.length - 1) {
      setIdx(idx + 1);
    } else {
      setHasTried(true);
    }
  };

  if (hasTried || !src) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={styles.chainLogo}
      onError={handleError}
    />
  );
}
