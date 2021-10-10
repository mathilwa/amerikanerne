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

    const oppdaterRundedata = (spillerId: string, poeng: number) => {
        if (nyRundedata) {
            setNyRundedata({ ...nyRundedata, [spillerId]: poeng });
        } else {
            setNyRundedata({ [spillerId]: poeng });
        }
    };
    const leggTilRunde = () => {
        if (nyRundedata && Object.keys(nyRundedata).length === 4) {
            oppdatertRundeMedPoeng({ ...gjeldendeRunde, poeng: nyRundedata });

            setNyRundedata(null);
        }
    };

    return (
        <Modal isOpen={visGiPoengForRunde} onClose={onAvbryt}>
            <div className="nyePoeng">
                <p className="nyePoengTittel">Legg til poeng:</p>
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
