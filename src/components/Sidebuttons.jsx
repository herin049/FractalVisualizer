import React from 'react';
import Settings from './Settings.jsx';

const Sidebuttons = () => {
    return (
        <>
            <div className="side-button-container">
                <button className="side-button" type="button">
                    <i className="fas fa-cog" />
                </button>
                <button className="side-button" type="button">
                    <i className="fab fa-github" />
                </button>
                <div className="zoom-container">
                    <button id="zoom-in-button" type="button">
                        <i className="fas fa-plus" />
                    </button>
                    <button id="zoom-out-button" type="button">
                        <i className="fas fa-minus" />
                    </button>
                </div>
                <button className="side-button" type="button">
                    <i className="fas fa-redo-alt" />
                </button>
            </div>
            <Settings />
        </>
    );
};

export default Sidebuttons;
