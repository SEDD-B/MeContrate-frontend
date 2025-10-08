import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sidebar.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  width?: number | string;
  position?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
};

export default function Sidebar({
  isOpen,
  onClose,
  width = 300,
  position = 'right',
  children,
  className = '',
}: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const initialX = position === 'left' ? '-100%' : '100%';
  const exitX = initialX;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            className={`${styles.sidebar} ${className}`}
            role="dialog"
            aria-modal="true"
            initial={{ x: initialX, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: exitX, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width }}
          >
            <header className={styles.header}>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Fechar sidebar"
              >
                ×
              </button>
            </header>

            <div className={styles.content}>{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}