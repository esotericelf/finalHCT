import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Page1 from './Page1';
import Page2 from './Page2';
import { ThemeProvider } from './ThemeContext';
import ThemeSelector from './ThemeSelector';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemeSelector />
        <Routes>
          <Route path="/" element={<Navigate to="/final-hct" replace />} />
          <Route path="/final-hct" element={<Page1 />} />
          <Route path="/donor-blood-volume" element={<Page2 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;