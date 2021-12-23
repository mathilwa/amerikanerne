import { Poeng, Runder, Spill, Spillere } from './types/Types';
import { format } from 'date-fns';

export const formaterSpillForLagring = (spill: Spill) => ({
    vinnerIder: spill.vinnerIder ?? [],
    runder: spill.runder,
    startingAt: spill.startet ?? new Date(),
    endingAt: spill.avsluttet ?? null,
});
export const getSpillerIder = (spillere: Spillere) => Object.keys(spillere).map((key) => key);
export const formatDateAndClock = (date: Date) => format(new Date(date), "dd.MM.yy 'kl.' HH:mm");
export const mapSamletPoengsumForSpill = (spill: Spill, spillerIder: string[]): Poeng | null => {
    if (spill.runder && Object.keys(spill.runder).length > 0) {
        return Object.values(spill.runder).reduce((allePoeng, runde) => {
            if (runde.poeng) {
                const allePoengForRunde = spillerIder.reduce((poengForAlleSpillere, spillerId) => {
                    const poengForSpiller = runde.poeng![spillerId];
                    const poengTilNaa = allePoeng[spillerId] ?? 0;
                    return { ...poengForAlleSpillere, [spillerId]: poengTilNaa + poengForSpiller };
                }, {} as Poeng);
                return { ...allePoeng, ...allePoengForRunde };
            } else {
                return allePoeng;
            }
        }, {} as Poeng);
    }

    return null;
};
export const getSpilletHarEnVinner = (spill: Spill, spillerIder: string[]): boolean => {
    const poengForAlleRunder = mapSamletPoengsumForSpill(spill, spillerIder);

    return poengForAlleRunder ? Object.values(poengForAlleRunder).some((poeng) => (poeng as number) >= 52) : false;
};

export const finnTotalsumForSpiller = (runder: Runder, spillerId: string) => {
    if (runder) {
        return Object.values(runder).reduce((akk, runde) => {
            if (runde.poeng) {
                return akk + runde.poeng[spillerId];
            } else {
                return akk;
            }
        }, 0);
    }
    return 0;
};

export const getPoengForSisteRunde = (spill: Spill): Poeng | null =>
    spill.runder &&
    spill.runder[Object.keys(spill.runder).length - 1] &&
    spill.runder[Object.keys(spill.runder).length - 1].poeng;