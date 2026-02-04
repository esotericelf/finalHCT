import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import FormulaDisplay from './FormulaDisplay';
import './App.css';

function Page2() {
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
        pageTitle="Donor Blood Volume Calculation Formula"
        formulas={[
          {
            title: "Donor Blood Volume",
            equation: "\\text{DBV} = \\frac{(\\text{PBV} + \\text{ECMO}_v) \\times \\text{HCT}_d - \\text{PBV} \\times \\text{HCT}_p}{\\text{HCT}_{donor}}",
            variables: [
              {
                symbol: "\\text{DBV}",
                name: "Donor Blood Volume",
                abbreviation: "DBV",
                unit: "mL",
                range: "DBV ≥ 0"
              },
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
                symbol: "\\text{ECMO}_v",
                name: "ECMO Volume",
                abbreviation: "ECMO_v",
                unit: "mL",
                range: "ECMO_v ≥ 0"
              },
              {
                symbol: "\\text{HCT}_d",
                name: "Desired HCT / Final HCT",
                abbreviation: "HCT_d",
                unit: "dimensionless",
                range: "0 ≤ HCT_d ≤ 1"
              },
              {
                symbol: "\\text{HCT}_p",
                name: "Patient HCT",
                abbreviation: "HCT_p",
                unit: "dimensionless",
                range: "0 ≤ HCT_p ≤ 1"
              },
              {
                symbol: "\\text{HCT}_{donor}",
                name: "HCT of Donor",
                abbreviation: "HCT_donor",
                unit: "dimensionless",
                range: "0 ≤ HCT_donor ≤ 1 (default: 0.5)"
              }
            ],
            notes: [
              "Patient Blood Volume (PBV) is calculated as: PBV = BW × BWC",
              "Body Weight Constant (BWC) is automatically calculated based on body weight ranges",
              "HCT of Donor defaults to 0.5 if not specified",
              "All HCT values are dimensionless factors between 0 and 1"
            ]
          }
        ]}
      />
      <UserForm
        title="Donor Blood Volume Calculation"
        inputs={[
          { name: 'bwA', placeholder: 'Body Weight (kg)' },
          { name: 'patientHCTA', placeholder: 'Patient HCT (0-1)' },
          { name: 'emvA', placeholder: 'ECMO Volume (mL)' },
          { name: 'bwCstA', placeholder: 'Body Weight Constant (mL/kg) - Auto-calculated' },
          { name: 'finalHCTA', placeholder: 'Desired HCT / Final HCT (0-1)' },
          { name: 'donorHCTA', placeholder: 'HCT of Donor (0-1) - Default: 0.5' }
        ]}
        autoCalculate={{
          triggerField: 'bwA',
          targetField: 'bwCstA',
          calculate: calculateBodyWeightConstant
        }}
        calculateSum={(values) => {
          const { bwA, patientHCTA, emvA, bwCstA, finalHCTA, donorHCTA } = values;
          // Patient blood volume = Body weight × body weight constant
          const patientBloodVolume = parseFloat(bwA) * parseFloat(bwCstA);
          // HCT of donor (default to 0.5 if not provided)
          const donorHCT = parseFloat(donorHCTA) || 0.5;
          // Donor Blood Volume = {[(Patient blood volume + ECMO volume) × Desired HCT] - (patient blood volume × patient HCT)} / HCT of donor
          const numerator = ((patientBloodVolume + parseFloat(emvA)) * parseFloat(finalHCTA)) - (patientBloodVolume * parseFloat(patientHCTA));
          return numerator / donorHCT;
        }}
        resultLabel="Blood Volume"
        resultUnit="mL"
      />
      <div className="navigation-buttons">
        <button onClick={() => navigate('/final-hct')} className="nav-btn prev-btn">
          ← Calculation of Final HCT
        </button>
      </div>
    </div>
  );
}

export default Page2;
