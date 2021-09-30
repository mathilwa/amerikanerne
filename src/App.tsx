import React, { useState } from 'react';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';

enum Slag {
    Klover = 'Kløver',
    Spar = 'Spar',
    Hjerter = 'Hjerter',
    Ruter = 'Ruter',
}

type Spiller = Record<string, string>;
interface Melding {
    slag: Slag | null;
    antallStikk: number | null;
}

type Poeng = Record<string, number>;

type Runder = Record<string, Poeng>;

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
    const [gamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillInput, setVisNyttSpillInput] = useState<boolean>(false);
    const [nyMelding, setNyMelding] = useState<Melding>({ antallStikk: null, slag: null });

    const [spill, setSpill] = useState<Spill>({
        spillerIder: ['1', '2', '3', '4'],
        lag: ['1', '2'],
        melder: '1',
        melding: { slag: Slag.Klover, antallStikk: 8 },
        runder: {
            '0': { '1': 3, '2': 3, '3': 3, '4': 3 },
        },
    });
    console.log(nyMelding);
    const [nyRundedata, setNyRundedata] = useState<Poeng | null>(null);

    const oppdaterRundedata = (spillerId: string, poeng: number) => {
        if (nyRundedata) {
            setNyRundedata({ ...nyRundedata, [spillerId]: poeng });
        } else {
            setNyRundedata({ [spillerId]: poeng });
        }
    };
    const leggTilRunde = () => {
        const antallRunderTilNa = spill.runder ? Object.keys(spill.runder).length : 0;

        if (nyRundedata) {
            setSpill({ ...spill, runder: { ...spill.runder, [antallRunderTilNa + 1]: nyRundedata } });
        }

        setNyRundedata(null);
    };

    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <p>Amerikanerne</p>

            <button onClick={() => setVisNyttSpillInput(true)}>+ Nytt spill</button>
            {visNyttSpillInput && (
                <div>
                    <div>
                        Spillere:{' '}
                        {spill.spillerIder.map((id) => (
                            <span key={'spillere' + id}>{spillereData[id]}</span>
                        ))}
                    </div>
                    <>
                        <p>Hva meldes?</p>
                        <>
                            {Object.values(Slag).map((typeSlag) => (
                                <>
                                    <input
                                        type="radio"
                                        id={typeSlag}
                                        onChange={() => setNyMelding({ ...nyMelding, slag: typeSlag })}
                                        checked={nyMelding.slag === typeSlag}
                                    />
                                    <label htmlFor={typeSlag}>{typeSlag}</label>
                                </>
                            ))}
                        </>
                    </>
                </div>
            )}
            <SpillTabell spill={spill} />

            <div className="nyePoeng">
                <p className="nyePoengTittel">Legg til poeng:</p>
                {spill.spillerIder.map((id) => (
                    <div key={id} className="leggTilNyePoeng">
                        <label className="labelNyePoeng" htmlFor={id}>
                            {spillereData[id]}
                        </label>
                        <input
                            className="inputNyePoeng"
                            key={id}
                            id={id}
                            type="text"
                            value={nyRundedata && nyRundedata[id] ? nyRundedata[id] : ''}
                            onChange={(event) => oppdaterRundedata(id, parseInt(event.target.value))}
                        />
                    </div>
                ))}
                <button onClick={leggTilRunde}>Legg til</button>
            </div>

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
