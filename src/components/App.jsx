import React from 'react';
import Mandlebrot from './Mandlebrot.jsx';

const App = () => {
    return <Mandlebrot width={window.innerWidth} height={window.innerHeight} />;
};

export default App;
