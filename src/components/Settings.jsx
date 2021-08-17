import React, { useEffect, useRef } from 'react';
import Dropdown from './Dropdown.jsx';

// eslint-disable-next-line
const Settings = ({ settings, setSettings, setShowSettings }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        overlayRef.current.style.opacity = 1;
    }, []);

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
                        <Dropdown />
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Settings;
