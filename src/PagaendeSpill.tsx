import React, { useEffect, useState } from 'react';
import './App.css';
import SpillTabell from './SpillTabell';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Poeng, Runde, Runder, Spill, Spillere } from './types/Types';
import {
    finnTotalsumForSpiller,
    formaterSpillForLagring,
    getPoengForSisteRunde,
    getSpillerIder,
    getSpilletHarEnVinner,
    onSmallScreen,
} from './utils';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import StatistikkModal from './StatistikkModal';

interface Props {
    spill: Spill;
    spillere: Spillere;
}
const PagaendeSpill: React.FC<Props> = ({ spill, spillere }) => {
    const [pagaendeSpill, setPagaendeSpill] = useState<Spill>(spill);

    useEffect(() => {
        setPagaendeSpill(spill);
    }, [spill]);

    const [visSettNyRundeModal, setVisSettNyRundeModal] = useState<boolean>(false);
    const [visGiPoengModal, setVisGiPoengModal] = useState<boolean>(false);
    const [visStatistikkModal, setVisStatistikkModal] = useState<boolean>(false);

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

    const pagaendeSpillHarEnVinner = getSpilletHarEnVinner(pagaendeSpill);
    return (
        <>
            <div className="pagaendeSpillContainer">
                <h2 className="spillTabellHeading">Pågående spill</h2>
                <SpillTabell spill={pagaendeSpill} spillere={spillere} />

                <div className="knappContainer">
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
