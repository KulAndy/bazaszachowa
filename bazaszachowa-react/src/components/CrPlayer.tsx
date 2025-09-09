import { useI18n } from "../i18n/I18nContext";

export interface CrPlayerType {
  fide_id: string;
  id: string;
  kat?: string;
  name: string;
}

const handleErrorImage = (event: React.SyntheticEvent) => {
  const target = event.target as HTMLElement;
  target.parentElement?.remove();
};

interface CrPlayerProperties {
  readonly player: CrPlayerType;
  readonly showSource?: boolean;
}

const CrPlayer: React.FC<CrPlayerProperties> = ({
  player,
  showSource = false,
}) => {
  const { t } = useI18n();
  return (
    <table className="cr-data">
      {showSource ? (
        <caption>
          <a href="https://www.cr-pzszach.pl">CR</a>
        </caption>
      ) : null}
      <tr>
        <th colSpan={2}> {player.name}</th>
        <td rowSpan={4}>
          <img
            alt="zdjęcie z cr-u"
            className="cr-foto"
            onError={handleErrorImage}
            src={`http://www.cr-pzszach.pl/ew/ew/images/${player.id}.jpg`}
          />
        </td>
      </tr>
      <tr>
        <th>{t("player.cr_title")}</th>
        <td>{player.kat ? <span>{player.kat}</span> : null}</td>
      </tr>
      <tr>
        <th>CR ID</th>
        <td>
          <a
            href={`http://www.cr-pzszach.pl/ew/viewpage.php?page_id=1&zwiazek=&typ_czlonka=&pers_id=${player.id}`}
          >
            PL-{player.id}
          </a>
        </td>
      </tr>
      <tr>
        <th>FIDE ID</th>
        <td>
          <a href={`https://ratings.fide.com/profile/${player.fide_id}`}>
            {player.fide_id}
          </a>
        </td>
      </tr>
    </table>
  );
};

export default CrPlayer;
