import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Poeng, Runde, Runder, Spill, Spillere } from './types/Types';
import { finnTotalsumForSpiller, formaterSpillForLagring, getSpillerIder, getSpilletHarEnVinner } from './utils';
import sortBy from 'lodash.sortby';

const App: React.FC = () => {
    const [spillere, setSpillere] = useState<Spillere | null>(null);
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);
    const [pagaendeSpill, setPaGaendeSpill] = useState<Spill | null>(null);

    useEffect(() => {
        const database = getFirestore();

        const getSpillData = async () => {
            const spillereCollection = collection(database, 'users');
            const spillCollection = collection(database, 'spill');

            await getDocs(spillereCollection).then((snapshot) => {
                const spillerData = snapshot.docs.reduce((akk, doc) => {
                    return { ...akk, [doc.id]: doc.data() };
                }, {});
                setSpillere(spillerData);
            });

            const alleSpill: Spill[] = [];
            await getDocs(spillCollection).then((snapshot) => {
                snapshot.docs.map((doc) => {
                    const spillData = doc.data();

                    alleSpill.push({
                        id: doc.id,
                        vinnerIder: spillData.vinnerIder ?? [],
                        runder: (spillData.runder as Runder) ?? [],
                        startet: spillData.startingAt.toDate(),
                        avsluttet: !!spillData.endingAt ? spillData.endingAt : null,
                    });
                }, {});
            });

            if (alleSpill.length === 1) {
                const paGaendeSpill = alleSpill[0];
                setPaGaendeSpill(paGaendeSpill);
            } else if (alleSpill.length > 1) {
                const alleSpillSortert = sortBy(alleSpill, 'startet');

                const gamleSpill = alleSpillSortert.slice(0, alleSpillSortert.length - 1);
                const paGaendeSpill = alleSpillSortert[alleSpillSortert.length - 1];
                setGamleSpill(gamleSpill);
                setPaGaendeSpill(paGaendeSpill);
            } else {
                setPaGaendeSpill(null);
                setGamleSpill([]);
            }
        };
        getSpillData();
    }, []);

    const startNyttSpill = async (nyttSpill: Spill) => {
        const database = getFirestore();
        const lagretSpill = await addDoc(collection(database, 'spill'), formaterSpillForLagring(nyttSpill));

        pagaendeSpill && setGamleSpill(gamleSpill.concat(pagaendeSpill));
        setPaGaendeSpill({ ...nyttSpill, id: lagretSpill.id });
        setVisNyttSpillModal(false);
    };

    const startNyRunde = async (runde: Runde) => {
        if (pagaendeSpill && pagaendeSpill.id) {
            const indexForNyRunde = pagaendeSpill.runder ? Object.keys(pagaendeSpill.runder).length : 0;

            const database = getFirestore();
            await setDoc(doc(database, 'spill', pagaendeSpill.id), {
                ...formaterSpillForLagring(pagaendeSpill),
                runder: { ...pagaendeSpill.runder, [indexForNyRunde]: runde },
            });
            setPaGaendeSpill({ ...pagaendeSpill, runder: { ...pagaendeSpill.runder, [indexForNyRunde]: runde } });
            setVisSettNyRundeModal(false);
        }
    };

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };

    const onLagrePoeng = async (oppdatertePoeng: Poeng) => {
        if (pagaendeSpill && pagaendeSpill.id && pagaendeSpill.runder) {
            const database = getFirestore();

            const gjeldendeRundeIndex = Object.keys(pagaendeSpill.runder).length - 1;
            const gjeldendeRunde = pagaendeSpill.runder[gjeldendeRundeIndex];
            const oppdatertRundeData = {
                ...pagaendeSpill.runder,
                [gjeldendeRundeIndex]: { ...gjeldendeRunde, poeng: oppdatertePoeng },
            };

            const spillVinnere = spillere
                ? getSpillerIder(spillere).filter(
                      (spillerId) => finnTotalsumForSpiller(oppdatertRundeData, spillerId) >= 52,
                  )
                : null;

            await setDoc(doc(database, 'spill', pagaendeSpill.id), {
                ...formaterSpillForLagring(pagaendeSpill),
                runder: oppdatertRundeData,
                vinnerIder: spillVinnere,
            });

            setPaGaendeSpill({ ...pagaendeSpill, runder: oppdatertRundeData, vinnerIder: spillVinnere ?? [] });
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

                {pagaendeSpill && (
                    <div className="pagaendeSpillContainer">
                        <SpillTabell spill={pagaendeSpill} spillere={spillere} />

                        <div className="knappContainer">
                            <button
                                className={`knapp ${
                                    getSpilletHarEnVinner(pagaendeSpill, getSpillerIder(spillere))
                                        ? ''
                                        : 'sekundaerKnapp'
                                }`}
                                onClick={() => setVisNyttSpillModal(true)}
                            >
                                + Nytt spill
                            </button>
                            <div>
                                <button
                                    className={`knapp nyRunde ${
                                        getSpilletHarEnVinner(pagaendeSpill, getSpillerIder(spillere)) ||
                                        (pagaendeSpill.runder &&
                                            pagaendeSpill.runder[Object.keys(pagaendeSpill.runder).length - 1] &&
                                            !pagaendeSpill.runder[Object.keys(pagaendeSpill.runder).length - 1]
                                                .poeng)
                                            ? 'sekundaerKnapp'
                                            : ''
                                    }`}
                                    onClick={() => setVisSettNyRundeModal(true)}
                                >
                                    + Legg til runde
                                </button>
                                <button
                                    className={`knapp ${
                                        pagaendeSpill.runder &&
                                        pagaendeSpill.runder[Object.keys(pagaendeSpill.runder).length - 1] &&
                                        pagaendeSpill.runder[Object.keys(pagaendeSpill.runder).length - 1].poeng
                                            ? 'sekundaerKnapp'
                                            : ''
                                    }`}
                                    onClick={() => setVisGiPoengModal(true)}
                                >
                                    + Legg til poeng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                {pagaendeSpill && pagaendeSpill.runder && (
                    <GiPoengForRundeModal
                        onOppdaterPoeng={(oppdatertePoeng) => onLagrePoeng(oppdatertePoeng)}
                        visGiPoengForRunde={visGiPoengModal}
                        gjeldendeRunde={gjeldendeRunde(pagaendeSpill.runder)}
                        onAvbryt={() => setVisGiPoengModal(false)}
                        spillere={spillere}
                    />
                )}

                {gamleSpill.length > 0 && (
                    <div>
                        <h2 className="tidligereSpillHeading">Tidligere spill:</h2>
                        {gamleSpill.map((gammeltSpill) => (
                            <SpillTabell
                                key={`gammeltSpill-${gammeltSpill.id}`}
                                spill={gammeltSpill}
                                spillere={spillere}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
