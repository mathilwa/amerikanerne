import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Runde, Spill, Spillere } from './types/Types';
import NyRundeInput from './NyRundeInput';

interface Props {
    visNyttSpillInput: boolean;
    setNyttSpill: (nyttSpill: Spill) => void;
    onAvbryt: () => void;
    spillere: Spillere;
}

const NyttSpillModal: React.FC<Props> = ({ visNyttSpillInput, setNyttSpill, onAvbryt, spillere }) => {
    const [nyRunde, setNyRunde] = useState<Runde | null>(null);
    const spillerIder = Object.keys(spillere).map((key) => key);
    const startNyttSpill = (event: FormEvent) => {
        event.preventDefault();

        if (spillerIder.length === 4 && nyRunde) {
            setNyttSpill({
                id: null,
                runder: { 0: nyRunde },
                vinnerId: null,
                startet: new Date(),
                avsluttet: null,
            });
        }
    };

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            <form>
                <h1>Nytt spill</h1>
                <h2>Spillere:</h2>
                <div className="spillere">
                    {spillerIder.map((id) => (
                        <div key={'spillere' + id}>{spillere[id].navn}</div>
                    ))}
                </div>

                <h2>Første runde:</h2>
                <NyRundeInput onOppdaterRunde={setNyRunde} runde={nyRunde} spillere={spillere} />

                <button type="submit" className="knapp sekundaerKnapp" onClick={onAvbryt}>
                    Avbryt
                </button>
                <button type="submit" className="knapp" onClick={startNyttSpill}>
                    Start spill
                </button>
            </form>
        </Modal>
    );
};

export default NyttSpillModal;
