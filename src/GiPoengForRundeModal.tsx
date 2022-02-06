import React, { useState } from 'react';
import Modal from './Modal';
import { Poeng, Runde, Spill, Spillere } from './types/Types';
import { finnTotalsumForSpiller, formaterSpillForLagring, getSpillerIder } from './utils';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Spinner from './spinner/Spinner';

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

    const spillerIder = getSpillerIder(spillere);

    const oppdaterPoeng = (spillerId: string, antallPoeng: number) => {
        setPoengTilSpillere(
            poengTilSpillere ? { ...poengTilSpillere, [spillerId]: antallPoeng } : { [spillerId]: antallPoeng },
        );
        setFeilmelding('');
    };

    const leggTilPoeng = async () => {
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
                    {gjeldendeRunde && gjeldendeRunde.lag && (
                        <>
                            <h2 className="klarteLagetDet heading2">
                                {`Klarte ${spillere[gjeldendeRunde.lag[0]].navn} og ${
                                    spillere[gjeldendeRunde.lag[1]].navn
                                } det?`}{' '}
                            </h2>
                            <div className="klarteLagetDetInput">
                                <label className={`radio ${klarteLagetDet === true ? 'checked' : ''}`}>
                                    <input
                                        type="radio"
                                        onChange={() => onChangeKlarteLagetDet(true)}
                                        checked={klarteLagetDet === true}
                                    />
                                    Ja
                                </label>

                                <label className={`radio ${klarteLagetDet === false ? 'checked' : ''}`}>
                                    <input
                                        type="radio"
                                        onChange={() => onChangeKlarteLagetDet(false)}
                                        checked={klarteLagetDet === false}
                                    />
                                    Nei
                                </label>
                            </div>
                        </>
                    )}

                    <h2 className="heading2">Antall poeng:</h2>
                    <div className="nyePoengInput">
                        {spillerIder.map((id) => (
                            <label key={`poeng-input-${id}`} className="labelNyePoeng">
                                <span className="navn">{spillere[id].navn}</span>
                                <input
                                    className="inputNyePoeng"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={
                                        poengTilSpillere && (poengTilSpillere[id] || poengTilSpillere[id] === 0)
                                            ? poengTilSpillere[id]!.toString()
                                            : ''
                                    }
                                    onChange={(event) => oppdaterPoeng(id, parseInt(event.target.value))}
                                />
                            </label>
                        ))}
                    </div>

                    {feilmelding && <div className="error">{feilmelding}</div>}

                    <div className="knapperad">
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
