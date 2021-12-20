import { Spill } from './types/Types';

export const formaterSpillForLagring = (spill: Spill) => ({
    vinnerId: spill.vinnerId ?? '',
    runder: spill.runder,
    startingAt: spill.startet ?? new Date(),
    endingAt: spill.avsluttet ?? null,
});
