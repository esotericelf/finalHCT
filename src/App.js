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
    const sumValue = (bw * bwCst * patientHCT + emv * 0.5) / (emv + bwCst * bw);

    // Update the sum state variable
    setSum(sumValue);
  };

  const handleSubmitA = (event) => {
    event.preventDefault();

    // Calculate the sum of the three input values
    const sumValueA = (bwA * bwCstA + emvA) * finalHCTA - bwA * bwCstA * patientHCTA / 0.5;

    // Update the sum state variable
    setSumA(sumValueA);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          BW:
          <input
            type="text"
            value={bw}
            onChange={(event) => setBW(event.target.value)}
          />
        </label>
        <br />
        <label>
          Patient HCT:
          <input
            type="text"
            value={patientHCT}
            onChange={(event) => setPatientHCT(event.target.value)}
          />
        </label>
        <br />
        <label>
          Emmo Volume:
          <input
            type="text"
            value={emv}
            onChange={(event) => setEmv(event.target.value)}
          />
        </label>
        <br />
        <label>
          Body Weight Constant:
          <input
            type="text"
            value={bwCst}
            onChange={(event) => setbwCst(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>Final HCT: {sum}</p>
      <br></br>
      <form onSubmit={handleSubmitA}>
        <label>
          BW:
          <input
            type="text"
            value={bwA}
            onChange={(event) => setBWA(event.target.value)}
          />
        </label>
        <br />
        <label>
          Patient HCT:
          <input
            type="text"
            value={patientHCTA}
            onChange={(event) => setPatientHCTA(event.target.value)}
          />
        </label>
        <br />
        <label>
          Emmo Volume:
          <input
            type="text"
            value={emvA}
            onChange={(event) => setEmvA(event.target.value)}
          />
        </label>
        <br />
        <label>
          Body Weight Constant:
          <input
            type="text"
            value={bwCstA}
            onChange={(event) => setbwCstA(event.target.value)}
          />
        </label>
        <br />
        <label>
          Final HCT:
          <input
            type="text"
            value={finalHCTA}
            onChange={(event) => setfinalHCTA(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>Blood Volume: {sumA}</p>
    </div>
  );
}

export default UserForm;