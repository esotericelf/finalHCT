import React, { useState } from 'react';
import './App.css';

function UserForm({ title, inputs, calculateSum, resultLabel }) {
    const [values, setValues] = useState({});
    const [result, setResult] = useState(0);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const sumValue = calculateSum(values);
        if (isNaN(sumValue)) {
            alert("Invalid Input");
        } else {
            setResult(sumValue);
        }
    };

    return (
        <div className="container">
            <h1>{title}</h1>
            <form onSubmit={handleSubmit}>
                {inputs.map((input) => (
                    <div key={input.name}>
                        <label>
                            <input
                                type="number"
                                name={input.name}
                                value={values[input.name] || ''}
                                onChange={handleChange}
                                className="input"
                                placeholder={input.placeholder}
                            />
                        </label>
                        <br />
                    </div>
                ))}
                <button type="submit" className="btn">Submit</button>
            </form>
            <p className="gradient-bg">{resultLabel}: {result}</p>
        </div>
    );
}

export default UserForm;