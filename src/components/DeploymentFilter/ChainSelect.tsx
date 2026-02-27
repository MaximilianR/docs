import React from 'react';
import { formatChainName } from './constants';
import { ChainLogo } from './ChainLogo';
import { useDropdown } from './useDropdown';
import styles from './styles.module.css';

export function ChainSelect({
  chains,
  value,
  onChange,
  onOpenChange,
  isControlledOpen,
  onControlledClose
}: {
  chains: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isControlledOpen?: boolean;
  onControlledClose?: () => void;
}) {
  const { isOpen, handleToggle } = useDropdown({ onOpenChange, isControlledOpen, onControlledClose });

  const handleToggleChain = (chain: string) => {
    if (chain === 'all') {
      onChange([]);
    } else {
      const newValue = value.includes(chain)
        ? value.filter(c => c !== chain)
        : [...value, chain];
      onChange(newValue);
    }
  };

  const handleSelectAll = () => {
    onChange([]);
  };

  const isAllSelected = value.length === 0;
  const selectedCount = value.length;

  const getButtonText = () => {
    if (isAllSelected) return 'All Chains';
    if (selectedCount === 1) return formatChainName(value[0]);
    return `${selectedCount} chains selected`;
  };

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
          {!isAllSelected && selectedCount === 1 && <ChainLogo chain={value[0]} />}
          <span>{getButtonText()}</span>
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
            className={`${styles.selectOption} ${isAllSelected ? styles.selectOptionActive : ''}`}
            onClick={() => {
              handleSelectAll();
              handleToggle(false);
            }}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => {}}
              className={styles.checkbox}
            />
            <span>All Chains</span>
          </button>
          {chains.map(chain => {
            const isSelected = value.includes(chain);
            return (
              <button
                key={chain}
                type="button"
                className={`${styles.selectOption} ${isSelected ? styles.selectOptionActive : ''}`}
                onClick={() => handleToggleChain(chain)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className={styles.checkbox}
                />
                <ChainLogo chain={chain} />
                <span>{formatChainName(chain)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
