import React, { useState } from 'react';
import styles from './styles.module.css';

interface UseDropdownOptions {
  onOpenChange?: (isOpen: boolean) => void;
  isControlledOpen?: boolean;
  onControlledClose?: () => void;
}

export function useDropdown({ onOpenChange, isControlledOpen, onControlledClose }: UseDropdownOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  // Handle controlled close from parent (for mobile coordination)
  React.useEffect(() => {
    if (isControlledOpen === false && isOpen) {
      setIsOpen(false);
      if (onControlledClose) {
        onControlledClose();
      }
    }
  }, [isControlledOpen, isOpen, onControlledClose]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.customSelect}`)) {
        handleToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return { isOpen, handleToggle };
}
