import React from "react";

export interface CrPlayerType {
  id: string;
  name: string;
  kat?: string;
  fide_id: string;
}

interface CrPlayerProps {
  player: CrPlayerType;
  showSource?: boolean;
}

const CrPlayer: React.FC<CrPlayerProps> = ({ player, showSource = false }) => {
  return (
    <>
      <table className="cr-data">
        {showSource && (
          <caption>
            <a href="https://www.cr-pzszach.pl">CR</a>
          </caption>
        )}
        <tr>
          <th colSpan={2}> {player.name}</th>
          <td rowSpan={4}>
            <img
              alt="zdjęcie z cr-u"
              src={`http://www.cr-pzszach.pl/ew/ew/images/${player.id}.jpg`}
              className="cr-foto"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.parentElement?.remove();
              }}
            />
          </td>
        </tr>
        <tr>
          <th>Tytuł/Kat.:</th>
          <td>{player.kat && <span>{player.kat}</span>}</td>
        </tr>
        <tr>
          <th>CR ID:</th>
          <td>
            <a
              href={`http://www.cr-pzszach.pl/ew/viewpage.php?page_id=1&zwiazek=&typ_czlonka=&pers_id=${player.id}`}
            >
              PL-{player.id}
            </a>
          </td>
        </tr>
        <tr>
          <th>FIDE ID:</th>
          <td>
            <a href={`https://ratings.fide.com/profile/${player.fide_id}`}>
              {player.fide_id}
            </a>
          </td>
        </tr>
      </table>
    </>
  );
};

export default CrPlayer;
