import React from 'react';

export default function InlinePill({ icon, label }) {
  return (
    <div className="inline-pill">
      <img src={icon} className="inline-icon" />
      <span>{label}</span>
    </div>
  );
}
