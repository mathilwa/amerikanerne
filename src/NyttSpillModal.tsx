import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import { Runde, Spill, Spillere } from './types/Types';
import NyRundeInput from './NyRundeInput';
import { formaterSpillForLagring, getSpillerIder, rundedataErUtfylt } from './utils';
import Spinner from './spinner/Spinner';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

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
    const [spillerRekkefolgeFeilmelding, setSpillerRekkefolgeFeilmelding] = useState<string>('');

    const spillerIder = getSpillerIder(spillere);

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

    const updateSpillerRekkefolge = (spillerId: string) => {
        setSpillerRekkefolgeFeilmelding('');
        if (spillerRekkefolge.includes(spillerId)) {
            const spillerRekkefolgeUtenSpillerId = spillerRekkefolge.filter((id) => id !== spillerId);
            setSpillerRekkefolge(spillerRekkefolgeUtenSpillerId);
        } else if (spillerRekkefolge.length === 4) {
            setSpillerRekkefolgeFeilmelding('Du kan ikke velge flere enn 4 spillere');
        } else {
            setSpillerRekkefolge(spillerRekkefolge.concat(spillerId));
        }
    };

    return (
        <Modal onClose={onAvbryt} isOpen={visNyttSpillInput}>
            {lagrer ? (
                <Spinner />
            ) : (
                <form>
                    <h1>Nytt spill</h1>
                    <h2 className="heading2">Spillere:</h2>
                    <p className="velgSpillerBeskrivelse">
                        Velg deg selv først og så spillerne i rekkefølge til venstre for deg
                    </p>
                    <div className="spillere">
                        {spillerIder.map((id) => {
                            const rekkefolgeIndex = spillerRekkefolge.findIndex(
                                (rekkefolgeId) => rekkefolgeId === id,
                            );
                            const spillerErValgt = spillerRekkefolge.includes(id);

                            return (
                                <div
                                    key={`spillere ${id}`}
                                    className={`spiller rekkefolge ${spillerErValgt ? 'valgt' : ''}`}
                                    onClick={() => updateSpillerRekkefolge(id)}
                                >
                                    {rekkefolgeIndex !== -1 && spillerErValgt && (
                                        <div className="rekkefolgeNummer">{rekkefolgeIndex + 1}</div>
                                    )}
                                    <div>{spillere[id].navn}</div>
                                </div>
                            );
                        })}
                    </div>
                    {!!spillerRekkefolgeFeilmelding && <div className="error">{spillerRekkefolgeFeilmelding}</div>}

                    <h2>Første runde:</h2>
                    <NyRundeInput
                        onOppdaterRunde={(runde) => {
                            setNyRunde(runde);
                            setFeilmelding('');
                        }}
                        runde={nyRunde}
                        delerIdForRunde={spillerRekkefolge.length > 0 ? spillerRekkefolge[0] : ''}
                        spillere={spillere}
                    />

                    {!!feilmelding && <div className="error">{feilmelding}</div>}
                    <div className="knappContainer">
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
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default NyttSpillModal;
