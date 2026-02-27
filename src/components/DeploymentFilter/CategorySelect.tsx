import React from 'react';
import { formatCategoryName } from './constants';
import { useDropdown } from './useDropdown';
import styles from './styles.module.css';

export function CategorySelect({
  categories,
  value,
  onChange,
  onOpenChange,
  isControlledOpen,
  onControlledClose
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isControlledOpen?: boolean;
  onControlledClose?: () => void;
}) {
  const { isOpen, handleToggle } = useDropdown({ onOpenChange, isControlledOpen, onControlledClose });

  const selectedCategoryName = value === 'all' ? 'All Categories' : formatCategoryName(value);

  return (
    <div className={styles.customSelect}>
      <button
        type="button"
        className={styles.selectButton}
        onClick={() => handleToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={styles.selectButtonContent}>
          <span>{selectedCategoryName}</span>
        </div>
        <svg
          className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.selectDropdown}>
          <button
            type="button"
            className={`${styles.selectOption} ${value === 'all' ? styles.selectOptionActive : ''}`}
            onClick={() => {
              onChange('all');
              handleToggle(false);
            }}
          >
            <input
              type="radio"
              checked={value === 'all'}
              onChange={() => {}}
              className={styles.radio}
            />
            <span>All Categories</span>
          </button>
          {categories.map(category => {
            const isSelected = value === category;
            return (
              <button
                key={category}
                type="button"
                className={`${styles.selectOption} ${isSelected ? styles.selectOptionActive : ''}`}
                onClick={() => {
                  onChange(category);
                  handleToggle(false);
                }}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => {}}
                  className={styles.radio}
                />
                <span>{formatCategoryName(category)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
