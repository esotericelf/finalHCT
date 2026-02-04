import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import FormulaDisplay from './FormulaDisplay';
import './App.css';

function Page1() {
  const navigate = useNavigate();

  // Function to calculate body weight constant based on body weight
  const calculateBodyWeightConstant = (bodyWeight) => {
    const bw = parseFloat(bodyWeight);
    if (isNaN(bw) || bw < 0) return null;

    if (bw <= 10) return 85;      // 0-10kg => 85mL/kg
    if (bw <= 20) return 80;    // 11-20kg => 80mL/kg
    if (bw <= 45) return 75;    // 21-45kg => 75mL/kg
    return 70;                  // >45kg => 70mL/kg
  };

  return (
    <div className="App">
      <FormulaDisplay
        pageTitle="Final HCT Calculation Formula"
        formulas={[
          {
            title: "Final Patient HCT",
            equation: "\\text{Final HCT} = \\frac{\\text{PBV} \\times \\text{HCT}_p}{\\text{PBV} + \\text{ECMO}_v}",
            variables: [
              {
                symbol: "\\text{PBV}",
                name: "Patient Blood Volume",
                abbreviation: "PBV",
                unit: "mL",
                range: "PBV = BW × BWC, where BW > 0"
              },
              {
                symbol: "\\text{BW}",
                name: "Body Weight",
                abbreviation: "BW",
                unit: "kg",
                range: "BW > 0"
              },
              {
                symbol: "\\text{BWC}",
                name: "Body Weight Constant",
                abbreviation: "BWC",
                unit: "mL/kg",
                range: "70-85 mL/kg (depends on BW: 0-10kg=85, 11-20kg=80, 21-45kg=75, >45kg=70)"
              },
              {
                symbol: "\\text{HCT}_p",
                name: "Patient HCT",
                abbreviation: "HCT_p",
                unit: "dimensionless",
                range: "0 ≤ HCT_p ≤ 1"
              },
              {
                symbol: "\\text{ECMO}_v",
                name: "ECMO Volume",
                abbreviation: "ECMO_v",
                unit: "mL",
                range: "ECMO_v ≥ 0"
              }
            ],
            notes: [
              "Patient Blood Volume (PBV) is calculated as: PBV = BW × BWC",
              "Body Weight Constant (BWC) is automatically calculated based on body weight ranges",
              "Final HCT result is displayed as a percentage with 2 decimal places"
            ]
          }
        ]}
      />
      <UserForm
        title="Calculation of Final HCT"
        inputs={[
          { name: 'bw', placeholder: 'Body Weight (kg)' },
          { name: 'patientHCT', placeholder: 'Patient HCT (0-1)' },
          { name: 'emv', placeholder: 'ECMO Volume (mL)' },
          { name: 'bwCst', placeholder: 'Body Weight Constant (mL/kg) - Auto-calculated' }
        ]}
        autoCalculate={{
          triggerField: 'bw',
          targetField: 'bwCst',
          calculate: calculateBodyWeightConstant
        }}
        calculateSum={(values) => {
          const { bw, patientHCT, emv, bwCst } = values;
          // Patient blood volume = Body weight × body weight constant
          const patientBloodVolume = parseFloat(bw) * parseFloat(bwCst);
          // Final HCT = (Patient blood volume × patient hct) / (Patient blood volume + ECMO VOLUME)
          return (patientBloodVolume * parseFloat(patientHCT)) / (patientBloodVolume + parseFloat(emv));
        }}
        resultLabel="Final HCT"
        resultFormat="percentage"
      />
      <div className="navigation-buttons">
        <button onClick={() => navigate('/page2')} className="nav-btn next-btn">
          Donar Blood Volume Calculations →
        </button>
      </div>
    </div>
  );
}

export default Page1;
