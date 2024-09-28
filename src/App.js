import React from 'react';
import UserForm from './UserForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <UserForm
        title="Calculation of Final HCT"
        inputs={[
          { name: 'bw', placeholder: 'BW' },
          { name: 'patientHCT', placeholder: 'Patient HCT' },
          { name: 'emv', placeholder: 'Ecmo Volume' },
          { name: 'bwCst', placeholder: 'Body Weight Constant' }
        ]}
        calculateSum={(values) => {
          const { bw, patientHCT, emv, bwCst } = values;
          return (parseFloat(bw) * parseFloat(bwCst) * parseFloat(patientHCT) + parseFloat(emv) * 0.5) / (parseFloat(emv) + parseFloat(bwCst) * parseFloat(bw));
        }}
        resultLabel="Final HCT"
      />
      <UserForm
        title="Calculation of Blood Volume"
        inputs={[
          { name: 'bwA', placeholder: 'BW' },
          { name: 'patientHCTA', placeholder: 'Patient HCT' },
          { name: 'emvA', placeholder: 'Ecmo Volume' },
          { name: 'bwCstA', placeholder: 'Body Weight Constant' },
          { name: 'finalHCTA', placeholder: 'Final HCT' }
        ]}
        calculateSum={(values) => {
          const { bwA, patientHCTA, emvA, bwCstA, finalHCTA } = values;
          return ((parseFloat(bwA) * parseFloat(bwCstA) + parseFloat(emvA)) * parseFloat(finalHCTA) - parseFloat(bwA) * parseFloat(bwCstA) * parseFloat(patientHCTA)) / 0.5;
        }}
        resultLabel="Blood Volume"
      />
    </div>
  );
}

export default App;