import React, { FormEvent } from 'react';
import Modal from './Modal';
import { Spill, Spillere } from './types/Types';

interface Props {
    visNyttSpillInput: boolean;
    setNyttSpill: (nyttSpill: Spill) => void;
    onAvbryt: () => void;
    spillere: Spillere;
}

const NyttSpillModal: React.FC<Props> = ({ visNyttSpillInput, setNyttSpill, onAvbryt, spillere }) => {
    const spillerIder = Object.keys(spillere).map((key) => key);
    const startNyttSpill = (event: FormEvent) => {
        event.preventDefault();

        if (spillerIder.length === 4) {
            setNyttSpill({
                runder: null,
                vinnerId: null,
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
