import React, { useState } from 'react';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import NyRundeModal from './NyRundeModal';
import hjerterIkon from './icons/hjerter.png';
import hjerterValgtIkon from './icons/hjerter-valgt.png';
import ruterIkon from './icons/ruter.png';
import ruterValgtIkon from './icons/ruter-valgt.png';
import kloverIkon from './icons/klover.png';
import kloverValgtIkon from './icons/klover-valgt.png';
import sparIkon from './icons/spar.png';
import sparValgtIkon from './icons/spar-valgt.png';

export enum Slag {
    Klover = 'Kløver',
    Spar = 'Spar',
    Hjerter = 'Hjerter',
    Ruter = 'Ruter',
}

export const slagIkoner: {
    [key in Slag]: {
        valgt: string;
        vanlig: string;
    };
} = {
    [Slag.Klover]: {
        vanlig: kloverIkon,
        valgt: kloverValgtIkon,
    },
    [Slag.Spar]: {
        vanlig: sparIkon,
        valgt: sparValgtIkon,
    },
    [Slag.Hjerter]: {
        vanlig: hjerterIkon,
        valgt: hjerterValgtIkon,
    },
    [Slag.Ruter]: {
        vanlig: ruterIkon,
        valgt: ruterValgtIkon,
    },
};

type Spiller = Record<string, string>;
export interface Melding {
    slag: Slag | null;
    antallStikk: number | null;
}

export type Poeng = Record<string, number>;
export type Runder = Record<string, Poeng>;

export const spillereData: Spiller = {
    '1': 'Trond',
    '2': 'Torunn',
    '3': 'Kristian',
    '4': 'Mathilde',
};

export interface Spill {
    lag: string[];
    melder: string;
    melding: Melding | null;
    runder: Runder | null;
    spillerIder: string[];
}

const App: React.FC = () => {
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);

    const [spill, setSpill] = useState<Spill>({
        spillerIder: ['1', '2', '3', '4'],
        lag: ['1', '2'],
        melder: '1',
        melding: { slag: Slag.Klover, antallStikk: 8 },
        runder: {
            '0': { '1': 3, '2': 3, '3': 3, '4': 3 },
        },
    });

    const startNyttSpill = (spill: Spill) => {
        setGamleSpill(gamleSpill.concat(spill));
        setSpill(spill);
        setVisNyttSpillModal(false);
    };

    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <p>Amerikanerne</p>

            <button onClick={() => setVisNyttSpillModal(true)}>+ Nytt spill</button>
            <NyttSpillModal visNyttSpillInput={visNyttSpillModal} setNyttSpill={startNyttSpill} />

            <SpillTabell spill={spill} />

            <button onClick={() => setVisSettNyRundeModal(true)}>Legg til runde</button>
            <NyRundeModal
                setNyRunde={(nyRunde) => {
                    setSpill({ ...spill, runder: { ...spill.runder, ...nyRunde } });
                    setVisSettNyRundeModal(false);
                }}
                visSettNyRunde={visSettNyRundeModal}
                eksisterendeRunder={spill.runder}
                spillerIder={spill.spillerIder}
            />

            {gamleSpill.length > 0 && (
                <div>
                    {gamleSpill.map((gammeltSpill) => (
                        <SpillTabell spill={gammeltSpill} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
