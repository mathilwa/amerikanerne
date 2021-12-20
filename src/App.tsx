import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
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

                    setSpill({
                        id: doc.id,
                        vinnerId: !!spillData.vinnerId ? (spillData.vinnerId as string) : null,
                        runder: (spillData.runder as Runder) ?? [],
                    });
                }, {});
            });
        };
        getSpillere();
        getSpill();
    }, []);

    const startNyttSpill = async (spill: Spill) => {
        const database = getFirestore();
        await addDoc(collection(database, 'spill'), {
            vinnerId: spill.vinnerId ?? '',
            runder: spill.runder,
            startingAt: new Date(),
            endingAt: null,
        });

        setGamleSpill(gamleSpill.concat(spill));
        setSpill(spill);
        setVisNyttSpillModal(false);
    };

    const startNyRunde = async (runde: Runde) => {
        if (spill && spill.id) {
            const indexForNyRunde = spill.runder ? Object.keys(spill.runder).length : 0;

            const database = getFirestore();
            await setDoc(doc(database, 'spill', spill.id), {
                ...spill,
                runder: { ...spill.runder, [indexForNyRunde]: runde },
            });
            setSpill({ ...spill, runder: { ...spill.runder, [indexForNyRunde]: runde } });
            setVisSettNyRundeModal(false);
        }
    };

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };

    const onLagrePoeng = async (oppdatertePoeng: Poeng) => {
        if (spill && spill.id && spill.runder) {
            const database = getFirestore();

            const gjeldendeRundeIndex = Object.keys(spill.runder).length - 1;
            const gjeldendeRunde = spill.runder[gjeldendeRundeIndex];
            const oppdatertSpillData = {
                ...spill,
                runder: { ...spill.runder, [gjeldendeRundeIndex]: { ...gjeldendeRunde, poeng: oppdatertePoeng } },
            };

            await setDoc(doc(database, 'spill', spill.id), oppdatertSpillData);

            setSpill(oppdatertSpillData);
            setVisGiPoengModal(false);
        }
    };

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
                        onOppdaterPoeng={(oppdatertePoeng) => onLagrePoeng(oppdatertePoeng)}
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
