import React, { useState } from 'react';
import Modal from './Modal';
import { Poeng, Runder, spillereData } from './App';

interface Props {
    setNyRunde: (nyRunde: Runder) => void;
    visSettNyRunde: boolean;
    eksisterendeRunder: Runder | null;
    spillerIder: string[];
}

const NyRundeModal: React.FC<Props> = ({ setNyRunde, visSettNyRunde, eksisterendeRunder, spillerIder }) => {
    const [nyRundedata, setNyRundedata] = useState<Poeng | null>(null);

    const oppdaterRundedata = (spillerId: string, poeng: number) => {
        if (nyRundedata) {
            setNyRundedata({ ...nyRundedata, [spillerId]: poeng });
        } else {
            setNyRundedata({ [spillerId]: poeng });
        }
    };
    const leggTilRunde = () => {
        const antallRunderTilNa = eksisterendeRunder ? Object.keys(eksisterendeRunder).length : 0;

        if (nyRundedata) {
            setNyRunde({ [antallRunderTilNa + 1]: nyRundedata });

            setNyRundedata(null);
        }
    };

    return (
        <Modal isOpen={visSettNyRunde} onClose={() => console.log('lukk')}>
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

export default NyRundeModal;
