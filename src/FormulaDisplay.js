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
        {isOpen ? '▲ Hide Formulas' : '▼ Show Formulas'}
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
                  <ul className="variable-list">
                    {formula.variables.map((variable, idx) => (
                      <li key={idx}>
                        <strong><InlineMath math={variable.symbol} /></strong> = {variable.name}
                        {variable.abbreviation && <span className="abbreviation"> ({variable.abbreviation})</span>}
                        {variable.range && <span className="range"> - Range: {variable.range}</span>}
                        {variable.unit && <span className="unit"> - Unit: {variable.unit}</span>}
                        {variable.footnote && <sup className="footnote">{variable.footnote}</sup>}
                      </li>
                    ))}
                  </ul>
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
