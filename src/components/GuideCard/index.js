import React from 'react';

export default function GuideCard({ title, description, image, link }) {
  return (
    <a href={link} className="guide-card">
      {image && <img src={require(`@site/static/img/${image}`).default} alt={title} className="guide-card-image" />}
      <div className="guide-card-content">
        <h3 className="guide-card-title">{title}</h3>
        <p className="guide-card-description">{description}</p>
      </div>
    </a>
  );
}