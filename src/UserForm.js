import React, { useState, useEffect, useRef, useMemo } from 'react';
import AlertBox from './AlertBox';
import './App.css';

function UserForm({ title, inputs, calculateSum, resultLabel, autoCalculate, resultFormat, resultUnit, initialValues = {}, onResultChange }) {
    const [values, setValues] = useState(() => {
        // Initialize with initialValues if provided
        const init = {};
        inputs.forEach(input => {
            if (initialValues && initialValues[input.name] !== undefined && initialValues[input.name] !== null && initialValues[input.name] !== '') {
                init[input.name] = initialValues[input.name];
            } else {
                // Default HCT of Donor to 0.5
                if (input.name === 'donorHCTA') {
                    init[input.name] = '0.5';
                } else {
                    init[input.name] = '';
                }
            }
        });
        return init;
    });
    const [result, setResult] = useState(0);
    const [manualOverrides, setManualOverrides] = useState({});
    const [alert, setAlert] = useState({ isOpen: false, message: '', title: '' });
    const [hoveredField, setHoveredField] = useState(null);
    const finalHCTARef = useRef(null);
    const prevInitialValuesRef = useRef(null);

    // Serialize initialValues for dependency comparison
    const initialValuesSerialized = useMemo(() => {
        return JSON.stringify(initialValues);
    }, [initialValues]);

    // Update values when initialValues change (e.g., when navigating with data)
    useEffect(() => {
        // Only update if initialValues actually changed
        if (prevInitialValuesRef.current === initialValuesSerialized) {
            return;
        }
        prevInitialValuesRef.current = initialValuesSerialized;

        setValues(prevValues => {
            const updated = { ...prevValues };
            // Ensure all input fields exist in state
            inputs.forEach(input => {
                if (updated[input.name] === undefined) {
                    // Default HCT of Donor to 0.5
                    if (input.name === 'donorHCTA') {
                        updated[input.name] = '0.5';
                    } else {
                        updated[input.name] = '';
                    }
                }
            });

            // Update from initialValues if provided
            if (initialValues && Object.keys(initialValues).length > 0) {
                Object.keys(initialValues).forEach(key => {
                    const inputExists = inputs.some(input => input.name === key);
                    if (inputExists && initialValues[key] !== undefined && initialValues[key] !== null && initialValues[key] !== '') {
                        updated[key] = initialValues[key];
                    }
                });
            }

            // Ensure donorHCTA always has a default value if empty
            const donorHCTAInput = inputs.find(input => input.name === 'donorHCTA');
            if (donorHCTAInput && (!updated.donorHCTA || updated.donorHCTA === '')) {
                updated.donorHCTA = '0.5';
            }

            return updated;
        });
    }, [initialValuesSerialized, initialValues, inputs]);

    // Auto-focus on finalHCTA field on first load (Page2)
    const hasFocusedRef = useRef(false);
    useEffect(() => {
        if (hasFocusedRef.current) return;
        const finalHCTAInput = inputs.find(input => input.name === 'finalHCTA');
        if (finalHCTAInput && finalHCTARef.current) {
            // Small delay to ensure the DOM is ready
            const timer = setTimeout(() => {
                if (finalHCTARef.current) {
                    finalHCTARef.current.focus();
                    hasFocusedRef.current = true;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [inputs]);

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

    // Show alert
    const showAlert = (title, message) => {
        setAlert({ isOpen: true, title, message });
    };

    // Close alert
    const closeAlert = () => {
        setAlert({ isOpen: false, title: '', message: '' });
    };

    // Validate HCT values are between 0 and 1
    const validateHCTValues = () => {
        const hctFields = inputs.filter(input => {
            const placeholder = input.placeholder || '';
            return placeholder.includes('(0-1)') || placeholder.toLowerCase().includes('hct');
        });

        for (const field of hctFields) {
            const value = parseFloat(values[field.name]);
            if (values[field.name] && values[field.name] !== '') {
                if (isNaN(value) || value < 0 || value > 1) {
                    const fieldName = getFieldName(field.placeholder);
                    showAlert(
                        'Invalid HCT Value',
                        `${fieldName} must be between 0 and 1.\n\nCurrent value: ${values[field.name]}\n\nPlease enter a value between 0 and 1.`
                    );
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate HCT values first
        if (!validateHCTValues()) {
            return;
        }

        const sumValue = calculateSum(values);
        if (isNaN(sumValue)) {
            showAlert('Invalid Input', 'Please check that all required fields are filled with valid numbers.');
        } else {
            setResult(sumValue);
            // Notify parent component of the result and current values
            if (onResultChange) {
                onResultChange(sumValue, values);
            }
        }
    };

    const handleClear = () => {
        const clearedValues = {};
        // Set donorHCTA to default 0.5 when clearing
        inputs.forEach(input => {
            if (input.name === 'donorHCTA') {
                clearedValues[input.name] = '0.5';
            } else {
                clearedValues[input.name] = '';
            }
        });
        setValues(clearedValues);
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

    // Check if field is body weight constant
    const isBodyWeightConstant = (inputName, placeholder) => {
        return placeholder && (
            placeholder.toLowerCase().includes('body weight constant') ||
            placeholder.toLowerCase().includes('bwc') ||
            inputName === 'bwCst' ||
            inputName === 'bwCstA'
        );
    };

    // Get body weight constant logic text
    const getBodyWeightConstantLogic = () => {
        return (
            <div className="bwc-logic-tooltip">
                <div className="bwc-logic-title">Body Weight Constant Values:</div>
                <div className="bwc-logic-list">
                    <div className="bwc-logic-item">
                        <span className="bwc-range">0 - 10 kg</span>
                        <span className="bwc-arrow">→</span>
                        <span className="bwc-value">85 mL/kg</span>
                    </div>
                    <div className="bwc-logic-item">
                        <span className="bwc-range">11 - 20 kg</span>
                        <span className="bwc-arrow">→</span>
                        <span className="bwc-value">80 mL/kg</span>
                    </div>
                    <div className="bwc-logic-item">
                        <span className="bwc-range">21 - 45 kg</span>
                        <span className="bwc-arrow">→</span>
                        <span className="bwc-value">75 mL/kg</span>
                    </div>
                    <div className="bwc-logic-item">
                        <span className="bwc-range">&gt; 45 kg</span>
                        <span className="bwc-arrow">→</span>
                        <span className="bwc-value">70 mL/kg</span>
                    </div>
                </div>
                <div className="bwc-logic-note">Auto-calculated based on body weight</div>
            </div>
        );
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
                    const isBWC = isBodyWeightConstant(input.name, input.placeholder);
                    return (
                        <div
                            key={input.name}
                            className="input-wrapper"
                            data-has-value={hasValue}
                            onMouseEnter={() => isBWC && setHoveredField(input.name)}
                            onMouseLeave={() => isBWC && setHoveredField(null)}
                        >
                            <label className="input-label">
                                <input
                                    ref={input.name === 'finalHCTA' ? finalHCTARef : null}
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
                                {isBWC && hoveredField === input.name && (
                                    <div className="bwc-floating-remark">
                                        {getBodyWeightConstantLogic()}
                                    </div>
                                )}
                            </label>
                        </div>
                    );
                })}
                <button type="submit" className="btn">Submit</button>
            </form>
            <p className="gradient-bg">{resultLabel}: {formatResult(result)}{resultUnit ? ` ${resultUnit}` : ''}</p>
            <AlertBox
                isOpen={alert.isOpen}
                title={alert.title}
                message={alert.message}
                onClose={closeAlert}
            />
        </div>
    );
}

export default UserForm;