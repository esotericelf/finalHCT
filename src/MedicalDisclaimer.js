import React from 'react';
import './App.css';

function MedicalDisclaimer() {
  return (
    <div className="medical-disclaimer">
      <p className="disclaimer-text">
        <strong>Medical Disclaimer:</strong> The calculations and formulas provided on this website are for reference and educational purposes only.
        These tools are not intended to replace professional medical judgment, diagnosis, or treatment. Users must verify all calculated values
        with qualified healthcare professionals before applying them to any medical situation. The owner, developers, and operators of this website
        expressly disclaim any liability for any medical claims, damages, or adverse outcomes that may result from the use or misuse of these
        calculations. By using this tool, you acknowledge that you have read, understood, and agree to this disclaimer, and you hereby indemnify
        and hold harmless the website owner, developers, and operators from any and all claims, damages, losses, or liabilities arising from
        the use of these calculations.
      </p>
    </div>
  );
}

export default MedicalDisclaimer;
