import React from 'react';
import './App.css';

function AlertBox({ isOpen, message, title, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-header">
          <h3 className="alert-title">{title || 'Alert'}</h3>
          <button className="alert-close-btn" onClick={onClose} aria-label="Close">
            <span>✕</span>
          </button>
        </div>
        <div className="alert-content">
          <p className="alert-message">{message}</p>
        </div>
        <div className="alert-footer">
          <button className="alert-ok-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertBox;
