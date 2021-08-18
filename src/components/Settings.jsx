import React, { useEffect, useRef } from 'react';
import Dropdown from './Dropdown.jsx';

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
                    <div className="section-contaier">
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
                    </div>
                </li>
                <li>
                    <button id="apply-button" type="button">
                        Apply
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Settings;
