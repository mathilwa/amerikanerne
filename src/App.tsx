import React, { useState } from 'react';
import './App.css';
import logo from './icons/cards.png';

enum Slag {
    Klover = 'klover',
    Spar = 'spar',
    Hjerter = 'hjerter',
    Ruter = 'ruter',
}

type Spiller = Record<string, string>;
type Melding = [Slag, number];
type Poeng = Record<string, number>;

type Runder = Record<string, Poeng>;

const spillereData: Spiller = {
    '1': 'Trond',
    '2': 'Torunn',
    '3': 'Kristian',
    '4': 'Mathilde',
};

interface Spill {
    lag: string[];
    melder: string;
    melding: Melding | null;
    runder: Runder | null;
    spillerIder: string[];
}

const App: React.FC = () => {
    const [spill, setSpill] = useState<Spill>({
        spillerIder: ['1', '2', '3', '4'],
        lag: ['1', '2'],
        melder: '1',
        melding: [Slag.Klover, 8],
        runder: {
            '0': { '1': 3, '2': 3, '3': 3, '4': 3 },
        },
    });
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
    const runder = spill.runder;

    const finnTotalsumForSpiller = (spillerId: string) => {
        if (runder) {
            return Object.values(runder).reduce((akk, poengliste) => akk + poengliste[spillerId], 0);
        }
        return 0;
    };

    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <p>Amerikanerne</p>
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
        </div>
    );
};

export default App;
