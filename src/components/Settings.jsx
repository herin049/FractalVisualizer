import React, { useEffect, useRef } from 'react';
import Dropdown from './Dropdown.jsx';
import Checkbox from './Checkbox.jsx';

// eslint-disable-next-line
const Settings = ({ settings, setSettings, setShowSettings }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        overlayRef.current.style.opacity = 1;
    }, []);

    const fractalOptions = [
        'Mandlebrot',
        'Burning ship',
        'Multi-brot',
        'Julia',
        'Tricorn',
    ];

    const palletOptions = ['HSV Red', 'HSV Blue', 'HSV Green'];

    return (
        <div id="settings-overlay" ref={overlayRef}>
            <ul>
                <li>
                    <span className="settings-label">Settings</span>
                    <button
                        id="settings-close-button"
                        type="button"
                        onClick={() => setShowSettings(false)}
                    >
                        <span className="material-icons">close</span>
                    </button>
                </li>
                <li>
                    <div className="settings-container">
                        <span className="field-label">Fractal type</span>
                        <Dropdown
                            options={fractalOptions}
                            onUpdateSelectedOption={idx => console.log(idx)}
                        />
                        <span id="color-pallet-label" className="field-label">
                            Color pallet
                        </span>
                        <Dropdown
                            options={palletOptions}
                            onUpdateSelectedOption={idx => console.log(idx)}
                        />
                        <div className="checkbox-container">
                            <span className="field-label checkbox-label">
                                Continuous coloring
                            </span>
                            <Checkbox
                                onUpdateChecked={checked =>
                                    console.log(
                                        `Checkbox is checked: ${checked}`
                                    )
                                }
                            />
                        </div>
                    </div>
                </li>
                <li>
                    <div className="settings-container">
                        <div className="input-container">
                            <span className="field-label input-label">
                                Iteration count
                            </span>
                            <input type="number" className="number-input" />
                        </div>
                        <div className="input-container">
                            <span className="field-label input-label">
                                Cache size
                            </span>
                            <input type="number" className="number-input" />
                        </div>
                        <div className="input-container">
                            <span className="field-label input-label">
                                Number of workers
                            </span>
                            <input type="number" className="number-input" />
                        </div>
                    </div>
                </li>
                <li>
                    <button
                        id="apply-button"
                        type="button"
                        disabled={false ? true : null}
                    >
                        Apply
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Settings;
