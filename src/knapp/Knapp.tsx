import React, { FormEvent } from 'react';
import './knapp.css';

export enum Knappetype {
    Submit = 'submit',
    Button = 'button',
}

interface Props {
    tekst: string;
    knappetype?: Knappetype;
    sekundaerKnapp?: boolean;
    onClick: (event: FormEvent) => void;
}

const Knapp: React.FC<Props> = ({ tekst, onClick, knappetype = Knappetype.Button, sekundaerKnapp = false }) => {
    return (
        <button className={`knapp ${sekundaerKnapp ? 'sekundaerKnapp' : ''}`} onClick={onClick} type={knappetype}>
            {tekst}
        </button>
    );
};

export default Knapp;
