import { Box, FormControl, MenuItem, Select, TableCell } from "@mui/material";
import { type Dispatch, type SetStateAction } from "react";

import { RESULTS } from "./constants";
import PlayerRow, { type Player } from "./PlayerRow";

export interface Opponent extends Player {
  result: (typeof RESULTS)[number];
}

interface OpponentRowProperties {
  readonly opponent: Opponent;
  readonly setOpponent: Dispatch<SetStateAction<Opponent>>;
}

const OpponentRow = ({ opponent, setOpponent }: OpponentRowProperties) => (
  <>
    <PlayerRow player={opponent} setPlayer={setOpponent} />
    <TableCell>
      <Box sx={{ display: "flex", flexDirection: "column" } as const}>
        <FormControl>
          <Select
            onChange={(event) =>
              setOpponent((previous) => ({
                ...previous,
                result: event.target.value,
              }))
            }
            value={opponent.result}
          >
            {RESULTS.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </TableCell>
  </>
);

export default OpponentRow;
