import React from 'react';
import Modal from './Modal';
import { Spill, Spillere } from './types/Types';
import countBy from 'lodash.countby';
import orderBy from 'lodash.orderby';

interface Props {
    alleSpill: Spill[];
    spillere: Spillere;
    onLukkModal: () => void;
    visModal: boolean;
}

const StatistikkModal: React.FC<Props> = ({ alleSpill, spillere, visModal, onLukkModal }) => {
    const vinnere: string[] = [];
    alleSpill.forEach((spill) => spill.vinnerIder.forEach((vinnerId) => vinnere.push(vinnerId)));
    const antallVinnere = countBy(vinnere);
    const seireSomListe = Object.keys(antallVinnere).map((vinnerId) => ({
        id: vinnerId,
        antallSeire: antallVinnere[vinnerId],
    }));

    const flestSeire = orderBy(seireSomListe, 'antallSeire', 'desc');
    const spillerIdMedFlestSeire = flestSeire.length > 0 ? flestSeire[0] : null;

    // const meldinger: string[] = [];
    // alleSpill.forEach((spill) =>
    //     spill.runder
    //         ? Object.keys(spill.runder).forEach((runde) => meldinger.push(spill.runder![runde].melder))
    //         : [],
    // );
    //
    // console.log(meldinger);
    return (
        <Modal onClose={onLukkModal} isOpen={visModal}>
            <h1>Statistikk</h1>

            <h2 className="heading2">Flest seire:</h2>
            {spillerIdMedFlestSeire && (
                <>
                    <div>
                        {spillere[spillerIdMedFlestSeire.id].navn} - {spillerIdMedFlestSeire.antallSeire} seire
                    </div>
                    <div>
                        {spillere[flestSeire[1].id].navn} - {flestSeire[1].antallSeire} seire
                    </div>
                </>
            )}

            <h2 className="heading2">Flest meldinger:</h2>
        </Modal>
    );
};

export default StatistikkModal;
