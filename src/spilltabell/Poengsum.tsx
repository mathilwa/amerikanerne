import React from 'react';
import './spilltabell.css';
import { Spill, Spillere } from '../types/Types';
import { finnTotalsumForSpiller, mapSamletPoengsumForSpill } from '../utils';
import MiniHeading from '../headings/MiniHeading';

interface Props {
    spill: Spill;
    spillere: Spillere;
}

const SpillTabell: React.FC<Props> = ({ spill, spillere }) => {
    const runder = spill.runder;

    const spillerErVinner = (spillerId: string): boolean => {
        const allePoengForSpill = mapSamletPoengsumForSpill(spill);
        if (!allePoengForSpill) {
            return false;
        }

        const spillereSomHarVunnet = Object.keys(allePoengForSpill).filter((id) => allePoengForSpill[id] >= 52);
        return spillereSomHarVunnet.includes(spillerId);
    };

    return (
        <>
            {runder && Object.keys(runder).length > 1 && (
                <div className="totalsum">
                    <MiniHeading heading="Totalt:" />
                    <div className="spilltabell">
                        {spill.spillerRekkefolge.map((id) => (
                            <div key={'navn-sum' + id} className={`${spillerErVinner(id) ? 'vinnerHeader' : ''}`}>
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
    );
};

export default SpillTabell;
