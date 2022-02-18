import React from 'react';
import './spilltabell.css';
import { slagIkoner, Spill, Spillere } from '../types/Types';
import { finnTotalsumForSpiller, getSpillerIdSomDelerForRunde, mapSamletPoengsumForSpill } from '../utils';

interface Props {
    spill: Spill;
    spillere: Spillere;
    pagaendeSpill?: boolean;
}

const Runder: React.FC<Props> = ({ spill, spillere, pagaendeSpill = false }) => {
    const runder = spill.runder;

    const spillerErVinner = (spillerId: string): boolean => {
        const allePoengForSpill = mapSamletPoengsumForSpill(spill);
        if (!allePoengForSpill) {
            return false;
        }

        const spillereSomHarVunnet = Object.keys(allePoengForSpill).filter((id) => allePoengForSpill[id] >= 52);
        return spillereSomHarVunnet.includes(spillerId);
    };

    const getSpillerErDelerForRunde = (spillerId: string, rundeKey: string) => {
        const spillerIdSomDeler = getSpillerIdSomDelerForRunde(spill, parseInt(rundeKey));
        return spillerIdSomDeler === spillerId;
    };

    return (
        <>
            {runder && (
                <>
                    <div className="runder">
                        {Object.keys(runder).map((rundeKey) => (
                            <div key={rundeKey} className="spilltabell">
                                {runder[rundeKey] && (
                                    <>
                                        {spill.spillerRekkefolge.map((spillerId) => (
                                            <div key={spillerId} className="tabellrute poengContainer">
                                                {pagaendeSpill &&
                                                    getSpillerErDelerForRunde(spillerId, rundeKey) && (
                                                        <div className="deler">{`🃏`}</div>
                                                    )}
                                                <div
                                                    className={`poeng ${
                                                        runder[rundeKey].lag.includes(spillerId) ? 'lag' : ''
                                                    } ${
                                                        runder[rundeKey].melder === spillerId ? 'rundeMelder' : ''
                                                    }`}
                                                >
                                                    {runder[rundeKey].poeng
                                                        ? runder[rundeKey].poeng![spillerId]
                                                        : '-'}
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
                    {Object.keys(runder).length > 1 && (
                        <div className="totalsum">
                            <div className="totalsumHeading">Totalt:</div>
                            <div className="spilltabell">
                                {spill.spillerRekkefolge.map((id) => (
                                    <div
                                        key={'navn-sum' + id}
                                        className={`${spillerErVinner(id) ? 'vinnerHeader' : ''}`}
                                    >
                                        {spillerErVinner(id) && <span className="vinnerIkon">{`🏆`}</span>}
                                        <span className="tabellHeaderMobil">{spillere[id].forkortelse}</span>
                                        <span className="tabellHeaderDesktop">{spillere[id].navn}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="spilltabell">
                                {spill.spillerRekkefolge.map((id) => (
                                    <div key={'sum' + id} className={`${spillerErVinner(id) ? 'vinner' : ''}`}>
                                        {finnTotalsumForSpiller(runder, id)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Runder;
