import React from 'react';
import './App.css';
import { Spill, spillereData } from './App';

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

    if (spill.runder && spill.runder[0] && spill.runder[0].poeng) {
        console.log('runder', spill.runder[0].poeng!['1']);
    }

    return (
        <>
            <div className="poengtabell">
                {spill.spillerIder.map((id) => (
                    <span key={'navn' + id}>{spillereData[id]}</span>
                ))}
            </div>
            {runder && runder[0].poeng && (
                <>
                    <div>
                        {Object.keys(runder).map((runde) => (
                            <div key={runde} className="poengtabell">
                                {runder[runde] &&
                                    runder[runde].poeng &&
                                    Object.keys(runder[runde].poeng!).map((spillerId) => (
                                        <li key={spillerId} className="poeng">
                                            {runder[runde] && runder[runde].poeng
                                                ? runder[runde].poeng![spillerId]
                                                : 0}
                                        </li>
                                    ))}
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
