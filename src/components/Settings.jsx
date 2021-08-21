import React, { useEffect, useRef, useState } from 'react';
import { FRACTAL_TYPES, COLOR_PALLETS } from '../shared/constants.js';
import Dropdown from './Dropdown.jsx';
import Checkbox from './Checkbox.jsx';
import IntegerInput from './IntegerInput.jsx';

// eslint-disable-next-line
const Settings = ({ settings, setSettings, setShowSettings }) => {
    const overlayRef = useRef(null);

    const [tentativeSettings, setTentativeSettings] = useState({ ...settings });
    const [modified, setModified] = useState(false);

    useEffect(() => {
        overlayRef.current.style.opacity = 1;
    }, []);

    const fractalOptions = [
        [FRACTAL_TYPES.MANDLEBROT, 'Mandlebrot'],
        [FRACTAL_TYPES.BURNING_SHIP, 'Burning ship'],
        [FRACTAL_TYPES.MULTIBROT, 'Multi-brot'],
        [FRACTAL_TYPES.TRICORN, 'Tricorn'],
    ];

    const palletOptions = [
        [COLOR_PALLETS.HSV_RED, 'HSV Red'],
        [COLOR_PALLETS.HSV_BLUE, 'HSV Blue'],
        [COLOR_PALLETS.HSV_GREEN, 'HSV Green'],
    ];

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
                            options={fractalOptions.map(e => e[1])}
                            initialSelectedOption={fractalOptions.findIndex(
                                e => e[0] === settings.selectedFractal
                            )}
                            onUpdateSelectedOption={idx => {
                                setTentativeSettings({
                                    ...tentativeSettings,
                                    selectedFractal: fractalOptions[idx][0],
                                });
                                setModified(true);
                            }}
                        />
                        <span id="color-pallet-label" className="field-label">
                            Color pallet
                        </span>
                        <Dropdown
                            options={palletOptions.map(e => e[1])}
                            initialSelectedOption={palletOptions.findIndex(
                                e => e[0] === settings.selectedPallet
                            )}
                            onUpdateSelectedOption={idx => {
                                setTentativeSettings({
                                    ...tentativeSettings,
                                    selectedPallet: palletOptions[idx][0],
                                });
                                setModified(true);
                            }}
                        />
                        <div className="checkbox-container">
                            <span className="field-label checkbox-label">
                                Continuous coloring
                            </span>
                            <Checkbox
                                onUpdateChecked={checked => {
                                    setTentativeSettings({
                                        ...tentativeSettings,
                                        continuousColoring: checked,
                                    });
                                    setModified(true);
                                }}
                                initialState={settings.continuousColoring}
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
                            <IntegerInput
                                onUpdateValue={n => {
                                    setTentativeSettings({
                                        ...tentativeSettings,
                                        maxIter: Math.max(n, 1),
                                    });
                                    setModified(true);
                                }}
                                initialValue={settings.maxIter}
                            />
                        </div>
                        <div className="input-container">
                            <span className="field-label input-label">
                                Cache size
                            </span>
                            <IntegerInput
                                onUpdateValue={n => {
                                    setTentativeSettings({
                                        ...tentativeSettings,
                                        maxCacheSize: Math.max(n, 100),
                                    });
                                    setModified(true);
                                }}
                                initialValue={settings.maxCacheSize}
                            />
                        </div>
                        <div className="input-container">
                            <span className="field-label input-label">
                                Number of workers
                            </span>
                            <IntegerInput
                                onUpdateValue={n => {
                                    setTentativeSettings({
                                        ...tentativeSettings,
                                        numWorkers: Math.min(
                                            Math.max(n, 1),
                                            100
                                        ),
                                    });
                                    setModified(true);
                                }}
                                initialValue={settings.numWorkers}
                            />
                        </div>
                    </div>
                </li>
                <li>
                    <button
                        id="apply-button"
                        type="button"
                        disabled={!modified}
                        onClick={() => {
                            setSettings(tentativeSettings);
                            setModified(false);
                        }}
                    >
                        Apply
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Settings;
