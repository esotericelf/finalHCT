import React, { useState } from 'react';

function UserForm() {
  const [bw, setBW] = useState('');
  const [emv, setEmv] = useState('');
  const [patientHCT, setPatientHCT] = useState('');
  const [bwCst, setbwCst] = useState('');
  const [sum, setSum] = useState(0);
  const [bwA, setBWA] = useState('');
  const [emvA, setEmvA] = useState('');
  const [patientHCTA, setPatientHCTA] = useState('');
  const [bwCstA, setbwCstA] = useState('');
  const [finalHCTA, setfinalHCTA] = useState();
  const [sumA, setSumA] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Calculate the sum of the three input values
    const sumValue = (parseFloat(bw) * parseFloat(bwCst) * parseFloat(patientHCT) + parseFloat(emv) * 0.5) / (parseFloat(emv) + parseFloat(bwCst) * parseFloat(bw));

    // Update the sum state variable
    setSum(sumValue);
  };

  const handleSubmitA = (event) => {
    event.preventDefault();

    // Calculate the sum of the three input values
    const sumValueA = ((parseFloat(bwA) * parseFloat(bwCstA) + parseFloat(emvA)) * parseFloat(finalHCTA) - parseFloat(bwA) * parseFloat(bwCstA) * parseFloat(patientHCTA)) / 0.5;

    // Update the sum state variable
    setSumA(sumValueA);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={bw}
            onChange={(event) => setBW(event.target.value)}
            class="input"
            placeholder='BW'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={patientHCT}
            onChange={(event) => setPatientHCT(event.target.value)}
            class="input"
            placeholder='Patient HCT'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={emv}
            onChange={(event) => setEmv(event.target.value)}
            class="input"
            placeholder='Ecmo Volume'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={bwCst}
            onChange={(event) => setbwCst(event.target.value)}
            class="input"
            placeholder='Body Weight Constant'
          />
        </label>
        <br />
        <button type="submit" class="btn">Submit</button>
      </form>
      <p class="gradient-bg">Final HCT: {sum}</p>
      <br></br>
      <form onSubmit={handleSubmitA}>
        <label>
          <input
            type="text"
            value={bwA}
            onChange={(event) => setBWA(event.target.value)}
            class="input"
            placeholder='BW'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={patientHCTA}
            onChange={(event) => setPatientHCTA(event.target.value)}
            class="input"
            placeholder='Patient HCT'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={emvA}
            onChange={(event) => setEmvA(event.target.value)}
            class="input"
            placeholder='Ecmo Volume'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={bwCstA}
            onChange={(event) => setbwCstA(event.target.value)}
            class="input"
            placeholder='Body Weight Constant'
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={finalHCTA}
            onChange={(event) => setfinalHCTA(event.target.value)}
            class="input"
            placeholder='Final HCT'
          />
        </label>
        <br />
        <button type="submit" class="btn">Submit</button>
      </form>
      <p class="gradient-bg">Blood Volume: {sumA}</p>
    </div>
  );
}

export default UserForm;