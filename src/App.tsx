import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Poeng, Runde, Runder, Spill, Spillere } from './types/Types';
import { formaterSpillForLagring } from './utils';
import sortBy from 'lodash.sortby';

const App: React.FC = () => {
    const [spillere, setSpillere] = useState<Spillere | null>(null);
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);
    const [paGaendeSpill, setPaGaendeSpill] = useState<Spill | null>(null);

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

            const alleSpill: Spill[] = [];
            await getDocs(spillCollection).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const spillData = doc.data();

                    alleSpill.push({
                        id: doc.id,
                        vinnerId: !!spillData.vinnerId ? (spillData.vinnerId as string) : null,
                        runder: (spillData.runder as Runder) ?? [],
                        startet: spillData.startingAt.toDate(),
                        avsluttet: !!spillData.endingAt ? spillData.endingAt : null,
                    });
                }, {});
            });
            const alleSpillSortert = sortBy(alleSpill, 'startet');

            const gamleSpill = alleSpillSortert.slice(0, alleSpillSortert.length - 1);
            setGamleSpill(gamleSpill);
            setPaGaendeSpill(alleSpillSortert[alleSpillSortert.length - 1]);
        };
        getSpillere();
        getSpill();
    }, []);

    const startNyttSpill = async (nyttSpill: Spill) => {
        const database = getFirestore();
        const lagretSpill = await addDoc(collection(database, 'spill'), formaterSpillForLagring(nyttSpill));

        paGaendeSpill && setGamleSpill(gamleSpill.concat(paGaendeSpill));
        setPaGaendeSpill({ ...nyttSpill, id: lagretSpill.id });
        setVisNyttSpillModal(false);
    };

    const startNyRunde = async (runde: Runde) => {
        if (paGaendeSpill && paGaendeSpill.id) {
            const indexForNyRunde = paGaendeSpill.runder ? Object.keys(paGaendeSpill.runder).length : 0;

            const database = getFirestore();
            await setDoc(doc(database, 'spill', paGaendeSpill.id), {
                ...formaterSpillForLagring(paGaendeSpill),
                runder: { ...paGaendeSpill.runder, [indexForNyRunde]: runde },
            });
            setPaGaendeSpill({ ...paGaendeSpill, runder: { ...paGaendeSpill.runder, [indexForNyRunde]: runde } });
            setVisSettNyRundeModal(false);
        }
    };

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };

    const onLagrePoeng = async (oppdatertePoeng: Poeng) => {
        if (paGaendeSpill && paGaendeSpill.id && paGaendeSpill.runder) {
            const database = getFirestore();

            const gjeldendeRundeIndex = Object.keys(paGaendeSpill.runder).length - 1;
            const gjeldendeRunde = paGaendeSpill.runder[gjeldendeRundeIndex];
            const oppdatertRundeData = {
                ...paGaendeSpill.runder,
                [gjeldendeRundeIndex]: { ...gjeldendeRunde, poeng: oppdatertePoeng },
            };

            await setDoc(doc(database, 'spill', paGaendeSpill.id), {
                ...formaterSpillForLagring(paGaendeSpill),
                runder: oppdatertRundeData,
            });

            setPaGaendeSpill({ ...paGaendeSpill, runder: oppdatertRundeData });
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

                {paGaendeSpill && <SpillTabell spill={paGaendeSpill} spillere={spillere} />}

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
                {paGaendeSpill && paGaendeSpill.runder && (
                    <GiPoengForRundeModal
                        onOppdaterPoeng={(oppdatertePoeng) => onLagrePoeng(oppdatertePoeng)}
                        visGiPoengForRunde={visGiPoengModal}
                        gjeldendeRunde={gjeldendeRunde(paGaendeSpill.runder)}
                        onAvbryt={() => setVisGiPoengModal(false)}
                        spillere={spillere}
                    />
                )}

                {gamleSpill.length > 0 && (
                    <div>
                        <h2>Tidligere spill:</h2>
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
