import React from 'react';
import './spillere.css';
import { Spillere } from '../types/Types';

interface Props {
    spillerId: string;
    valgt: boolean;
    onClick?: () => void;
    spillere: Spillere;
}
const Spiller: React.FC<Props> = ({ spillerId, valgt, onClick, spillere, children }) => (
    <div
        key={`spillere ${spillerId}`}
        className={`spiller rekkefolge ${valgt ? 'valgt' : ''}`}
        onClick={() => onClick && onClick()}
    >
        {children}
        <div>{spillere[spillerId].navn}</div>
    </div>
);

export default Spiller;
