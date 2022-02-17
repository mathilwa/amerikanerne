import React from 'react';
import './gi-poeng.css';
import { Runde, Spillere } from '../types/Types';
import SeksjonHeading from '../seksjon-heading/SeksjonHeading';

interface Props {
    klarteLagetDet: boolean | null;
    onOppdaterKlarteLagetDet: (klarteDet: boolean) => void;
    gjeldendeRunde: Runde;
    spillere: Spillere;
}

const GiPoengForRundeModal: React.FC<Props> = ({
    klarteLagetDet,
    onOppdaterKlarteLagetDet,
    gjeldendeRunde,
    spillere,
}) => (
    <>
        {gjeldendeRunde && gjeldendeRunde.lag && (
            <>
                <SeksjonHeading
                    heading={`Klarte ${spillere[gjeldendeRunde.lag[0]].navn} og ${
                        spillere[gjeldendeRunde.lag[1]].navn
                    } det?`}
                />

                <div className="klarteLagetDetInput">
                    <label className={`radio ${klarteLagetDet === true ? 'checked' : ''}`}>
                        <input
                            type="radio"
                            onChange={() => onOppdaterKlarteLagetDet(true)}
                            checked={klarteLagetDet === true}
                        />
                        Ja
                    </label>

                    <label className={`radio ${klarteLagetDet === false ? 'checked' : ''}`}>
                        <input
                            type="radio"
                            onChange={() => onOppdaterKlarteLagetDet(false)}
                            checked={klarteLagetDet === false}
                        />
                        Nei
                    </label>
                </div>
            </>
        )}
    </>
);

export default GiPoengForRundeModal;
