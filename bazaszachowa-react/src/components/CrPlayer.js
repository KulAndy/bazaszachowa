import React from "react";

const CrPlayer = ({ player, showSource = false }) => {
  return (
    <>
      <table className="cr-data">
        {showSource && (
          <caption>
            <a href="https://www.cr-pzszach.pl">CR</a>
          </caption>
        )}
        <tr>
          <th colspan="2"> {player.name}</th>
          <td rowspan="4">
            <img
              alt="zdjęcie z cr-u"
              src={`http://www.cr-pzszach.pl/ew/ew/images/${player.id}.jpg`}
              class="cr-foto"
              onError={(e) => {
                e.target.closest("td").remove();
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
