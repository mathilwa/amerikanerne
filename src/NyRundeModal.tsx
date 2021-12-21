import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Runde, Spillere } from './types/Types';
import NyRundeInput from './NyRundeInput';

interface Props {
    visNyttSpillInput: boolean;
    startNyRunde: (nyRunde: Runde) => void;
    onAvbryt: () => void;
    spillere: Spillere;
}

const NyRundeModal: React.FC<Props> = ({ visNyttSpillInput, startNyRunde, onAvbryt, spillere }) => {
    const [nyRunde, setNyRunde] = useState<Runde | null>(null);

    const onStartNyRunde = (event: FormEvent) => {
        event.preventDefault();

        if (
            nyRunde &&
            nyRunde.melding.antallStikk &&
            nyRunde.melding.slag &&
            nyRunde.lag.length === 2 &&
            !!nyRunde.melder
        ) {
            startNyRunde({
                melding: nyRunde.melding,
                lag: nyRunde.lag,
                melder: nyRunde.melder,
                poeng: null,
            });
        }
    };

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            <form>
                <h1>Ny runde</h1>

                <NyRundeInput runde={nyRunde} onOppdaterRunde={setNyRunde} spillere={spillere} />
                <button
                    type="submit"
                    className="knapp sekundaerKnapp"
                    onClick={() => {
                        setNyRunde(null);

                        onAvbryt();
                    }}
                >
                    Avbryt
                </button>
                <button type="submit" className="knapp" onClick={onStartNyRunde}>
                    Legg til
                </button>
            </form>
        </Modal>
    );
};

export default NyRundeModal;
