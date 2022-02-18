import React from 'react';
import './spilltabell.css';
import { Spill, Spillere } from '../types/Types';
import { formatDateAndClock } from '../utils';
import TabellHeader from './TabellHeader';
import Poengsum from './Poengsum';
import Runder from './Runder';
import MiniHeading from '../headings/MiniHeading';

interface Props {
    spill: Spill;
    spillere: Spillere;
    pagaendeSpill?: boolean;
}

const SpillTabell: React.FC<Props> = ({ spill, spillere, pagaendeSpill = false }) => {
    const spillStartetTekst =
        spill.startet && spill.startet > new Date('12.01.2021')
            ? `Startet ${formatDateAndClock(new Date(spill.startet))}`
            : 'Startet: Før desember 2021';

    return (
        <div className="spillTabellContainer">
            <MiniHeading heading={spillStartetTekst} />

            <TabellHeader spill={spill} spillere={spillere} />
            <Runder pagaendeSpill={pagaendeSpill} spill={spill} spillere={spillere} />
            <Poengsum spill={spill} spillere={spillere} />
        </div>
    );
};

export default SpillTabell;
