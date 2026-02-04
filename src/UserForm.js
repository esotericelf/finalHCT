import React, { useState } from 'react';
import './App.css';

function UserForm({ title, inputs, calculateSum, resultLabel, autoCalculate, resultFormat, resultUnit }) {
    const [values, setValues] = useState({});
    const [result, setResult] = useState(0);
    const [manualOverrides, setManualOverrides] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        const newValues = { ...values, [name]: value };

        // If auto-calculation is enabled and this field triggers it
        if (autoCalculate && autoCalculate.triggerField === name) {
            const calculatedValue = autoCalculate.calculate(value, newValues);
            // Only auto-update if user hasn't manually overridden
            if (calculatedValue !== null && !manualOverrides[autoCalculate.targetField]) {
                newValues[autoCalculate.targetField] = calculatedValue;
            }
            // If body weight is cleared, allow auto-calculation again
            if (!value || value === '') {
                setManualOverrides(prev => {
                    const newOverrides = { ...prev };
                    delete newOverrides[autoCalculate.targetField];
                    return newOverrides;
                });
            }
        }

        // Track manual overrides when user directly edits the target field
        if (autoCalculate && name === autoCalculate.targetField && value !== '') {
            setManualOverrides(prev => ({ ...prev, [autoCalculate.targetField]: true }));
        }

        setValues(newValues);
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

    const handleClear = () => {
        setValues({});
        setResult(0);
        setManualOverrides({});
    };

    // Extract units from placeholder
    const extractUnit = (placeholder) => {
        if (!placeholder) return '';
        const unitMatches = placeholder.matchAll(/\(([^)]+)\)/g);
        const units = Array.from(unitMatches).map(match => match[1]);
        return units.length > 0 ? units[0] : '';
    };

    // Extract field name from placeholder (without units and extra text)
    const getFieldName = (placeholder) => {
        if (!placeholder) return '';
        // Remove units in parentheses and any text after dash
        let fieldName = placeholder.split('(')[0].trim();
        fieldName = fieldName.split(' - ')[0].trim();
        return fieldName;
    };

    // Extract units from placeholder for tooltip
    const getTooltipText = (placeholder) => {
        if (!placeholder) return '';
        const unit = extractUnit(placeholder);
        const hint = getFieldName(placeholder);

        if (unit) {
            return `${hint}\nUnit: ${unit}`;
        }
        return hint;
    };

    // Format result based on format type
    const formatResult = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return value;

        if (resultFormat === 'percentage') {
            return (value * 100).toFixed(2) + '%';
        }
        return value.toFixed(2);
    };

    return (
        <div className="container">
            <div className="form-header">
                <h1>{title}</h1>
                <button
                    type="button"
                    onClick={handleClear}
                    className="clear-btn"
                    title="Clear all values"
                    aria-label="Clear all values"
                >
                    <span className="clear-icon">✕</span>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {inputs.map((input) => {
                    const unit = extractUnit(input.placeholder);
                    const hasValue = values[input.name] && values[input.name] !== '';
                    const fieldName = getFieldName(input.placeholder);
                    return (
                        <div key={input.name} className="input-wrapper" data-has-value={hasValue}>
                            <label className="input-label">
                                <input
                                    type="number"
                                    name={input.name}
                                    value={values[input.name] || ''}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder={input.placeholder}
                                    title={getTooltipText(input.placeholder)}
                                />
                                {hasValue && unit && (
                                    <span className="input-unit">{unit}</span>
                                )}
                                <span className="input-helper-text">{fieldName}</span>
                            </label>
                        </div>
                    );
                })}
                <button type="submit" className="btn">Submit</button>
            </form>
            <p className="gradient-bg">{resultLabel}: {formatResult(result)}{resultUnit ? ` ${resultUnit}` : ''}</p>
        </div>
    );
}

export default UserForm;