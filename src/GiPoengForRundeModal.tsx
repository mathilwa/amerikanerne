import React, { useState } from 'react';
import Modal from './Modal';
import { Poeng, Runde, Spillere } from './types/Types';

interface Props {
    oppdatertRundeMedPoeng: (nyRunde: Runde) => void;
    visGiPoengForRunde: boolean;
    gjeldendeRunde: Runde;
    spillere: Spillere;
    onAvbryt: () => void;
}

const GiPoengForRundeModal: React.FC<Props> = ({
    oppdatertRundeMedPoeng,
    visGiPoengForRunde,
    gjeldendeRunde,

    onAvbryt,
    spillere,
}) => {
    const [nyRundedata, setNyRundedata] = useState<Poeng | null>(null);
    const [klarteLagetDet, setKlarteLagetDet] = useState<boolean | null>(null);
    const spillerIder = Object.keys(spillere).map((key) => key);

    const oppdaterRundedata = (spillerId: string, poeng: number) => {
        setNyRundedata(nyRundedata ? { ...nyRundedata, [spillerId]: poeng } : { [spillerId]: poeng });
    };

    const leggTilRunde = () => {
        if (nyRundedata && Object.keys(nyRundedata).length === 4) {
            oppdatertRundeMedPoeng({ ...gjeldendeRunde, poeng: nyRundedata });

            setNyRundedata(null);
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

            setNyRundedata(nyRundedata ? { ...nyRundedata, ...poengForLaget } : poengForLaget);
        }

        setKlarteLagetDet(klarteDeDet);
    };

    return (
        <Modal isOpen={visGiPoengForRunde} onClose={onAvbryt}>
            <div className="nyePoeng">
                <h2 className="nyePoengTittel">Legg til poeng:</h2>
                {gjeldendeRunde.lag && (
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
                        <label className="labelNyePoeng">
                            <span className="navn">{spillere[id].navn}</span>
                            <input
                                className="inputNyePoeng"
                                type="number"
                                value={nyRundedata && nyRundedata[id] ? nyRundedata[id] : ''}
                                onChange={(event) => oppdaterRundedata(id, parseInt(event.target.value))}
                            />
                        </label>
                    ))}
                </div>

                <button className="knapp avbryt" onClick={onAvbryt}>
                    Avbryt
                </button>
                <button className="knapp" onClick={leggTilRunde}>
                    Legg til
                </button>
            </div>
        </Modal>
    );
};

export default GiPoengForRundeModal;
