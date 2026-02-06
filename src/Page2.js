import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserForm from './UserForm';
import FormulaDisplay from './FormulaDisplay';
import MedicalDisclaimer from './MedicalDisclaimer';
import './App.css';

function Page2() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state or localStorage
  const page1Data = useMemo(() => {
    // First try to get from navigation state
    if (location.state) {
      return location.state;
    }
    // Fallback to localStorage
    const stored = localStorage.getItem('page1CalculationData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [location.state]);

  // Map Page1 data to Page2 initial values
  const initialValues = useMemo(() => {
    const values = {
      donorHCTA: '0.5' // Default value
    };

    if (page1Data) {
      // Map fields from Page1 to Page2 (convert all to strings for input fields)
      if (page1Data.bw) values.bwA = String(page1Data.bw);
      if (page1Data.patientHCT) values.patientHCTA = String(page1Data.patientHCT);
      if (page1Data.emv) values.emvA = String(page1Data.emv);
      if (page1Data.bwCst) values.bwCstA = String(page1Data.bwCst);
      // The Final HCT result becomes the Desired HCT
      if (page1Data.finalHCT !== undefined && page1Data.finalHCT !== null) {
        // The finalHCT is already a decimal (0-1), just convert to string
        values.finalHCTA = String(page1Data.finalHCT);
      }
    }

    return values;
  }, [page1Data]);

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
        initialValues={initialValues}
        inputs={[
          { name: 'bwA', placeholder: 'Body Weight (kg)' },
          { name: 'patientHCTA', placeholder: 'Patient HCT (0-1)' },
          { name: 'emvA', placeholder: 'ECMO Volume (mL)' },
          { name: 'bwCstA', placeholder: 'Body Weight Constant (mL/kg)' },
          { name: 'finalHCTA', placeholder: 'Desired HCT / Final HCT (0-1)' },
          { name: 'donorHCTA', placeholder: 'HCT of Donor (0-1)' }
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
      <MedicalDisclaimer />
    </div>
  );
}

export default Page2;
