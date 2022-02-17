import React from 'react';
import { Melding, Runde, Slag, slagIkoner, Spillere } from './types/Types';
import { getSpillerIder } from './utils';
import SpillereContainer from './spillere/SpillereContainer';
import Spiller from './spillere/Spiller';

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

    const onSetNyMelding = (nyMelding: Melding) => {
        onOppdaterRunde({ ...rundeData, melding: nyMelding });
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
            <h2 className="heading2">Hva meldes?</h2>
            <div className="hvaMeldes">
                <div className="melding">
                    <div className="slag">
                        {Object.values(Slag).map((typeSlag) => (
                            <label key={typeSlag}>
                                <input
                                    type="radio"
                                    id={typeSlag}
                                    onChange={() => onSetNyMelding({ ...rundeData.melding, slag: typeSlag })}
                                    checked={rundeData.melding.slag === typeSlag}
                                />
                                <img
                                    src={
                                        rundeData.melding.slag === typeSlag
                                            ? slagIkoner[typeSlag].valgt
                                            : slagIkoner[typeSlag].vanlig
                                    }
                                    className="slagIkon"
                                    alt=""
                                />
                            </label>
                        ))}
                    </div>

                    <div className="leggTilNyePoeng">
                        <label className="labelNyePoeng">
                            <input
                                className="inputNyePoeng"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={rundeData.melding.antallStikk ? rundeData.melding.antallStikk : ''}
                                onChange={(event) =>
                                    onSetNyMelding({
                                        ...rundeData.melding,
                                        antallStikk: parseInt(event.target.value),
                                    })
                                }
                            />
                        </label>
                    </div>
                </div>
            </div>
            <h2 className="heading2">Hvem melder?</h2>
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

            <h2 className="heading2">Hvem kommer på lag?</h2>
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
