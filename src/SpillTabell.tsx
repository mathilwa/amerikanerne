import React from 'react';
import './App.css';
import { slagIkoner, Spill, Spillere } from './types/Types';
import { finnTotalsumForSpiller, formatDateAndClock, getSpillerIder } from './utils';

interface Props {
    spill: Spill;
    spillere: Spillere;
}

const SpillTabell: React.FC<Props> = ({ spill, spillere }) => {
    const runder = spill.runder;

    const spillerIder = getSpillerIder(spillere);

    return (
        <div className="spillTabellContainer">
            {spill.startet && (
                <div className="spillStartet">{`Startet ${formatDateAndClock(new Date(spill.startet))}`}</div>
            )}
            <div className="poengtabell">
                {spillerIder.map((id) => (
                    <div key={'navn-' + id}>
                        <span key={'navn-mobil-' + id} className="tabellHeaderMobil">
                            {spillere[id].forkortelse}
                        </span>
                        <span key={'navn-desktop-' + id} className="tabellHeaderDesktop">
                            {spillere[id].navn}
                        </span>
                    </div>
                ))}
                <span>Melding</span>
            </div>
            {runder && runder[0] && (
                <>
                    <div className="runder">
                        {Object.keys(runder).map((runde) => (
                            <div key={runde} className="poengtabell">
                                {runder[runde] && (
                                    <>
                                        {spillerIder.map((spillerId) => (
                                            <div key={spillerId} className="poengContainer">
                                                <div
                                                    className={`poeng ${
                                                        runder[runde].lag.includes(spillerId) ? 'lag' : ''
                                                    } ${runder[runde].melder === spillerId ? 'rundeMelder' : ''}`}
                                                >
                                                    {runder[runde].poeng ? runder[runde].poeng![spillerId] : '-'}
                                                </div>
                                            </div>
                                        ))}
                                        {runder[runde].melding && (
                                            <div className="poengContainer">
                                                <div className="melding">
                                                    <img
                                                        className="slagIkon"
                                                        src={slagIkoner[runder[runde].melding!.slag!].vanlig}
                                                        alt=""
                                                    />
                                                    <div>{`${runder[runde].melding.antallStikk}`}</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    {Object.keys(runder).length > 1 && (
                        <div className="totalsum">
                            <div className="totalsumHeading">Totalt:</div>
                            <div className="poengtabell">
                                {spillerIder.map((id) => (
                                    <span key={'sum' + id}>{finnTotalsumForSpiller(runder, id)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SpillTabell;
