import { Poeng, Runder, Spill, Spillere } from './types/Types';
import { format } from 'date-fns';

export const formaterSpillForLagring = (spill: Spill) => ({
    vinnerId: spill.vinnerId ?? '',
    runder: spill.runder,
    startingAt: spill.startet ?? new Date(),
    endingAt: spill.avsluttet ?? null,
});
export const getSpillerIder = (spillere: Spillere) => Object.keys(spillere).map((key) => key);
export const formatDateAndClock = (date: Date) => format(new Date(date), "dd.MM.yy 'kl.' HH:mm");
export const spilletHarEnVinner = (spill: Spill, spillerIder: string[]): boolean => {
    if (spill.runder && Object.keys(spill.runder).length > 0) {
        const poengForAlleRunder = Object.values(spill.runder).reduce((akk, runde) => {
            if (runde.poeng) {
                const allePoengForRunde = spillerIder.reduce((poengForAlleSpillere, spillerId) => {
                    const poengForSpiller = runde.poeng![spillerId];
                    const poengTilNaa = poengForAlleSpillere[spillerId] ?? 0;
                    return { ...poengForAlleSpillere, [spillerId]: poengTilNaa + poengForSpiller };
                }, {} as Poeng);
                return { ...akk, ...allePoengForRunde };
            } else {
                return akk;
            }
        }, {});

        return Object.values(poengForAlleRunder).some((poeng) => (poeng as number) >= 52);
    }

    return false;
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
