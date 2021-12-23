import React, { useState } from 'react';
import './App.css';
import SpillTabell from './SpillTabell';
import NyttSpillModal from './NyttSpillModal';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Poeng, Runde, Runder, Spill, Spillere } from './types/Types';
import {
    finnTotalsumForSpiller,
    formaterSpillForLagring,
    getPoengForSisteRunde,
    getSpillerIder,
    getSpilletHarEnVinner,
} from './utils';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import StatistikkModal from './StatistikkModal';

interface Props {
    spill: Spill;
    spillere: Spillere;
    onNyttSpill: (nyttSpill: Spill, gammeltSpill: Spill) => void;
}
const PagaendeSpill: React.FC<Props> = ({ spill, spillere, onNyttSpill }) => {
    const [pagaendeSpill, setPagaendeSpill] = useState<Spill>(spill);
    const [visNyttSpillModal, setVisNyttSpillModal] = useState<boolean>(false);
    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);
    const [visStatistikkModal, setVisStatistikkModal] = useState<boolean>(false);

    const startNyttSpill = async (nyttSpill: Spill) => {
        const database = getFirestore();
        const lagretSpill = await addDoc(collection(database, 'spill'), formaterSpillForLagring(nyttSpill));

        onNyttSpill({ ...nyttSpill, id: lagretSpill.id }, pagaendeSpill);
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
            setPagaendeSpill({ ...pagaendeSpill, runder: { ...pagaendeSpill.runder, [indexForNyRunde]: runde } });
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

            setPagaendeSpill({ ...pagaendeSpill, runder: oppdatertRundeData, vinnerIder: spillVinnere ?? [] });
            setVisGiPoengModal(false);
        }
    };

    const pagaendeSpillHarEnVinner = getSpilletHarEnVinner(pagaendeSpill, getSpillerIder(spillere));
    const onSmallScreen = window.screen.width < 500;
    return (
        <>
            <div className="pagaendeSpillContainer">
                <SpillTabell spill={pagaendeSpill} spillere={spillere} />

                <div className="knappContainer">
                    <div>
                        <button
                            className={`knapp nyttSpill${pagaendeSpillHarEnVinner ? '' : 'sekundaerKnapp'}`}
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
                    {!pagaendeSpillHarEnVinner && (
                        <div>
                            <button
                                className={`knapp nyRunde ${
                                    !getPoengForSisteRunde(pagaendeSpill) ? 'sekundaerKnapp' : ''
                                }`}
                                onClick={() => setVisSettNyRundeModal(true)}
                            >
                                <span>{`${onSmallScreen ? '+ Runde' : '+ Legg til runde'}`}</span>
                            </button>
                            <button
                                className={`knapp ${getPoengForSisteRunde(pagaendeSpill) ? 'sekundaerKnapp' : ''}`}
                                onClick={() => setVisGiPoengModal(true)}
                            >
                                <span>{`${onSmallScreen ? '+ Poeng' : '+ Legg til poeng'}`}</span>
                            </button>
                        </div>
                    )}
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
            {pagaendeSpill.runder && (
                <GiPoengForRundeModal
                    onOppdaterPoeng={(oppdatertePoeng) => onLagrePoeng(oppdatertePoeng)}
                    visGiPoengForRunde={visGiPoengModal}
                    gjeldendeRunde={gjeldendeRunde(pagaendeSpill.runder)}
                    onAvbryt={() => setVisGiPoengModal(false)}
                    spillere={spillere}
                />
            )}

            <StatistikkModal
                alleSpill={[pagaendeSpill]}
                spillere={spillere}
                onLukkModal={() => setVisStatistikkModal(false)}
                visModal={visStatistikkModal}
            />
        </>
    );
};

export default PagaendeSpill;
