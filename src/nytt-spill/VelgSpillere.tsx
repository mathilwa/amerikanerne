import React, { useState } from 'react';

import { Spillere } from '../types/Types';
import { getSpillerIder } from '../utils';
import SpillereContainer from '../spillere/SpillereContainer';
import Spiller from '../spillere/Spiller';
import Feilmelding from '../feilmelding/Feilmelding';
import SeksjonHeading from '../seksjon-heading/SeksjonHeading';

interface Props {
    spillerRekkefolge: string[];
    onOppdaterSpillere: (spillerRekkefolge: string[]) => void;
    spillere: Spillere;
}

const VelgSpillere: React.FC<Props> = ({ spillerRekkefolge, onOppdaterSpillere, spillere }) => {
    const [spillerRekkefolgeFeilmelding, setSpillerRekkefolgeFeilmelding] = useState<string>('');

    const spillerIder = getSpillerIder(spillere);

    const updateSpillerRekkefolge = (spillerId: string) => {
        setSpillerRekkefolgeFeilmelding('');
        if (spillerRekkefolge.includes(spillerId)) {
            const spillerRekkefolgeUtenSpillerId = spillerRekkefolge.filter((id) => id !== spillerId);
            onOppdaterSpillere(spillerRekkefolgeUtenSpillerId);
        } else if (spillerRekkefolge.length === 4) {
            setSpillerRekkefolgeFeilmelding('Du kan ikke velge flere enn 4 spillere');
        } else {
            onOppdaterSpillere(spillerRekkefolge.concat(spillerId));
        }
    };

    return (
        <>
            <SeksjonHeading heading="Spillere:" />
            <p className="velgSpillerBeskrivelse">
                Velg deg selv først og så spillerne i rekkefølge til venstre for deg
            </p>
            <SpillereContainer>
                {spillerIder.map((id) => {
                    const rekkefolgeIndex = spillerRekkefolge.findIndex((rekkefolgeId) => rekkefolgeId === id);
                    const spillerErValgt = spillerRekkefolge.includes(id);

                    return (
                        <Spiller
                            spillerId={id}
                            valgt={spillerErValgt}
                            spillere={spillere}
                            onClick={() => updateSpillerRekkefolge(id)}
                        >
                            {rekkefolgeIndex !== -1 && spillerErValgt && (
                                <div className="rekkefolgeNummer">{rekkefolgeIndex + 1}</div>
                            )}
                        </Spiller>
                    );
                })}
            </SpillereContainer>
            {!!spillerRekkefolgeFeilmelding && <Feilmelding feilmelding={spillerRekkefolgeFeilmelding} />}
        </>
    );
};

export default VelgSpillere;
