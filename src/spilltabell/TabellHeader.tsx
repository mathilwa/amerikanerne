import React from 'react';
import './spilltabell.css';
import { Spill, Spillere } from '../types/Types';

interface Props {
    spill: Spill;
    spillere: Spillere;
}

const TabellHeader: React.FC<Props> = ({ spill, spillere }) => (
    <div className="spilltabell">
        {spill.spillerRekkefolge.map((id) => (
            <div key={'navn-' + id}>
                <span key={'navn-mobil-' + id} className="tabellHeaderMobil">
                    {spillere[id].forkortelse}
                </span>
                <span key={'navn-desktop-' + id} className="tabellHeaderDesktop">
                    {spillere[id].navn}
                </span>
            </div>
        ))}
        <span className="tabellHeaderMeldingMobil">Mld</span>
        <span className="tabellHeaderMeldingDesktop">Melding</span>
    </div>
);

export default TabellHeader;
