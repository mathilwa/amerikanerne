import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Spill, spillereData } from './App';

interface Props {
    visNyttSpillInput: boolean;
    setNyttSpill: (nyttSpill: Spill) => void;
    onAvbryt: () => void;
}

const NyttSpillModal: React.FC<Props> = ({ visNyttSpillInput, setNyttSpill, onAvbryt }) => {
    const [spillerIder] = useState<string[]>(['1', '2', '3', '4']);

    const startNyttSpill = (event: FormEvent) => {
        event.preventDefault();

        if (spillerIder.length === 4) {
            setNyttSpill({
                spillerIder: spillerIder,

                runder: null,
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
                        <div key={'spillere' + id}>{spillereData[id].navn}</div>
                    ))}
                </div>

                <button type="submit" className="knapp" onClick={startNyttSpill}>
                    Start spill
                </button>
                <button type="submit" className="knapp avbryt" onClick={onAvbryt}>
                    Avbryt
                </button>
            </form>
        </Modal>
    );
};

export default NyttSpillModal;
