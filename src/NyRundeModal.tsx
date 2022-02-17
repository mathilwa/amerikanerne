import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Runde, Spill, Spillere } from './types/Types';
import NyRundeInput from './NyRundeInput';
import { formaterSpillForLagring, getSpillerIdSomDelerForRunde, rundedataErUtfylt } from './utils';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Spinner from './spinner/Spinner';

interface Props {
    visNyttSpillInput: boolean;
    pagaendeSpill: Spill;
    onOppdaterPagaendeSpill: (oppdatertSpill: Spill) => void;
    onAvbryt: () => void;
    spillere: Spillere;
}

const NyRundeModal: React.FC<Props> = ({
    visNyttSpillInput,
    pagaendeSpill,
    onOppdaterPagaendeSpill,
    onAvbryt,
    spillere,
}) => {
    const [nyRunde, setNyRunde] = useState<Runde | null>(null);
    const [lagring, setLagring] = useState<boolean>(false);
    const [feilmelding, setFeilmelding] = useState<string>('');

    const onStartNyRunde = async (event: FormEvent) => {
        event.preventDefault();

        if (rundedataErUtfylt(nyRunde)) {
            if (pagaendeSpill.id) {
                const indexForNyRunde = pagaendeSpill.runder ? Object.keys(pagaendeSpill.runder).length : 0;

                const runde = {
                    melding: nyRunde!.melding,
                    lag: nyRunde!.lag,
                    melder: nyRunde!.melder,
                    poeng: null,
                };
                const database = getFirestore();
                try {
                    setLagring(true);
                    await setDoc(doc(database, 'spill', pagaendeSpill.id), {
                        ...formaterSpillForLagring(pagaendeSpill),
                        runder: { ...pagaendeSpill.runder, [indexForNyRunde]: runde },
                    });

                    onOppdaterPagaendeSpill({
                        ...pagaendeSpill,
                        runder: { ...pagaendeSpill.runder, [indexForNyRunde]: runde },
                    });
                } catch (_error) {
                    setFeilmelding('Noe gikk galt ved lagring av runde. Prøv igjen');
                } finally {
                    setLagring(false);
                }
            }
        } else {
            setFeilmelding('Noen felter mangler, sjekk at du har fyllt ut alt');
        }

        setNyRunde(null);
    };

    const delerIdForRunde = getSpillerIdSomDelerForRunde(
        pagaendeSpill,
        pagaendeSpill.runder ? Object.keys(pagaendeSpill.runder).length : 0,
    );

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            {lagring ? (
                <Spinner />
            ) : (
                <form>
                    <h1>Ny runde</h1>

                    <NyRundeInput
                        runde={nyRunde}
                        onOppdaterRunde={(oppdatertRunde) => {
                            setNyRunde(oppdatertRunde);
                            setFeilmelding('');
                        }}
                        delerIdForRunde={delerIdForRunde}
                        spillere={spillere}
                    />

                    {!!feilmelding && <div className="error">{feilmelding}</div>}

                    <div className="knappContainer">
                        <button
                            type="submit"
                            className="knapp sekundaerKnapp"
                            onClick={() => {
                                setNyRunde(null);
                                setFeilmelding('');
                                onAvbryt();
                            }}
                        >
                            Avbryt
                        </button>
                        <button type="submit" className="knapp" onClick={onStartNyRunde}>
                            Legg til
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default NyRundeModal;
