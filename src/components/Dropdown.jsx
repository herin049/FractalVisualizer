import React, { useState, useRef, useEffect, useCallback } from 'react';

const Dropdown = ({
    options,
    initialSelectedOption,
    onUpdateSelectedOption,
}) => {
    const [active, setActive] = useState(false);
    const containerRef = useRef(null);
    const deactivateTimeout = useRef(null);
    const [selectedOption, setSelectedOption] = useState(initialSelectedOption);

    const clearDeactivateTimeout = useCallback(() => {
        if (deactivateTimeout.current) {
            clearTimeout(deactivateTimeout.current);
            deactivateTimeout.current = null;
        }
    }, []);

    useEffect(() => () => clearDeactivateTimeout, []);

    const onFocus = () => {
        clearDeactivateTimeout();
        setActive(true);
    };

    const onBlur = () => {
        if (deactivateTimeout.current === null) {
            deactivateTimeout.current = setTimeout(() => setActive(false), 0);
        }
    };

    return (
        <div
            className="dropdown"
            onFocus={onFocus}
            onBlur={onBlur}
            ref={containerRef}
            tabIndex="-1"
        >
            <span className="dropdown-label">{options[selectedOption]}</span>
            <span className="material-icons dropdown-icon">unfold_more</span>
            {active && (
                <ul className="dropdown-options" tabIndex="0">
                    {options.map((e, idx) => (
                        <li
                            key={idx}
                            onClick={() => {
                                onUpdateSelectedOption(idx);
                                setSelectedOption(idx);
                                setActive(false);
                            }}
                            className={
                                idx === selectedOption
                                    ? 'selected-option'
                                    : null
                            }
                        >
                            <span>{e}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
