import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Melding, Runde, Slag, slagIkoner, spillereData } from './App';

interface Props {
    visNyttSpillInput: boolean;
    startNyRunde: (nyRunde: Runde) => void;
    spillerIder: string[];
    onAvbryt: () => void;
}

const NyRundeModal: React.FC<Props> = ({ visNyttSpillInput, startNyRunde, spillerIder, onAvbryt }) => {
    const [nyMelding, setNyMelding] = useState<Melding>({ antallStikk: null, slag: null });
    const [nyttLag, setNyttLag] = useState<string[]>([]);
    const [nyMelder, setNyMelder] = useState<string>('');

    const oppdaterNyttLag = (spillerId: string) => {
        if (nyttLag.includes(spillerId) && spillerId !== nyMelder) {
            setNyttLag([nyMelder]);
        } else if (nyttLag.length < 2 && spillerId !== nyMelder) {
            setNyttLag(nyttLag.concat(spillerId));
        } else if (nyttLag.length === 2 && spillerId !== nyMelder) {
            setNyttLag([nyMelder, spillerId]);
        }
    };

    const onStartNyRunde = (event: FormEvent) => {
        event.preventDefault();

        if (nyMelding.antallStikk && nyMelding.slag && nyttLag.length === 2 && !!nyMelder) {
            startNyRunde({
                melding: nyMelding,
                lag: nyttLag,
                melder: nyMelder,
                poeng: null,
            });
            setNyMelding({ antallStikk: null, slag: null });
            setNyMelder('');
            setNyttLag([]);
        }
    };

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            <form>
                <h1>Ny runde</h1>

                <h2>Hva meldes?</h2>
                <div className="hvaMeldes">
                    <div className="melding">
                        <div className="slag">
                            {Object.values(Slag).map((typeSlag) => (
                                <label key={typeSlag}>
                                    <input
                                        type="radio"
                                        id={typeSlag}
                                        onChange={() => setNyMelding({ ...nyMelding, slag: typeSlag })}
                                        checked={nyMelding.slag === typeSlag}
                                    />
                                    <img
                                        src={
                                            nyMelding.slag === typeSlag
                                                ? slagIkoner[typeSlag].valgt
                                                : slagIkoner[typeSlag].vanlig
                                        }
                                        className="slagIkon"
                                        alt=""
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="leggTilNyePoeng">
                            <label className="labelNyePoeng">
                                <input
                                    className="inputNyePoeng"
                                    type="number"
                                    value={nyMelding.antallStikk ? nyMelding.antallStikk : ''}
                                    onChange={(event) =>
                                        setNyMelding({
                                            ...nyMelding,
                                            antallStikk: parseInt(event.target.value),
                                        })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <h2>Hvem melder?</h2>
                <div className="hvemMelder">
                    {spillerIder.map((melder) => (
                        <label key={melder} className={`melder ${melder === nyMelder ? 'valgt' : ''}`}>
                            <input
                                type="radio"
                                id={melder}
                                onChange={() => {
                                    setNyMelder(melder);
                                    setNyttLag([melder]);
                                }}
                                checked={nyMelder === melder}
                            />
                            {spillereData[melder].navn}
                        </label>
                    ))}
                </div>

                <h2>Hvem kommer på lag?</h2>
                <div className="hvemKommerPaLag">
                    {spillerIder.map((id) => (
                        <div
                            key={id}
                            className={`velgLag ${nyttLag.includes(id) ? 'paLag' : ''} `}
                            onClick={() => oppdaterNyttLag(id)}
                        >
                            {spillereData[id].navn}
                        </div>
                    ))}
                </div>
                <button type="submit" className="knapp" onClick={onStartNyRunde}>
                    Start runde
                </button>
                <button type="submit" className="knapp avbryt" onClick={onAvbryt}>
                    Avbryt
                </button>
            </form>
        </Modal>
    );
};

export default NyRundeModal;
