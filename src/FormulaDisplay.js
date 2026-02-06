import React, { useState, useRef } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './App.css';

function FormulaDisplay({ formulas, pageTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const formulaRef = useRef(null);

  const toggleFormula = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="formula-container">
      <button
        onClick={toggleFormula}
        className="formula-toggle-btn"
        aria-expanded={isOpen}
      >
        Formula <span className="formula-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div ref={formulaRef} className="formula-content">
          <h3 className="formula-title">{pageTitle}</h3>
          {formulas.map((formula, index) => (
            <div key={index} className="formula-section">
              <h4 className="formula-section-title">{formula.title}</h4>
              <div className="formula-equation">
                <BlockMath math={formula.equation} />
              </div>
              {formula.variables && (
                <div className="formula-variables">
                  <h5>Variables:</h5>
                  <div className="variable-grid">
                    {formula.variables.map((variable, idx) => (
                      <div key={idx} className="variable-card">
                        <div className="variable-header">
                          <span className="variable-symbol"><InlineMath math={variable.symbol} /></span>
                          <span className="variable-name">{variable.name}</span>
                        </div>
                        <div className="variable-details">
                          {variable.abbreviation && (
                            <div className="variable-detail-item">
                              <span className="detail-label">Abbr:</span>
                              <span className="abbreviation">{variable.abbreviation}</span>
                            </div>
                          )}
                          {variable.unit && (
                            <div className="variable-detail-item">
                              <span className="detail-label">Unit:</span>
                              <span className="unit">{variable.unit}</span>
                            </div>
                          )}
                          {variable.range && (
                            <div className="variable-detail-item full-width">
                              <span className="detail-label">Range:</span>
                              <span className="range">{variable.range}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formula.notes && (
                <div className="formula-notes">
                  <h5>Notes:</h5>
                  <ul>
                    {formula.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormulaDisplay;
