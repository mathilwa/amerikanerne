import React, { FormEvent, useState } from 'react';
import './gi-poeng.css';
import Modal from '../modal/Modal';
import { Poeng, Runde, Spill, Spillere } from '../types/Types';
import { finnTotalsumForSpiller, formaterSpillForLagring, getSpillerIder } from '../utils';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Spinner from '../spinner/Spinner';
import Feilmelding from '../feilmelding/Feilmelding';
import KlarteLagetDet from './KlarteLagetDet';
import GiPoeng from './GiPoeng';
import SeksjonHeading from '../seksjon-heading/SeksjonHeading';

interface Props {
    onOppdaterPagaendeSpill: (oppdatertSpill: Spill) => void;
    visGiPoengForRunde: boolean;
    pagaendeSpill: Spill;
    gjeldendeRunde: Runde;
    spillere: Spillere;
    onAvbryt: () => void;
}

const GiPoengForRundeModal: React.FC<Props> = ({
    onOppdaterPagaendeSpill,
    visGiPoengForRunde,
    pagaendeSpill,
    gjeldendeRunde,
    onAvbryt,
    spillere,
}) => {
    const [poengTilSpillere, setPoengTilSpillere] = useState<Poeng | null>(null);
    const [klarteLagetDet, setKlarteLagetDet] = useState<boolean | null>(null);
    const [lagrer, setLagrer] = useState<boolean>(false);
    const [feilmelding, setFeilmelding] = useState<string>('');

    const oppdaterPoeng = (poeng: Poeng) => {
        setPoengTilSpillere(poeng);
        setFeilmelding('');
    };

    const leggTilPoeng = async (event: FormEvent) => {
        event.preventDefault();

        if (poengTilSpillere && Object.keys(poengTilSpillere).length === 4) {
            if (pagaendeSpill && pagaendeSpill.id && pagaendeSpill.runder) {
                const database = getFirestore();

                const gjeldendeRundeIndex = Object.keys(pagaendeSpill.runder).length - 1;
                const gjeldendeRunde = pagaendeSpill.runder[gjeldendeRundeIndex];
                const oppdatertRundeData = {
                    ...pagaendeSpill.runder,
                    [gjeldendeRundeIndex]: { ...gjeldendeRunde, poeng: poengTilSpillere },
                };

                const spillVinnere = spillere
                    ? getSpillerIder(spillere).filter(
                          (spillerId) => finnTotalsumForSpiller(oppdatertRundeData, spillerId) >= 52,
                      )
                    : null;

                try {
                    setLagrer(true);
                    await setDoc(doc(database, 'spill', pagaendeSpill.id), {
                        ...formaterSpillForLagring(pagaendeSpill),
                        runder: oppdatertRundeData,
                        vinnerIder: spillVinnere,
                    });

                    onOppdaterPagaendeSpill({
                        ...pagaendeSpill,
                        runder: oppdatertRundeData,
                        vinnerIder: spillVinnere ?? [],
                    });

                    setPoengTilSpillere(null);
                    setFeilmelding('');
                    setKlarteLagetDet(null);
                } catch (_error) {
                    setFeilmelding('Noe gikk galt ved lagring av poeng. Prøv igjen');
                } finally {
                    setLagrer(false);
                }
            }
        } else {
            setFeilmelding('Noen spillere mangler poeng');
        }
    };

    const onChangeKlarteLagetDet = (klarteDeDet: boolean) => {
        const melding = gjeldendeRunde.melding;
        const lag = gjeldendeRunde.lag;

        if (melding && lag) {
            const antallPoeng = klarteDeDet ? melding.antallStikk! : -melding.antallStikk!;
            const poengForLaget = {
                [lag[0]]: antallPoeng,
                [lag[1]]: antallPoeng,
            };

            setPoengTilSpillere(poengTilSpillere ? { ...poengTilSpillere, ...poengForLaget } : poengForLaget);
        }

        setKlarteLagetDet(klarteDeDet);
    };

    const avbryt = () => {
        setPoengTilSpillere(null);
        setKlarteLagetDet(null);
        setFeilmelding('');

        onAvbryt();
    };

    return (
        <Modal isOpen={visGiPoengForRunde} onClose={onAvbryt}>
            {lagrer ? (
                <Spinner />
            ) : (
                <div>
                    <h1 className="nyePoengTittel">Gi poeng for runde</h1>
                    <KlarteLagetDet
                        klarteLagetDet={klarteLagetDet}
                        onOppdaterKlarteLagetDet={(klarteDet) => onChangeKlarteLagetDet(klarteDet)}
                        gjeldendeRunde={gjeldendeRunde}
                        spillere={spillere}
                    />

                    <SeksjonHeading heading="Antall poeng:" />
                    <GiPoeng
                        onOppdaterPoeng={(oppdatertePoeng) => oppdaterPoeng(oppdatertePoeng)}
                        poengTilSpillere={poengTilSpillere}
                        spillere={spillere}
                    />

                    {feilmelding && <Feilmelding feilmelding="feilmelding" />}

                    <div className="knappContainer">
                        <button className="knapp sekundaerKnapp" onClick={avbryt}>
                            Avbryt
                        </button>
                        <button className="knapp" onClick={leggTilPoeng}>
                            Legg til
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default GiPoengForRundeModal;
