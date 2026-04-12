import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './styles.module.css';

const THEME_KEY = 'curve-theme';

// Three themes: light → dark → chad → light
const THEMES = ['light', 'dark', 'chad'];

const THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  chad: 'Chad',
};

const THEME_ICONS = {
  light: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
      />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12.43 2.3c-2.38-.59-4.68-.27-6.63.64-.35.16-.41.64-.1.86C8.3 5.6 10 8.6 10 12c0 3.4-1.7 6.4-4.3 8.2-.32.22-.26.7.09.86 1.28.6 2.71.94 4.21.94 6.05 0 10.85-5.38 9.87-11.6-.61-3.92-3.59-7.16-7.44-8.1z"
      />
    </svg>
  ),
  chad: (
    <img src="/img/chad.png" width="20" height="20" alt="" aria-hidden style={{imageRendering: 'pixelated'}} />
  ),
};

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'chad') {
    html.setAttribute('data-theme', 'light');
    html.setAttribute('data-curve-theme', 'chad');
  } else {
    html.setAttribute('data-theme', theme);
    html.removeAttribute('data-curve-theme');
  }
}

export default function ColorModeToggle({className}) {
  const isBrowser = useIsBrowser();
  const {setColorMode} = useColorMode();
  const [theme, setTheme] = useState('light');

  // Initialize from localStorage
  useEffect(() => {
    if (!isBrowser) return;
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.includes(stored)) {
      setTheme(stored);
      applyTheme(stored);
      if (stored !== 'chad') {
        setColorMode(stored);
      }
    } else {
      // Read current Docusaurus theme
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current);
    }
  }, [isBrowser]);

  // Guard against Docusaurus resetting data-theme when chad is active
  useEffect(() => {
    if (!isBrowser || theme !== 'chad') return;
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      if (html.getAttribute('data-curve-theme') === 'chad' &&
          html.getAttribute('data-theme') !== 'light') {
        html.setAttribute('data-theme', 'light');
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [isBrowser, theme]);

  const cycleTheme = useCallback(() => {
    const currentIdx = THEMES.indexOf(theme);
    const nextTheme = THEMES[(currentIdx + 1) % THEMES.length];

    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);

    // Sync Docusaurus internal state for light/dark
    if (nextTheme !== 'chad') {
      setColorMode(nextTheme);
    } else {
      setColorMode('light');
    }
  }, [theme, setColorMode]);

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx('clean-btn', styles.toggleButton)}
        type="button"
        onClick={cycleTheme}
        disabled={!isBrowser}
        title={`${THEME_LABELS[theme]} mode`}
        aria-label={`Switch theme (currently ${THEME_LABELS[theme]})`}>
        {THEME_ICONS[theme]}
      </button>
    </div>
  );
}
