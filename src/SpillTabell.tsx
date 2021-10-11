import React from 'react';
import './App.css';
import { slagIkoner, Spill, spillereData } from './App';

interface Props {
    spill: Spill;
}

const SpillTabell: React.FC<Props> = ({ spill }) => {
    const runder = spill.runder;

    const finnTotalsumForSpiller = (spillerId: string) => {
        if (runder) {
            return Object.values(runder).reduce((akk, runde) => {
                if (runde.poeng) {
                    return akk + runde.poeng[spillerId];
                } else {
                    return akk;
                }
            }, 0);
        }
        return 0;
    };

    console.log('spill', spill);

    return (
        <>
            <div className="poengtabell">
                {spill.spillerIder.map((id) => (
                    <>
                        <span key={'navn-mobil-' + id} className="tabellHeaderMobil">
                            {spillereData[id].forkortelse}
                        </span>
                        <span key={'navn-desktop-' + id} className="tabellHeaderDesktop">
                            {spillereData[id].navn}
                        </span>
                    </>
                ))}
                <span>Melding</span>
            </div>
            {runder && runder[0].poeng && (
                <>
                    <div>
                        {Object.keys(runder).map((runde) => (
                            <div key={runde} className="poengtabell">
                                {runder[runde] && (
                                    <>
                                        {spill.spillerIder.map((spillerId) => (
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
                            Totalt:{' '}
                            <div className="poengtabell">
                                {spill.spillerIder.map((id) => (
                                    <span key={'sum' + id}>{finnTotalsumForSpiller(id)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default SpillTabell;
