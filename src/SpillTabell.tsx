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
            return Object.values(runder).reduce((akk, poengliste) => akk + poengliste[spillerId], 0);
        }
        return 0;
    };

    return (
        <>
            <div>
                Spillere:{' '}
                {spill.spillerIder.map((id) => (
                    <span key={'spillere' + id}>{spillereData[id]}</span>
                ))}
            </div>

            <div className="poengtabell">
                {spill.spillerIder.map((id) => (
                    <span key={'navn' + id}>{spillereData[id]}</span>
                ))}
            </div>
            {runder && (
                <>
                    <div>
                        {Object.keys(runder).map((runde) => (
                            <div key={runde} className="poengtabell">
                                {Object.keys(runder[runde]).map((spillerId) => (
                                    <li key={spillerId} className="poeng">
                                        {runder[runde][spillerId]}
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
