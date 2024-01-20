import React from "react";
const FidePlayer = ({ player, showSource = false }) => {
  return (
    <>
      <table className="fide-data">
        {showSource && (
          <caption>
            <a href="https://ratings.fide.com/download_lists.phtml">FIDE</a>
          </caption>
        )}
        <tr>
          <th colspan="2">{player.name}</th>
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
          <th>Tytuł</th>
          <td>{player.title ? <>{player.title}</> : "brak"}</td>
        </tr>
        <tr>
          <th>Rocznik</th>
          <td>{player.birthday}</td>
        </tr>
        <tr>
          <th colspan="2">Elo</th>
        </tr>
        <tr>
          <th>Klasyczne</th>
          <td>{player.rating}</td>
        </tr>
        <tr>
          <th>Szybkie</th>
          <td>{player.rapid_rating}</td>
        </tr>
        <tr>
          <th>Błyskawiczne</th>
          <td>{player.blitz_rating}</td>
        </tr>
      </table>
    </>
  );
};

export default FidePlayer;
