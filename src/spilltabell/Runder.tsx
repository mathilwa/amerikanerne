import React from 'react';
import './spilltabell.css';
import { slagIkoner, Spill } from '../types/Types';
import { getSpillerIdSomDelerForRunde } from '../utils';

interface Props {
    spill: Spill;
    pagaendeSpill?: boolean;
}

const Runder: React.FC<Props> = ({ spill, pagaendeSpill = false }) => {
    const runder = spill.runder;

    const getSpillerErDelerForRunde = (spillerId: string, rundeKey: string) => {
        const spillerIdSomDeler = getSpillerIdSomDelerForRunde(spill, parseInt(rundeKey));
        return spillerIdSomDeler === spillerId;
    };

    return (
        <>
            {runder && (
                <div className="runder">
                    {Object.keys(runder).map((rundeKey) => (
                        <div key={rundeKey} className="spilltabell">
                            {runder[rundeKey] && (
                                <>
                                    {spill.spillerRekkefolge.map((spillerId) => (
                                        <div key={spillerId} className="tabellrute poengContainer">
                                            {pagaendeSpill && getSpillerErDelerForRunde(spillerId, rundeKey) && (
                                                <div className="deler">{`🃏`}</div>
                                            )}
                                            <div
                                                className={`poeng ${
                                                    runder[rundeKey].lag.includes(spillerId) ? 'lag' : ''
                                                } ${runder[rundeKey].melder === spillerId ? 'rundeMelder' : ''}`}
                                            >
                                                {runder[rundeKey].poeng ? runder[rundeKey].poeng![spillerId] : '-'}
                                            </div>
                                        </div>
                                    ))}
                                    {runder[rundeKey].melding && (
                                        <div className="tabellrute meldingContainer">
                                            <div className="meldingVisning">
                                                <img
                                                    className="slagIkon"
                                                    src={slagIkoner[runder[rundeKey].melding!.slag!].vanlig}
                                                    alt=""
                                                />
                                                <div>{`${runder[rundeKey].melding.antallStikk}`}</div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Runder;
