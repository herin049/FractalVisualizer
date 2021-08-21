import React, { useState, useEffect } from 'react';
import * as Constants from '../shared/constants.js';
import WorkerPool from '../worker/WorkerPool.js';
import CanvasCache from '../canvas/CanvasCache.js';
import Fractal from './Fractal.jsx';
import Sidebuttons from './Sidebuttons.jsx';
import Settings from './Settings.jsx';

const App = () => {
    const [settings, setSettings] = useState({
        maxCacheSize: Constants.DEFAULT_MAX_CACHE_SIZE,
        numWorkers: window.navigator?.hardwareConcurrency || 2,
        maxIter: Constants.DEFAULT_MAX_ITER,
        continuousColoring: Constants.DEFAULT_CONTINUOUS_COLORING,
        selectedPallet: Constants.DEFAULT_COLOR_PALLET,
        selectedFractal: Constants.FRACTAL_TYPES.MANDLEBROT,
    });

    useEffect(() => {
        CanvasCache.setMaxCacheSize(settings.maxCacheSize);
    }, [settings.maxCacheSize]);

    useEffect(() => {
        console.log(`resize ${settings.numWorkers}`);
        WorkerPool.resize(settings.numWorkers);
    }, [settings.numWorkers]);

    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <Sidebuttons
                showSettings={showSettings}
                setShowSettings={setShowSettings}
            />
            {showSettings && (
                <Settings
                    settings={settings}
                    setSettings={setSettings}
                    setShowSettings={setShowSettings}
                />
            )}
            <Fractal settings={settings} setSettings={setSettings} />
        </>
    );
};

export default App;
