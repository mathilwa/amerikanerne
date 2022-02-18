import React from 'react';
import { Runde, Spillere } from '../types/Types';
import { getSpillerIder } from '../utils';
import SpillereContainer from '../spillere/SpillereContainer';
import Spiller from '../spillere/Spiller';
import SeksjonHeading from '../headings/SeksjonHeading';
import LeggTilMelding from './LeggTilMelding';

interface Props {
    onOppdaterRunde: (nyRunde: Runde) => void;
    runde: Runde | null;
    delerIdForRunde: string | undefined;
    spillere: Spillere;
}

const NyRundeInput: React.FC<Props> = ({ onOppdaterRunde, spillere, runde, delerIdForRunde }) => {
    const rundeData = runde ?? {
        melding: { antallStikk: null, slag: null },
        lag: [],
        melder: '',
        poeng: null,
    };

    const spillerIder = getSpillerIder(spillere);

    const oppdaterNyttLag = (spillerId: string) => {
        const nyttLag = rundeData.lag;
        const nyMelder = rundeData.melder;

        let oppdatertLag = [] as string[];

        if (nyttLag.includes(spillerId) && spillerId !== nyMelder) {
            oppdatertLag = [nyMelder];
        } else if (nyttLag.length < 2 && spillerId !== nyMelder) {
            oppdatertLag = nyttLag.concat(spillerId);
        } else if (nyttLag.length === 2 && spillerId !== nyMelder) {
            oppdatertLag = [nyMelder, spillerId];
        }

        onOppdaterRunde({ ...rundeData, lag: oppdatertLag });
    };

    const onSetHvemMelder = (melder: string) => {
        onOppdaterRunde({ ...rundeData, melder, lag: [melder] });
    };

    return (
        <>
            {!!delerIdForRunde && (
                <p className="hvemDelerInfo">
                    <span className="delerIkon">{`🃏`}</span>
                    {`${spillere[delerIdForRunde].navn} deler`}
                </p>
            )}
            <LeggTilMelding
                onOppdaterMelding={(oppdatertMelding) =>
                    onOppdaterRunde({ ...rundeData, melding: oppdatertMelding })
                }
                melding={rundeData.melding}
            />

            <SeksjonHeading heading="Hvem melder?" />
            <SpillereContainer>
                {spillerIder.map((spillerId) => (
                    <Spiller
                        spillerId={spillerId}
                        spillere={spillere}
                        valgt={spillerId === rundeData.melder}
                        onClick={() => onSetHvemMelder(spillerId)}
                    />
                ))}
            </SpillereContainer>

            <SeksjonHeading heading="Hvem kommer på lag?" />
            <SpillereContainer>
                {spillerIder.map((id) => (
                    <Spiller
                        spillerId={id}
                        onClick={() => oppdaterNyttLag(id)}
                        valgt={rundeData.lag.includes(id)}
                        spillere={spillere}
                    />
                ))}
            </SpillereContainer>
        </>
    );
};

export default NyRundeInput;
