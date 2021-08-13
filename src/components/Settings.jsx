import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line
const Settings = ({ settings, setSettings, setShowSettings }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        overlayRef.current.style.opacity = 1;
    }, []);

    return (
        <div id="settings-overlay" ref={overlayRef}>
            <ul>
                <li className="settings-title">
                    Settings
                    <button
                        id="settings-close-button"
                        type="button"
                        onClick={() => setShowSettings(false)}
                    >
                        <span className="material-icons">close</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Settings;
