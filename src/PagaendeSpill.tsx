import React, { useEffect, useState } from 'react';
import './styles.css';
import SpillTabell from './SpillTabell';
import GiPoengForRundeModal from './GiPoengForRundeModal';
import NyRundeModal from './NyRundeModal';
import { Runder, Spill, Spillere } from './types/Types';
import { getPoengForSisteRunde, getSpilletHarEnVinner, onSmallScreen } from './utils';
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

    const gjeldendeRunde = (runder: Runder) => {
        const antallRunder = Object.keys(runder).length;
        return runder[antallRunder - 1];
    };

    const pagaendeSpillHarEnVinner = getSpilletHarEnVinner(pagaendeSpill);

    return (
        <>
            <div className="pagaendeSpillContainer">
                <h2 className="spillTabellHeading">Pågående spill</h2>
                <SpillTabell spill={pagaendeSpill} spillere={spillere} pagaendeSpill={true} />

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
                pagaendeSpill={pagaendeSpill}
                onOppdaterPagaendeSpill={(oppdatertSpill) => {
                    setPagaendeSpill(oppdatertSpill);
                    setVisSettNyRundeModal(false);
                }}
                onAvbryt={() => setVisSettNyRundeModal(false)}
                spillere={spillere}
            />
            {pagaendeSpill.runder && (
                <GiPoengForRundeModal
                    onOppdaterPagaendeSpill={(oppdatertSpill) => {
                        setPagaendeSpill(oppdatertSpill);
                        setVisGiPoengModal(false);
                    }}
                    visGiPoengForRunde={visGiPoengModal}
                    pagaendeSpill={pagaendeSpill}
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