import React from 'react';
import './knapp.css';

const Knapperad: React.FC = ({ children }) => {
    return <div className="knappContainer">{children}</div>;
};

export default Knapperad;
