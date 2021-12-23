import hjerterIkon from '../icons/hjerter.png';
import hjerterValgtIkon from '../icons/hjerter-valgt.png';
import ruterIkon from '../icons/ruter.png';
import ruterValgtIkon from '../icons/ruter-valgt.png';
import kloverIkon from '../icons/klover.png';
import kloverValgtIkon from '../icons/klover-valgt.png';
import sparIkon from '../icons/spar.png';
import sparValgtIkon from '../icons/spar-valgt.png';

export enum Slag {
    Klover = 'Kløver',
    Spar = 'Spar',
    Hjerter = 'Hjerter',
    Ruter = 'Ruter',
}

export const slagIkoner: {
    [key in Slag]: {
        valgt: string;
        vanlig: string;
    };
} = {
    [Slag.Klover]: {
        vanlig: kloverIkon,
        valgt: kloverValgtIkon,
    },
    [Slag.Spar]: {
        vanlig: sparIkon,
        valgt: sparValgtIkon,
    },
    [Slag.Hjerter]: {
        vanlig: hjerterIkon,
        valgt: hjerterValgtIkon,
    },
    [Slag.Ruter]: {
        vanlig: ruterIkon,
        valgt: ruterValgtIkon,
    },
};

export type Spillere = Record<string, { navn: string; forkortelse: string }>;
export interface Melding {
    slag: Slag | null;
    antallStikk: number | null;
}

export type MeldingForMelder = Record<string, number[]>;

export type Poeng = Record<string, number>;
export type Runder = Record<string, Runde>;

export interface Runde {
    poeng: Poeng | null;
    lag: string[];
    melder: string;
    melding: Melding;
}

export interface Spill {
    id: string | null;
    runder: Runder | null;
    vinnerIder: string[];
    startet: Date | null;
    avsluttet: Date | null;
}
