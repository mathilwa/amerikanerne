import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Melding, Slag, slagIkoner, Spill, spillereData } from './App';

interface Props {
    visNyttSpillInput: boolean;
    setNyttSpill: (nyttSpill: Spill) => void;
    onAvbryt: () => void;
}

const NyttSpillModal: React.FC<Props> = ({ visNyttSpillInput, setNyttSpill, onAvbryt }) => {
    const [nyMelding, setNyMelding] = useState<Melding>({ antallStikk: null, slag: null });
    const [nyttLag, setNyttLag] = useState<string[]>([]);
    const [nyMelder, setNyMelder] = useState<string>('');
    const [spillerIder] = useState<string[]>(['1', '2', '3', '4']);

    const oppdaterNyttLag = (spillerId: string) => {
        if (nyttLag.includes(spillerId) && spillerId !== nyMelder) {
            setNyttLag([nyMelder]);
        } else if (nyttLag.length < 2 && spillerId !== nyMelder) {
            setNyttLag(nyttLag.concat(spillerId));
        } else if (nyttLag.length === 2 && spillerId !== nyMelder) {
            setNyttLag([nyMelder, spillerId]);
        }
    };

    const startNyRunde = (event: FormEvent) => {
        event.preventDefault();

        if (
            nyMelding.antallStikk &&
            nyMelding.slag &&
            spillerIder.length === 4 &&
            nyttLag.length === 2 &&
            !!nyMelder
        ) {
            setNyttSpill({
                spillerIder: spillerIder,
                melding: nyMelding,
                lag: nyttLag,
                melder: nyMelder,
                runder: null,
            });
            setNyMelding({ antallStikk: null, slag: null });
            setNyMelder('');
            setNyttLag([]);
        }
    };

    return (
        <Modal onClose={() => console.log('lukk')} isOpen={visNyttSpillInput}>
            <form>
                <h1>Nytt spill</h1>
                <h2>Spillere:</h2>
                <div className="spillere">
                    {spillerIder.map((id) => (
                        <div key={'spillere' + id}>{spillereData[id]}</div>
                    ))}
                </div>
                <h2>Hva meldes?</h2>
                <div className="hvaMeldes">
                    <div className="melding">
                        <div className="slag">
                            {Object.values(Slag).map((typeSlag) => (
                                <label>
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
                            {spillereData[melder]}
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
                            {spillereData[id]}
                        </div>
                    ))}
                </div>
                <button type="submit" className="knapp" onClick={startNyRunde}>
                    Start runde
                </button>
                <button type="submit" className="knapp avbryt" onClick={onAvbryt}>
                    Avbryt
                </button>
            </form>
        </Modal>
    );
};

export default NyttSpillModal;
