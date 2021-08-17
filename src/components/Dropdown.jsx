import React, { useState, useRef } from 'react';

const Dropdown = () => {
    const [active, setActive] = useState(false);
    const containerRef = useRef(null);

    const iconClass = `material-icons dropdown-icon${
        active ? ' dropdown-icon--active' : ''
    }`;

    return (
        <div
            className="dropdown"
            onClick={() => {
                active || containerRef.current?.focus();
                setActive(!active);
            }}
            onBlur={() => {
                console.log('blur');
                setActive(false);
            }}
            ref={containerRef}
            tabIndex="-1"
        >
            <span className="dropdown-label">Mandlebrot</span>
            <span className={iconClass}>unfold_more</span>
            {active && (
                <ul className="dropdown-options" tabIndex="0">
                    <li>
                        <span>Mandlebrot</span>
                    </li>
                    <li>
                        <span>Burning ship</span>
                    </li>
                    <li>
                        <span>Multi-brot</span>
                    </li>
                    <li>
                        <span>Julia</span>
                    </li>
                    <li>
                        <span>Tricorn</span>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
