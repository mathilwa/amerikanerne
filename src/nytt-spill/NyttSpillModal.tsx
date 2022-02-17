import React, { FormEvent, useState } from 'react';
import Modal from '../Modal';
import { Runde, Spill, Spillere } from '../types/Types';
import NyRundeInput from '../NyRundeInput';
import { formaterSpillForLagring, rundedataErUtfylt } from '../utils';
import Spinner from '../spinner/Spinner';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

import VelgSpillere from './VelgSpillere';
import Knapperad from '../knapp/Knapperad';
import Feilmelding from '../feilmelding/Feilmelding';
import SeksjonHeading from '../seksjon-heading/SeksjonHeading';

interface Props {
    visNyttSpillInput: boolean;
    setNyttSpill: (nyttSpill: Spill) => void;
    onAvbryt: () => void;
    spillere: Spillere;
}

const NyttSpillModal: React.FC<Props> = ({ visNyttSpillInput, setNyttSpill, onAvbryt, spillere }) => {
    const [nyRunde, setNyRunde] = useState<Runde | null>(null);
    const [spillerRekkefolge, setSpillerRekkefolge] = useState<string[]>([]);
    const [lagrer, setLagrer] = useState<boolean>(false);
    const [feilmelding, setFeilmelding] = useState<string>('');

    const startNyttSpill = async (event: FormEvent) => {
        event.preventDefault();

        setFeilmelding('');

        if (spillerRekkefolge.length === 4 && rundedataErUtfylt(nyRunde)) {
            const nyttSpill = {
                id: null,
                runder: { 0: nyRunde! },
                vinnerIder: [],
                startet: new Date(),
                avsluttet: null,
                spillerRekkefolge: spillerRekkefolge,
            };
            try {
                setLagrer(true);
                const database = getFirestore();
                const lagretSpill = await addDoc(
                    collection(database, 'spill'),
                    formaterSpillForLagring(nyttSpill),
                );
                setNyttSpill({ ...nyttSpill, id: lagretSpill.id });
                setNyRunde(null);
                setSpillerRekkefolge([]);
            } catch (_error) {
                setFeilmelding('Noe gikk galt ved lagring av ny runde. Prøv igjen');
            } finally {
                setLagrer(false);
            }
        } else {
            if (spillerRekkefolge.length < 4) {
                setFeilmelding('Har du husket å velge fire spillere?');
            } else if (!nyRunde) {
                setFeilmelding('Er all informasjon om første runde fyllt ut riktig?');
            }
        }
    };

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            {lagrer ? (
                <Spinner />
            ) : (
                <form>
                    <h1>Nytt spill</h1>
                    <VelgSpillere
                        spillerRekkefolge={spillerRekkefolge}
                        onOppdaterSpillere={(rekkefolge) => setSpillerRekkefolge(rekkefolge)}
                        spillere={spillere}
                    />

                    <SeksjonHeading heading="Første runde:" />
                    <NyRundeInput
                        onOppdaterRunde={(runde) => {
                            setNyRunde(runde);
                            setFeilmelding('');
                        }}
                        runde={nyRunde}
                        delerIdForRunde={spillerRekkefolge.length > 0 ? spillerRekkefolge[0] : ''}
                        spillere={spillere}
                    />

                    {!!feilmelding && <Feilmelding feilmelding={feilmelding} />}
                    <Knapperad>
                        <button
                            type="submit"
                            className="knapp sekundaerKnapp"
                            onClick={() => {
                                setFeilmelding('');
                                setNyRunde(null);
                                setSpillerRekkefolge([]);
                                onAvbryt();
                            }}
                        >
                            Avbryt
                        </button>
                        <button type="submit" className="knapp" onClick={startNyttSpill}>
                            Start spill
                        </button>
                    </Knapperad>
                </form>
            )}
        </Modal>
    );
};

export default NyttSpillModal;
