import React from "react";

import { useI18n } from "../i18n/I18nContext";

export interface FidePlayerType {
  birthday: string;
  blitz_rating: number;
  fideid: string;
  name: string;
  rapid_rating: number;
  rating: number;
  title?: string;
}

interface FidePlayerProps {
  player: FidePlayerType;
  showSource?: boolean;
}

const FidePlayer: React.FC<FidePlayerProps> = ({
  player,
  showSource = false,
}) => {
  const { t } = useI18n();
  return (
    <>
      <table className="fide-data">
        {showSource && (
          <caption>
            <a href="https://ratings.fide.com/download_lists.phtml">FIDE</a>
          </caption>
        )}
        <tr>
          <th colSpan={2}>{player.name}</th>
        </tr>
        <tr>
          <th>ID</th>
          <td>
            <a href={`https://ratings.fide.com/profile/${player.fideid}`}>
              {player.fideid}
            </a>
          </td>
        </tr>
        <tr>
          <th>{t("player.fide_title")}</th>
          <td>{player.title ? <>{player.title}</> : t("none")}</td>
        </tr>
        <tr>
          <th>{t("player.birth_year")}</th>
          <td>{player.birthday}</td>
        </tr>
        <tr>
          <th colSpan={2}>Elo</th>
        </tr>
        <tr>
          <th>{t("elo.standard")}</th>
          <td>{player.rating}</td>
        </tr>
        <tr>
          <th>{t("elo.rapid")}</th>
          <td>{player.rapid_rating}</td>
        </tr>
        <tr>
          <th>{t("elo.blitz")}</th>
          <td>{player.blitz_rating}</td>
        </tr>
      </table>
    </>
  );
};

export default FidePlayer;
