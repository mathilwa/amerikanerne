import React, { useState } from 'react';
import Modal from './Modal';
import { Poeng, Runde, Spillere } from './types/Types';
import { getSpillerIder } from './utils';

interface Props {
    onOppdaterPoeng: (poeng: Poeng) => void;
    visGiPoengForRunde: boolean;
    gjeldendeRunde: Runde;
    spillere: Spillere;
    onAvbryt: () => void;
}

const GiPoengForRundeModal: React.FC<Props> = ({
    onOppdaterPoeng,
    visGiPoengForRunde,
    gjeldendeRunde,
    onAvbryt,
    spillere,
}) => {
    const [poengTilSpillere, setPoengTilSpillere] = useState<Poeng | null>(null);
    const [klarteLagetDet, setKlarteLagetDet] = useState<boolean | null>(null);
    const [poengManglerError, setPoengManglerError] = useState<string>('');

    const spillerIder = getSpillerIder(spillere);

    const oppdaterPoeng = (spillerId: string, antallPoeng: number) => {
        setPoengTilSpillere(
            poengTilSpillere ? { ...poengTilSpillere, [spillerId]: antallPoeng } : { [spillerId]: antallPoeng },
        );
        setPoengManglerError('');
    };

    const leggTilPoeng = () => {
        if (poengTilSpillere && Object.keys(poengTilSpillere).length === 4) {
            onOppdaterPoeng(poengTilSpillere);

            setPoengTilSpillere(null);
            setPoengManglerError('');
            setKlarteLagetDet(null);
        } else {
            setPoengManglerError('Noen spillere mangler poeng');
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
        setPoengManglerError('');

        onAvbryt();
    };

    return (
        <Modal isOpen={visGiPoengForRunde} onClose={onAvbryt}>
            <div className="nyePoeng">
                <h2 className="nyePoengTittel">Legg til poeng:</h2>
                {gjeldendeRunde && gjeldendeRunde.lag && (
                    <>
                        <h3 className="klarteLagetDet">
                            {`Klarte ${spillere[gjeldendeRunde.lag[0]].navn} og ${
                                spillere[gjeldendeRunde.lag[1]].navn
                            } det?`}{' '}
                        </h3>
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

                {poengManglerError && <div className="error">{poengManglerError}</div>}

                <button className="knapp sekundaerKnapp" onClick={avbryt}>
                    Avbryt
                </button>
                <button className="knapp" onClick={leggTilPoeng}>
                    Legg til
                </button>
            </div>
        </Modal>
    );
};

export default GiPoengForRundeModal;
