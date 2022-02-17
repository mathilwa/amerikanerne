import React from 'react';
import Modal from './modal/Modal';
import { MeldingForMelder, Runde, Spill, Spillere } from './types/Types';
import countBy from 'lodash.countby';
import orderBy from 'lodash.orderby';
import sum from 'lodash.sum';

interface Props {
    alleSpill: Spill[];
    spillere: Spillere;
    onLukkModal: () => void;
    visModal: boolean;
}

const StatistikkModal: React.FC<Props> = ({ alleSpill, spillere, visModal, onLukkModal }) => {
    const vinnere: string[] = [];
    alleSpill.forEach((spill) => spill.vinnerIder.forEach((vinnerId) => vinnere.push(vinnerId)));
    const antallSeirePerSpiller = countBy(vinnere);
    const seireSomListe = Object.keys(antallSeirePerSpiller).map((spillerId) => ({
        id: spillerId,
        antallSeire: antallSeirePerSpiller[spillerId],
    }));

    const flestSeire = orderBy(seireSomListe, 'antallSeire', 'desc');

    const meldere: string[] = [];
    const lagmedlem: string[] = [];
    alleSpill.forEach((spill) =>
        spill.runder
            ? Object.keys(spill.runder).forEach((runde) => {
                  const rundeData = spill.runder![runde];
                  meldere.push(rundeData.melder);
                  const lagmedlemSomIkkeMelder = rundeData.lag.find(
                      (lagMedlemId) => lagMedlemId !== rundeData.melder,
                  );
                  if (lagmedlemSomIkkeMelder) {
                      lagmedlem.push(lagmedlemSomIkkeMelder);
                  }
              })
            : [],
    );

    const antallMeldingerPerSpiller = countBy(meldere);
    const meldereSomListe = Object.keys(antallMeldingerPerSpiller).map((spillerId) => ({
        id: spillerId,
        antallMeldinger: antallMeldingerPerSpiller[spillerId],
    }));
    const flestMeldinger = orderBy(meldereSomListe, 'antallMeldinger', 'desc');

    const antallGangerMedPaLag = countBy(lagmedlem);
    const lagmeldemInfoSomListe = Object.keys(antallGangerMedPaLag).map((spillerId) => ({
        id: spillerId,
        antallSpill: antallGangerMedPaLag[spillerId],
    }));

    const lagmeldemInfoSomListeSortert = orderBy(lagmeldemInfoSomListe, 'antallSpill', 'desc');

    const meldinger = alleSpill
        .map((spill) => {
            if (spill.runder) {
                return Object.keys(spill.runder).reduce((meldingerForRunde, runde) => {
                    const rundeData: Runde = spill.runder![runde];
                    if (rundeData.melding.antallStikk) {
                        const meldingerAlleredeForMelder = meldingerForRunde[rundeData.melder] ?? [];
                        return {
                            ...meldingerForRunde,
                            [rundeData.melder]: [...meldingerAlleredeForMelder, rundeData.melding.antallStikk],
                        };
                    }

                    return meldingerForRunde;
                }, {} as MeldingForMelder);
            } else {
                return null;
            }
        })
        .filter((melding) => !!melding);

    const alleMeldinger = meldinger.reduce((alleMeldingerForAlleSpillere, spillereMedMelding) => {
        if (spillereMedMelding) {
            return Object.keys(spillereMedMelding).reduce((meldingerForEtSpill, spillerId) => {
                const alleredeRegistrerteMeldinger =
                    alleMeldingerForAlleSpillere && alleMeldingerForAlleSpillere[spillerId]
                        ? alleMeldingerForAlleSpillere[spillerId]
                        : [0];

                return {
                    ...meldingerForEtSpill,
                    [spillerId]: alleredeRegistrerteMeldinger.concat(spillereMedMelding[spillerId]),
                };
            }, {} as MeldingForMelder);
        }
        return alleMeldingerForAlleSpillere;
    }, {} as MeldingForMelder);

    const alleMeldingerSomListe = alleMeldinger
        ? Object.keys(alleMeldinger).map((spillerId) => {
              const antallMeldinger = alleMeldinger[spillerId].length;
              const sumAlleMeldinger = antallMeldinger && antallMeldinger > 0 ? sum(alleMeldinger[spillerId]) : 0;
              return {
                  id: spillerId,
                  gjennomsnittsmelding: Math.round((sumAlleMeldinger / antallMeldinger) * 10) / 10,
              };
          })
        : [];

    const alleMeldingerSortert = orderBy(alleMeldingerSomListe, 'gjennomsnittsmelding', 'desc');
    const statistikkForKunPagaendeSpill = alleSpill.length === 1;

    return (
        <Modal onClose={onLukkModal} isOpen={visModal}>
            <h1>Statistikk</h1>

            {!statistikkForKunPagaendeSpill && (
                <div className="statistikkSeksjon">
                    <h2 className="heading2"> {`Flest seire 🏆`}:</h2>
                    {flestSeire.map((seireInfo) => (
                        <div key={'seireInfo-' + seireInfo.id}>
                            <span className="statistikkNavn">{spillere[seireInfo.id].navn}</span>
                            {`: ${seireInfo.antallSeire} seire`}
                        </div>
                    ))}
                </div>
            )}

            <div className="statistikkSeksjon">
                <h2 className="heading2">Flest meldinger:</h2>
                {flestMeldinger.map((meldingInfo) => (
                    <div key={'meldinginfo-' + meldingInfo.id}>
                        <span className="statistikkNavn">{spillere[meldingInfo.id].navn}</span>
                        {`: ${meldingInfo.antallMeldinger}`}
                    </div>
                ))}
            </div>

            {!statistikkForKunPagaendeSpill && (
                <div className="statistikkSeksjon">
                    <h2 className="heading2">Høyest snittmelding:</h2>
                    {alleMeldingerSortert.map((meldingsinfo) => (
                        <div key={'allemeldingerinfo-' + meldingsinfo.id}>
                            <span className="statistikkNavn">{spillere[meldingsinfo.id].navn}</span>
                            {`: Snittmelding på ${meldingsinfo.gjennomsnittsmelding} stikk`}
                        </div>
                    ))}
                </div>
            )}

            <div className="statistikkSeksjon">
                <h2 className="heading2">Antall ganger med på lag uten å melde selv:</h2>
                {lagmeldemInfoSomListeSortert.map((lagmeldemInfo) => (
                    <div key={'lagmeldemInfo-' + lagmeldemInfo.id}>
                        <span className="statistikkNavn">{spillere[lagmeldemInfo.id].navn}</span>
                        {`: ${lagmeldemInfo.antallSpill}`}
                    </div>
                ))}
            </div>

            {}
            <div className="knapperad">
                <button className="knapp sekundaerKnapp" onClick={onLukkModal}>
                    Lukk
                </button>
            </div>
        </Modal>
    );
};

export default StatistikkModal;
