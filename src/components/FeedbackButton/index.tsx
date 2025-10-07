import React, { useState } from 'react';
import styles from './styles.module.css';

type Props = {
  endpoint?: string; // Formspree or any POST URL
};

export default function FeedbackButton({ endpoint }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // actionUrl is resolved at submit time to ensure client-injected globals are present

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cfg = (typeof window !== 'undefined' ? (window as any).__FEEDBACK_ENDPOINT__ : undefined) as string | undefined;
    const actionUrl = (cfg || endpoint || '').toString().trim();
    if (!actionUrl) return setStatus('error');
    setStatus('sending');
    try {
      // If endpoint is a mailto:, open client directly
      if (actionUrl.startsWith('mailto:')) {
        const to = actionUrl.replace('mailto:', '');
        const subject = encodeURIComponent('Curve Docs feedback');
        const body = encodeURIComponent([
          message,
          '',
          `From: anonymous`,
          `Page: ${typeof window !== 'undefined' ? window.location.href : ''}`,
          `UA: ${typeof navigator !== 'undefined' ? navigator.userAgent : ''}`,
        ].join('\n'));
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        setStatus('sent');
        setTimeout(() => setOpen(false), 600);
        return;
      }
      const payload = {
        message,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      };
      const resp = await fetch(actionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      });
      if (!resp.ok) throw new Error(`Failed: ${resp.status}`);
      setStatus('sent');
      setMessage('');
      setTimeout(() => setOpen(false), 900);
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <>
      <button className={styles.fab} aria-label="Send feedback" onClick={() => setOpen(true)}>
        <span className={styles.help}>HELP</span>
        {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
        <img className={styles.icon} src={require('@site/static/img/favicon.png').default} alt="Feedback" />
      </button>
      {open && (
        <div className={styles.backdrop} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <form className={styles.modal} onClick={(e)=>e.stopPropagation()} onSubmit={submit}>
            <div className={styles.header}>
              <div className={styles.title}>Suggestions & corrections</div>
              <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
            <div className={styles.body}>
              <label className={styles.label}>
                <textarea aria-label="Your feedback" className={styles.textarea} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Describe the change you’d like to see or what needs fixing…" required />
              </label>
              <div className={styles.hint}>The page URL is included automatically.</div>
            </div>
            <div className={styles.footer}>
              <button type="button" className={styles.secondary} onClick={()=>setOpen(false)}>Cancel</button>
              <button type="submit" className={styles.primary} disabled={status==='sending'}>
                {status==='sending' ? 'Sending…' : status==='sent' ? 'Sent!' : 'Send'}
              </button>
              {status==='error' && <span className={styles.error}>Could not send. Try again later.</span>}
            </div>
          </form>
        </div>
      )}
    </>
  );
}


