import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import { Runder, Spill, Spillere } from './types/Types';
import orderBy from 'lodash.orderby';
import PagaendeSpill from './PagaendeSpill';

const App: React.FC = () => {
    const [spillere, setSpillere] = useState<Spillere | null>(null);
    const [gamleSpill, setGamleSpill] = useState<Spill[]>([]);
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
                        startet: !!spillData.startingAt ? spillData.startingAt.toDate() : null,
                        avsluttet: !!spillData.endingAt ? spillData.endingAt : null,
                    });
                }, {});
            });

            if (alleSpill.length === 1) {
                const paGaendeSpill = alleSpill[0];
                setPaGaendeSpill(paGaendeSpill);
            } else if (alleSpill.length > 1) {
                const alleSpillSortert = orderBy(alleSpill, 'startet', 'asc');

                const paGaendeSpill = alleSpillSortert[0];
                const gamleSpill = alleSpillSortert.slice(1, alleSpillSortert.length);
                setGamleSpill(gamleSpill);
                setPaGaendeSpill(paGaendeSpill);
            } else {
                setPaGaendeSpill(null);
                setGamleSpill([]);
            }
        };
        getSpillData();
    }, []);

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
                    <PagaendeSpill
                        spill={pagaendeSpill}
                        spillere={spillere}
                        onNyttSpill={(nyttSpill, gammeltSpill) => {
                            setPaGaendeSpill(nyttSpill);
                            setGamleSpill(gamleSpill.concat(gammeltSpill));
                        }}
                    />
                )}

                {gamleSpill.length > 0 && (
                    <div>
                        <h2 className="tidligereSpillHeading">{`Tidligere spill (${gamleSpill.length}):`}</h2>
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
