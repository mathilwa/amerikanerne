import { Spill } from './types/Types';
import { format } from 'date-fns';

export const formaterSpillForLagring = (spill: Spill) => ({
    vinnerId: spill.vinnerId ?? '',
    runder: spill.runder,
    startingAt: spill.startet ?? new Date(),
    endingAt: spill.avsluttet ?? null,
});

export const formatDateAndClock = (date: Date) => format(new Date(date), "dd.MM.yy 'kl.' HH:mm");
