import React from 'react';
import styles from './GuideCard.module.css';

export default function GuideCard({ title, description, image, link }) {
  return (
    <a href={link} className={styles.card}>
      {image && <img src={require(`@site/static/img/${image}`).default} alt={title} className={styles.cardImage} />}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </a>
  );
}