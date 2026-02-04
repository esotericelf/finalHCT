import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  default: {
    name: 'Default',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #a8c0ff 0%, #b8a8ff 100%)',
      secondaryGradient: 'linear-gradient(135deg, #ffd1dc 0%, #ffb3d9 100%)',
      accentGradient: 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)',
      darkGradient: 'linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)',
      primaryColor: '#a8c0ff',
      secondaryColor: '#b8a8ff',
      accentColor: '#81d4fa',
      bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 30%, #e1f5fe 60%, #fff3e0 100%)',
      previewColors: ['#a8c0ff', '#b8a8ff', '#b3e5fc']
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #a8d8ea 0%, #b8e0d2 100%)',
      secondaryGradient: 'linear-gradient(135deg, #d4e6f1 0%, #e8f4f8 100%)',
      accentGradient: 'linear-gradient(135deg, #c5e3f6 0%, #a8d5e2 100%)',
      darkGradient: 'linear-gradient(135deg, #9bb5c8 0%, #a8c0d8 100%)',
      primaryColor: '#a8d8ea',
      secondaryColor: '#b8e0d2',
      accentColor: '#c5e3f6',
      bgGradient: 'linear-gradient(135deg, #e0f2f7 0%, #d4e6f1 30%, #c5e3f6 60%, #b8e0d2 100%)',
      previewColors: ['#a8d8ea', '#b8e0d2', '#c5e3f6']
    }
  },
  sunset: {
    name: 'Peach Sunset',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #ffd3b6 0%, #ffaaa5 100%)',
      secondaryGradient: 'linear-gradient(135deg, #ffc8a2 0%, #ffe0b5 100%)',
      accentGradient: 'linear-gradient(135deg, #ffb3ba 0%, #ffdfba 100%)',
      darkGradient: 'linear-gradient(135deg, #ffa07a 0%, #ffb88c 100%)',
      primaryColor: '#ffd3b6',
      secondaryColor: '#ffaaa5',
      accentColor: '#ffc8a2',
      bgGradient: 'linear-gradient(135deg, #ffe5d9 0%, #ffd3b6 30%, #ffaaa5 60%, #ffc8a2 100%)',
      previewColors: ['#ffd3b6', '#ffaaa5', '#ffc8a2']
    }
  },
  forest: {
    name: 'Mint Forest',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)',
      secondaryGradient: 'linear-gradient(135deg, #b8e6d3 0%, #c8e6d8 100%)',
      accentGradient: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
      darkGradient: 'linear-gradient(135deg, #95d5b2 0%, #a8d5ba 100%)',
      primaryColor: '#a8e6cf',
      secondaryColor: '#dcedc8',
      accentColor: '#b8e6d3',
      bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #dcedc8 30%, #c8e6d8 60%, #b8e6d3 100%)',
      previewColors: ['#a8e6cf', '#dcedc8', '#b8e6d3']
    }
  },
  lavender: {
    name: 'Lavender Dream',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #e1bee7 0%, #f8bbd0 100%)',
      secondaryGradient: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)',
      accentGradient: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
      darkGradient: 'linear-gradient(135deg, #ce93d8 0%, #ba68c8 100%)',
      primaryColor: '#e1bee7',
      secondaryColor: '#f8bbd0',
      accentColor: '#f3e5f5',
      bgGradient: 'linear-gradient(135deg, #f3e5f5 0%, #f8bbd0 30%, #e1bee7 60%, #fce4ec 100%)',
      previewColors: ['#e1bee7', '#f8bbd0', '#f3e5f5']
    }
  },
  rose: {
    name: 'Rose Petal',
    colors: {
      primaryGradient: 'linear-gradient(135deg, #ffcccb 0%, #ffb6c1 100%)',
      secondaryGradient: 'linear-gradient(135deg, #ffe4e1 0%, #ffd7d7 100%)',
      accentGradient: 'linear-gradient(135deg, #ffc0cb 0%, #ffb3ba 100%)',
      darkGradient: 'linear-gradient(135deg, #ffa8a8 0%, #ff9f9f 100%)',
      primaryColor: '#ffcccb',
      secondaryColor: '#ffb6c1',
      accentColor: '#ffe4e1',
      bgGradient: 'linear-gradient(135deg, #ffe4e1 0%, #ffd7d7 30%, #ffcccb 60%, #ffb6c1 100%)',
      previewColors: ['#ffcccb', '#ffb6c1', '#ffe4e1']
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved && themes[saved] ? saved : 'default';
  });

  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    root.style.setProperty('--primary-gradient', theme.colors.primaryGradient);
    root.style.setProperty('--secondary-gradient', theme.colors.secondaryGradient);
    root.style.setProperty('--accent-gradient', theme.colors.accentGradient);
    root.style.setProperty('--dark-gradient', theme.colors.darkGradient);
    root.style.setProperty('--primary-color', theme.colors.primaryColor);
    root.style.setProperty('--secondary-color', theme.colors.secondaryColor);
    root.style.setProperty('--accent-color', theme.colors.accentColor);
    root.style.setProperty('--bg-gradient', theme.colors.bgGradient);

    // Update background gradient for body
    document.body.style.background = theme.colors.bgGradient;

    // Update background gradient for App::before pseudo-element
    const style = document.createElement('style');
    style.id = 'theme-background-style';
    const existingStyle = document.getElementById('theme-background-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    style.textContent = `.App::before { background: ${theme.colors.bgGradient} !important; }`;
    document.head.appendChild(style);

    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
