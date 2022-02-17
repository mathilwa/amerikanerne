import React from 'react';
import './styles.css';
import { slagIkoner, Spill, Spillere } from './types/Types';
import {
    finnTotalsumForSpiller,
    formatDateAndClock,
    getSpillerIdSomDelerForRunde,
    mapSamletPoengsumForSpill,
} from './utils';

interface Props {
    spill: Spill;
    spillere: Spillere;
    pagaendeSpill?: boolean;
}

const SpillTabell: React.FC<Props> = ({ spill, spillere, pagaendeSpill = false }) => {
    const runder = spill.runder;

    const spillerErVinner = (spillerId: string): boolean => {
        const allePoengForSpill = mapSamletPoengsumForSpill(spill);
        if (!allePoengForSpill) {
            return false;
        }

        const spillereSomHarVunnet = Object.keys(allePoengForSpill).filter((id) => allePoengForSpill[id] >= 52);
        return spillereSomHarVunnet.includes(spillerId);
    };

    const spillStartetTekst =
        spill.startet && spill.startet > new Date('12.01.2021')
            ? `Startet ${formatDateAndClock(new Date(spill.startet))}`
            : 'Startet: Før desember 2021';

    const getSpillerErDelerForRunde = (spillerId: string, rundeKey: string) => {
        const spillerIdSomDeler = getSpillerIdSomDelerForRunde(spill, parseInt(rundeKey));
        return spillerIdSomDeler === spillerId;
    };

    return (
        <div className="spillTabellContainer">
            <div className="spillStartet">{spillStartetTekst}</div>

            <div className="poengtabell">
                {spill.spillerRekkefolge.map((id) => (
                    <div key={'navn-' + id}>
                        <span key={'navn-mobil-' + id} className="tabellHeaderMobil">
                            {spillere[id].forkortelse}
                        </span>
                        <span key={'navn-desktop-' + id} className="tabellHeaderDesktop">
                            {spillere[id].navn}
                        </span>
                    </div>
                ))}
                <span className="tabellHeaderMeldingMobil">Mld</span>
                <span className="tabellHeaderMeldingDesktop">Melding</span>
            </div>
            {runder && (
                <>
                    <div className="runder">
                        {Object.keys(runder).map((rundeKey) => (
                            <div key={rundeKey} className="poengtabell">
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
                            <div className="poengtabell">
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
                            <div className="poengtabell">
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
        </div>
    );
};

export default SpillTabell;
