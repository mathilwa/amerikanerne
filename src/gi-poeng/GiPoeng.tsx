import React from 'react';
import './gi-poeng.css';

import { Poeng, Spillere } from '../types/Types';
import { getSpillerIder } from '../utils';
import SeksjonHeading from '../seksjon-heading/SeksjonHeading';

interface Props {
    onOppdaterPoeng: (oppdatertePoeng: Poeng) => void;
    poengTilSpillere: Poeng | null;
    spillere: Spillere;
}

const GiPoeng: React.FC<Props> = ({ onOppdaterPoeng, poengTilSpillere, spillere }) => {
    const spillerIder = getSpillerIder(spillere);

    const oppdaterPoeng = (spillerId: string, antallPoeng: number) => {
        onOppdaterPoeng(
            poengTilSpillere ? { ...poengTilSpillere, [spillerId]: antallPoeng } : { [spillerId]: antallPoeng },
        );
    };

    return (
        <>
            <SeksjonHeading heading="Antall poeng:" />
            <div className="nyePoengInput">
                {spillerIder.map((id) => (
                    <label key={`poeng-input-${id}`} className="labelNyePoeng">
                        <span className="navn">{spillere[id].navn}</span>
                        <input
                            className="inputNyePoeng"
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={
                                poengTilSpillere && (poengTilSpillere[id] || poengTilSpillere[id] === 0)
                                    ? poengTilSpillere[id]!.toString()
                                    : ''
                            }
                            onChange={(event) => oppdaterPoeng(id, parseInt(event.target.value))}
                        />
                    </label>
                ))}
            </div>
        </>
    );
};

export default GiPoeng;
