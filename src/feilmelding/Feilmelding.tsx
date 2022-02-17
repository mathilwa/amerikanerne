import React from 'react';
import './feilmelding.css';

interface Props {
    feilmelding: string;
}

const Feilmelding: React.FC<Props> = ({ feilmelding }) => <div className="feilmelding">{feilmelding}</div>;

export default Feilmelding;
