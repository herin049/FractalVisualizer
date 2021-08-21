import React, { useState } from 'react';

const NumberInput = ({ onUpdateValue, initialValue }) => {
    const [value, setValue] = useState(initialValue);

    return (
        <input
            type="number"
            className="number-input"
            value={value}
            onChange={e => {
                const eventValue = e.target?.value;
                if (eventValue !== null && eventValue !== undefined) {
                    const parsedValue = parseInt(eventValue, 10);
                    if (Number.isSafeInteger(parsedValue)) {
                        setValue(parsedValue);
                        onUpdateValue(value);
                    }
                }
            }}
        />
    );
};

export default NumberInput;
