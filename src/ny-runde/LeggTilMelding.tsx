import React from 'react';
import './ny-runde.css';
import { Melding, Slag, slagIkoner } from '../types/Types';
import SeksjonHeading from '../headings/SeksjonHeading';

interface Props {
    onOppdaterMelding: (nyMelding: Melding) => void;
    melding: Melding;
}

const LeggTilMelding: React.FC<Props> = ({ onOppdaterMelding, melding }) => (
    <>
        <SeksjonHeading heading="Hva meldes?" />

        <div className="hvaMeldes">
            <div className="melding">
                <div className="slag">
                    {Object.values(Slag).map((typeSlag) => (
                        <label key={typeSlag} className={`${melding.slag === typeSlag ? 'valgt' : '' }`}>
                            <input
                                type="radio"
                                id={typeSlag}
                                onChange={() => onOppdaterMelding({ ...melding, slag: typeSlag })}
                                checked={melding.slag === typeSlag}
                            />
                            <img
                                src={slagIkoner[typeSlag].vanlig}
                                className="slagIkon"
                                alt=""
                            />
                        </label>
                    ))}
                </div>

                <div className="leggTilNyePoeng">
                    <label className="labelNyePoeng">
                        <input
                            className="inputNyePoeng"
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={melding.antallStikk ? melding.antallStikk : ''}
                            onChange={(event) =>
                                onOppdaterMelding({
                                    ...melding,
                                    antallStikk: parseInt(event.target.value),
                                })
                            }
                        />
                    </label>
                </div>
            </div>
        </div>
    </>
);

export default LeggTilMelding;
