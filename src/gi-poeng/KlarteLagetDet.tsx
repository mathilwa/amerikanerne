import React from 'react';
import './gi-poeng.css';
import { Runde, Spillere } from '../types/Types';

interface Props {
    klarteLagetDet: boolean | null;
    onOppdaterKlarteLagetDet: (klarteDet: boolean) => void;
    gjeldendeRunde: Runde;
    spillere: Spillere;
}

const GiPoengForRundeModal: React.FC<Props> = ({ klarteLagetDet, onOppdaterKlarteLagetDet, gjeldendeRunde }) => (
    <>
        {gjeldendeRunde && gjeldendeRunde.lag && (
            <>
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
