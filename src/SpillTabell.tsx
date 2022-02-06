import React from 'react';
import './styles.css';
import { slagIkoner, Spill, Spillere } from './types/Types';
import { finnTotalsumForSpiller, formatDateAndClock, getSpillerIder, mapSamletPoengsumForSpill } from './utils';

interface Props {
    spill: Spill;
    spillere: Spillere;
}

const SpillTabell: React.FC<Props> = ({ spill, spillere }) => {
    const runder = spill.runder;

    const spillerIder = getSpillerIder(spillere);

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

    return (
        <div className="spillTabellContainer">
            <div className="spillStartet">{spillStartetTekst}</div>

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
                <span className="tabellHeaderMeldingMobil">Mld</span>
                <span className="tabellHeaderMeldingDesktop">Melding</span>
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
                                    <div key={'navn-sum' + id}>
                                        <span className="tabellHeaderMobil">{spillere[id].forkortelse}</span>
                                        <span className="tabellHeaderDesktop">{spillere[id].navn}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="poengtabell">
                                {spillerIder.map((id) => (
                                    <span key={'sum' + id} className={`${spillerErVinner(id) ? 'vinner' : ''}`}>
                                        {finnTotalsumForSpiller(runder, id)}
                                    </span>
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
