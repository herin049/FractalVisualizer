import React from 'react';
import Mandlebrot from './Mandlebrot.jsx';
import Sidebar from './Sidebar.jsx';

const App = () => {
    return (
        <>
            <Sidebar />
            <Mandlebrot />
        </>
    );
};

export default App;
