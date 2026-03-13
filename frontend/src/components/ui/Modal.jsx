import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const [isMounted, setIsMounted] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && isMounted) {
      setAnimationClass('is-closing');
      const timer = setTimeout(() => {
        setAnimationClass('');
        setIsMounted(false);
        document.body.style.overflow = 'unset';
      }, 300); // Duration matches the CSS animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return createPortal(
    <div className={`modal-overlay ${animationClass}`} onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close-btn" onClick={handleClose}>
            <FiX size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
