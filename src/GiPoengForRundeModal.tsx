import React, { useState } from 'react';
import Modal from './Modal';
import { Poeng, Runde, spillereData } from './App';

interface Props {
    oppdatertRundeMedPoeng: (nyRunde: Runde) => void;
    visGiPoengForRunde: boolean;
    gjeldendeRunde: Runde;
    spillerIder: string[];
    onAvbryt: () => void;
}

const GiPoengForRundeModal: React.FC<Props> = ({
    oppdatertRundeMedPoeng,
    visGiPoengForRunde,
    gjeldendeRunde,
    spillerIder,
    onAvbryt,
}) => {
    const [nyRundedata, setNyRundedata] = useState<Poeng | null>(null);
    const [klarteLagetDet, setKlarteLagetDet] = useState<boolean | null>(null);

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
                        <h3>
                            {`Klarte ${spillereData[gjeldendeRunde.lag[0]]} og ${
                                spillereData[gjeldendeRunde.lag[1]]
                            } det?`}{' '}
                        </h3>
                        <div>
                            <label className="klarteLagetDetRadio">
                                <input
                                    type="radio"
                                    onChange={() => onChangeKlarteLagetDet(true)}
                                    checked={klarteLagetDet === true}
                                />
                                Ja
                            </label>

                            <label className="klarteLagetDetRadio">
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

                {spillerIder.map((id) => (
                    <div key={id} className="leggTilNyePoeng">
                        <label className="labelNyePoeng">
                            {spillereData[id]}
                            <input
                                className="inputNyePoeng"
                                type="text"
                                value={nyRundedata && nyRundedata[id] ? nyRundedata[id] : ''}
                                onChange={(event) => oppdaterRundedata(id, parseInt(event.target.value))}
                            />
                        </label>
                    </div>
                ))}

                <button onClick={leggTilRunde}>Legg til</button>
            </div>
        </Modal>
    );
};

export default GiPoengForRundeModal;
