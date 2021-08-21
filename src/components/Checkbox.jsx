import React, { useState } from 'react';

const Checkbox = ({ onUpdateChecked, initialState }) => {
    const [checked, setChecked] = useState(initialState);
    const classes = checked ? 'checkbox checked-checkbox' : 'checkbox';

    return (
        <div
            className={classes}
            onClick={() => {
                onUpdateChecked(!checked);
                setChecked(!checked);
            }}
        >
            <span className="material-icons">done</span>
        </div>
    );
};

export default Checkbox;
