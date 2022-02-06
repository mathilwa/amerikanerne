import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import './App.css';
import logo from './icons/cards.png';
import SpillTabell from './SpillTabell';
import { Runder, Spill, Spillere } from './types/Types';
import orderBy from 'lodash.orderby';
import PagaendeSpill from './PagaendeSpill';
import StatistikkModal from './StatistikkModal';
import { formaterSpillForLagring, getSpilletHarEnVinner, onSmallScreen } from './utils';
import NyttSpillModal from './NyttSpillModal';

const App: React.FC = () => {
    const [spillere, setSpillere] = useState<Spillere | null>(null);
    const [tidligereSpill, setTidligereSpill] = useState<Spill[]>([]);
    const [pagaendeSpill, setPagaendeSpill] = useState<Spill | null>(null);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visStatistikkModal, setVisStatistikkModal] = useState<boolean>(false);

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
                const spill = alleSpill[0];
                if (getSpilletHarEnVinner(spill)) {
                    setTidligereSpill([spill]);
                } else {
                    setPagaendeSpill(spill);
                }
            } else if (alleSpill.length > 1) {
                const alleSpillSortert = orderBy(alleSpill, 'startet', 'desc');

                const pagaendeSpill = alleSpillSortert[0];

                const tidligereSpill = alleSpillSortert.slice(1, alleSpillSortert.length);
                setTidligereSpill(tidligereSpill);
                setPagaendeSpill(pagaendeSpill);
            } else {
                setPagaendeSpill(null);
                setTidligereSpill([]);
            }
        };
        getSpillData();
    }, []);

    const startNyttSpill = async (nyttSpill: Spill) => {
        const database = getFirestore();
        const lagretSpill = await addDoc(collection(database, 'spill'), formaterSpillForLagring(nyttSpill));

        if (pagaendeSpill) {
            setTidligereSpill([pagaendeSpill].concat(tidligereSpill));
        }
        setPagaendeSpill({ ...nyttSpill, id: lagretSpill.id });

        setVisNyttSpillModal(false);
    };

    if (!spillere) {
        return null;
    }

    const pagaendeSpillHarEnVinner = pagaendeSpill && getSpilletHarEnVinner(pagaendeSpill);

    return (
        <div className="App">
            <header className="appHeader">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <div className="sideContainer">
                <h1>Amerikanerne</h1>

                <div className="startSpillKnappContainer knappContainer">
                    <button
                        className={`knapp nyttSpill ${pagaendeSpillHarEnVinner ? '' : 'sekundaerKnapp'}`}
                        onClick={() => setVisNyttSpillModal(true)}
                    >
                        <span>{`${onSmallScreen ? '+ Spill' : '+ Nytt spill'}`}</span>
                    </button>
                    {pagaendeSpillHarEnVinner && (
                        <button className="knapp" onClick={() => setVisStatistikkModal(true)}>
                            <span>Se statistikk</span>
                        </button>
                    )}
                </div>

                <NyttSpillModal
                    visNyttSpillInput={visNyttSpillModal}
                    setNyttSpill={startNyttSpill}
                    onAvbryt={() => setVisNyttSpillModal(false)}
                    spillere={spillere}
                />

                {pagaendeSpill && <PagaendeSpill spill={pagaendeSpill} spillere={spillere} />}

                {tidligereSpill.length > 0 && (
                    <div>
                        <div className="tidligereSpillHeader">
                            <h2 className="spillTabellHeading">{`Tidligere spill (${tidligereSpill.length}):`}</h2>
                            <button className="knapp" onClick={() => setVisStatistikkModal(true)}>
                                <span>Se statistikk for alle spill</span>
                            </button>
                        </div>

                        {tidligereSpill.map((gammeltSpill) => (
                            <SpillTabell
                                key={`gammeltSpill-${gammeltSpill.id}`}
                                spill={gammeltSpill}
                                spillere={spillere}
                            />
                        ))}

                        <StatistikkModal
                            alleSpill={pagaendeSpill ? [pagaendeSpill, ...tidligereSpill] : tidligereSpill}
                            spillere={spillere}
                            onLukkModal={() => setVisStatistikkModal(false)}
                            visModal={visStatistikkModal}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
