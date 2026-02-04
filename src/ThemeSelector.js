import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import './App.css';

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, themes, changeTheme } = useTheme();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="theme-toggle-btn"
        onClick={toggleSidebar}
        aria-label="Change theme"
        title="Change Theme"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
          <path d="M7 12C7 10.9 7.9 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14C7.9 14 7 13.1 7 12Z" fill="currentColor"/>
          <path d="M13 12C13 10.9 13.9 10 15 10C16.1 10 17 10.9 17 12C17 13.1 16.1 14 15 14C13.9 14 13 13.1 13 12Z" fill="currentColor"/>
          <path d="M10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7Z" fill="currentColor"/>
          <path d="M10 17C10 15.9 10.9 15 12 15C13.1 15 14 15.9 14 17C14 18.1 13.1 19 12 19C10.9 19 10 18.1 10 17Z" fill="currentColor"/>
        </svg>
      </button>

      <div className={`theme-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="theme-sidebar-header">
          <h3>Choose Theme</h3>
          <button className="theme-close-btn" onClick={toggleSidebar} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="theme-list">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              className={`theme-option ${currentTheme === key ? 'active' : ''}`}
              onClick={() => {
                changeTheme(key);
                setIsOpen(false);
              }}
            >
              <div className="theme-preview">
                {theme.colors.previewColors.map((color, idx) => (
                  <span
                    key={idx}
                    className="theme-color-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="theme-name">{theme.name}</span>
              {currentTheme === key && (
                <span className="theme-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      {isOpen && <div className="theme-overlay" onClick={toggleSidebar} />}
    </>
  );
}

export default ThemeSelector;
