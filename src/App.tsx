import React, { useState } from 'react';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import hjerterIkon from './icons/hjerter.png';
import hjerterValgtIkon from './icons/hjerter-valgt.png';
import ruterIkon from './icons/ruter.png';
import ruterValgtIkon from './icons/ruter-valgt.png';
import kloverIkon from './icons/klover.png';
import kloverValgtIkon from './icons/klover-valgt.png';
import sparIkon from './icons/spar.png';
import sparValgtIkon from './icons/spar-valgt.png';
import NyRundeModal from './NyRundeModal';

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
export type Runder = Record<string, Runde>;

export const spillereData: Spiller = {
    '1': 'Trond',
    '2': 'Torunn',
    '3': 'Kristian',
    '4': 'Mathilde',
};

export interface Runde {
    poeng: Poeng | null;
    lag: string[];
    melder: string;
    melding: Melding;
}

export interface Spill {
    runder: Runder | null;
    spillerIder: string[];
}

const App: React.FC = () => {
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);

    const [spill, setSpill] = useState<Spill>({
        spillerIder: ['1', '2', '3', '4'],
        runder: {
            '0': {
                poeng: { '1': 3, '2': 3, '3': 3, '4': 3 },
                lag: ['1', '2'],
                melder: '1',
                melding: { slag: Slag.Klover, antallStikk: 8 },
            },
        },
    });

    const startNyttSpill = (spill: Spill) => {
        setGamleSpill(gamleSpill.concat(spill));
        setSpill(spill);
        setVisNyttSpillModal(false);
    };

    const startNyRunde = (runde: Runde) => {
        const indexForNyRunde = spill.runder ? Object.keys(spill.runder).length : 0;

        setSpill({ ...spill, runder: { ...spill.runder, [indexForNyRunde]: runde } });
        setVisSettNyRundeModal(false);
    };

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };
    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <h1>Amerikanerne</h1>

            <div className="knappContainer">
                <button className="knapp" onClick={() => setVisNyttSpillModal(true)}>
                    + Nytt spill
                </button>
            </div>
            <NyttSpillModal
                visNyttSpillInput={visNyttSpillModal}
                setNyttSpill={startNyttSpill}
                onAvbryt={() => setVisNyttSpillModal(false)}
            />

            <SpillTabell spill={spill} />

            <div className="knappContainer">
                <button className="knapp" onClick={() => setVisSettNyRundeModal(true)}>
                    Legg til runde
                </button>
            </div>

            <NyRundeModal
                visNyttSpillInput={visSettNyRundeModal}
                startNyRunde={startNyRunde}
                spillerIder={spill.spillerIder}
                onAvbryt={() => setVisSettNyRundeModal(false)}
            />
            {spill.runder && (
                <>
                    <div className="knappContainer">
                        <button className="knapp" onClick={() => setVisGiPoengModal(true)}>
                            Legg til poeng
                        </button>
                    </div>
                    <GiPoengForRundeModal
                        oppdatertRundeMedPoeng={(nyRunde) => {
                            const sisteRundeIndex = spill.runder ? Object.keys(spill.runder).length : 0;
                            setSpill({ ...spill, runder: { ...spill.runder, [sisteRundeIndex]: nyRunde } });
                            setVisGiPoengModal(false);
                        }}
                        visGiPoengForRunde={visGiPoengModal}
                        gjeldendeRunde={gjeldendeRunde(spill.runder)}
                        spillerIder={spill.spillerIder}
                        onAvbryt={() => setVisGiPoengModal(false)}
                    />
                </>
            )}

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
