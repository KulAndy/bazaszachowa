<?php

function row_to_pgn(array $row): string
{
    if (
        isset($row['Event'])
        && isset($row['Site'])
        && isset($row['Year'])
        && isset($row['Round'])
        && isset($row['White'])
        && isset($row['Black'])
        && isset($row['moves'])
        && isset($row['Result'])

    ) {
        $pgn = "";
        $pgn .= "[Event \"" . $row['Event'] . "\"] \n";
        $pgn .= "[Site \"" . $row['Site'] . "\"] \n";
        $pgn .= "[Date \"" . $row['Year'] . ".";
        if (empty($row['Month'])) {
            $pgn .= "?.";
        } else {
            $pgn .= $row["Month"] . ".";
        }
        if (empty($row['Day'])) {
            $pgn .= "?\"] \n";
        } else {
            $pgn .= $row["Day"] . "\"] \n";
        }
        $pgn .= "[Round \"" . $row['Round'] . "\"] \n";
        $pgn .= "[White \"" . $row['White'] . "\"] \n";
        $pgn .= "[Black \"" . $row['Black'] . "\"] \n";
        $pgn .= "[Result \"" . $row['Result'] . "\"] \n";
        if (!empty($row['ECO'])) {
            $pgn .= "[ECO \"" . $row['ECO'] . "\"] \n";
        }
        if (!empty($row['Whit)eElo'])) {
            $pgn .= "[WhiteElo \"" . $row['WhiteElo'] . "\"]\n";
        }
        if (!empty($row['BlackElo'])) {
            $pgn .= "[BlackElo \"" . $row['BlackElo'] . "\"]\n";
        }
        $pgn .= " \n" . $row['moves'] . " \n\n";


        return $pgn;
    } else {
        return '
[Event "?"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]
        
1. *
        ';
    }
}
