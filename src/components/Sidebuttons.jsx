import React from 'react';

const Sidebuttons = ({ showSettings, setShowSettings }) => {
    return (
        <>
            <div className="side-button-container">
                <button
                    className="side-button"
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <span className="material-icons">settings</span>
                    {showSettings || (
                        <div className="info-tooltip">Settings</div>
                    )}
                </button>
                <a
                    className="side-button"
                    href="https://github.com/herin049/FractalVisualizer"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="material-icons">code</span>
                    <div className="info-tooltip">View the source!</div>
                </a>
                <div className="zoom-container">
                    <button id="zoom-in-button" type="button">
                        <span className="material-icons">add</span>
                        <div className="info-tooltip">Zoom in</div>
                    </button>
                    <button id="zoom-out-button" type="button">
                        <span className="material-icons">remove</span>
                        <div className="info-tooltip">Zoom out</div>
                    </button>
                </div>
                <button id="reset-button" className="side-button" type="button">
                    <span className="material-icons">restart_alt</span>
                    <div className="info-tooltip">Reset orientation</div>
                </button>
            </div>
        </>
    );
};

export default Sidebuttons;
