import React, { useState } from 'react';

const IntegerInput = ({ onUpdateValue, initialValue }) => {
    const [value, setValue] = useState(initialValue);

    return (
        <input
            type="number"
            className="number-input"
            value={value}
            onChange={e => {
                const eventValue = e.target?.value;
                if (eventValue !== null && eventValue !== undefined) {
                    setValue(eventValue);
                    const parsedValue = parseInt(eventValue, 10);
                    if (Number.isSafeInteger(parsedValue)) {
                        onUpdateValue(parsedValue);
                    }
                }
            }}
        />
    );
};

export default IntegerInput;
