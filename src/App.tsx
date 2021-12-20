import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Poeng, Runde, Runder, Spill, Spillere } from './types/Types';

const App: React.FC = () => {
    const [spillere, setSpillere] = useState<Spillere | null>(null);
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);
    const [spill, setSpill] = useState<Spill | null>(null);

    useEffect(() => {
        const database = getFirestore();

        const getSpillere = async () => {
            const spillereCollection = collection(database, 'users');

            await getDocs(spillereCollection).then((snapshot) => {
                const spillerData = snapshot.docs.reduce((akk, doc) => {
                    return { ...akk, [doc.id]: doc.data() };
                }, {});
                setSpillere(spillerData);
            });
        };

        const getSpill = async () => {
            const spillCollection = collection(database, 'spill');

            await getDocs(spillCollection).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const spillData = doc.data();

                    const rundeData: Runder = spillData.runder.map((runde: any) => {
                        const melding = { slag: runde.slagMeldt, antallStikk: runde.antallMeldt };
                        const poeng = runde.poeng.reduce(
                            (akk: Poeng, p: Poeng) => ({ ...akk, [p.spillerId]: p.poeng }),
                            {},
                        );

                        return {
                            melding,
                            lag: runde.lag,
                            melder: runde.melderId,
                            poeng,
                        };
                    });

                    setSpill({
                        vinnerId: !!spillData.vinnerId ? (spillData.vinnerId as string) : null,
                        runder: rundeData as Runder,
                    });
                }, {});
            });
        };
        getSpillere();
        getSpill();
    }, []);

    const startNyttSpill = (spill: Spill) => {
        setGamleSpill(gamleSpill.concat(spill));
        setSpill(spill);
        setVisNyttSpillModal(false);
    };

    const startNyRunde = (runde: Runde) => {
        if (spill) {
            const indexForNyRunde = spill.runder ? Object.keys(spill.runder).length : 0;

            setSpill({ ...spill, runder: { ...spill.runder, [indexForNyRunde]: runde } });
            setVisSettNyRundeModal(false);
        }
    };

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };

    console.log(spillere);

    if (!spillere) {
        return null;
    }

    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <div className="sideContainer">
                <h1>Amerikanerne</h1>

                {spill && <SpillTabell spill={spill} spillere={spillere} />}

                <div className="knappContainer">
                    <button className="knapp" onClick={() => setVisNyttSpillModal(true)}>
                        + Nytt spill
                    </button>
                    <div>
                        <button className="knapp nyRunde" onClick={() => setVisSettNyRundeModal(true)}>
                            + Legg til runde
                        </button>
                        <button className="knapp" onClick={() => setVisGiPoengModal(true)}>
                            + Legg til poeng
                        </button>
                    </div>
                </div>

                <NyttSpillModal
                    visNyttSpillInput={visNyttSpillModal}
                    setNyttSpill={startNyttSpill}
                    onAvbryt={() => setVisNyttSpillModal(false)}
                    spillere={spillere}
                />

                <NyRundeModal
                    visNyttSpillInput={visSettNyRundeModal}
                    startNyRunde={startNyRunde}
                    onAvbryt={() => setVisSettNyRundeModal(false)}
                    spillere={spillere}
                />
                {spill && spill.runder && (
                    <GiPoengForRundeModal
                        oppdatertRundeMedPoeng={(nyRunde) => {
                            const sisteRundeIndex = spill.runder ? Object.keys(spill.runder).length : 0;
                            setSpill({ ...spill, runder: { ...spill.runder, [sisteRundeIndex]: nyRunde } });
                            setVisGiPoengModal(false);
                        }}
                        visGiPoengForRunde={visGiPoengModal}
                        gjeldendeRunde={gjeldendeRunde(spill.runder)}
                        onAvbryt={() => setVisGiPoengModal(false)}
                        spillere={spillere}
                    />
                )}

                {gamleSpill.length > 0 && (
                    <div>
                        {gamleSpill.map((gammeltSpill) => (
                            <SpillTabell spill={gammeltSpill} spillere={spillere} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
