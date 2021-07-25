import React from 'react';
import Mandlebrot from './Mandlebrot.jsx';

const App = () => {
    return (
        <Mandlebrot
            width={window.document.documentElement.clientWidth}
            height={window.document.documentElement.clientHeight}
        />
    );
};

export default App;
