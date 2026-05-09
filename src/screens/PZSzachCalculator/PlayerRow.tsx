import {
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TableCell,
} from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

import { useI18n } from "../../context/useI18n";

import { TITLES } from "./constants";

export interface Player {
  sex: "F" | "M";
  title: (typeof TITLES)[number]["title"];
}

interface PlayerRowProperties<T extends Player> {
  readonly player: T;
  readonly setPlayer: Dispatch<SetStateAction<T>>;
}

const PlayerRow = <T extends Player>({
  player,
  setPlayer,
}: PlayerRowProperties<T>) => {
  const { t } = useI18n();

  return (
    <>
      <TableCell>
        <RadioGroup
          onChange={(event) =>
            setPlayer((previous) => ({
              ...previous,
              sex: event.target.value as "F" | "M",
            }))
          }
          sx={{ display: "flex", flexDirection: "row" } as const}
          value={player.sex}
        >
          <FormControlLabel control={<Radio />} label={t("male")} value="M" />
          <FormControlLabel control={<Radio />} label={t("female")} value="F" />
        </RadioGroup>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", flexDirection: "column" } as const}>
          <FormControl>
            <Select
              onChange={(event) =>
                setPlayer((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
              value={player.title}
            >
              {TITLES.filter((item) => item.sex === player.sex).map((item) => (
                <MenuItem key={item.title} value={item.title}>
                  {item.title} - {item.rating}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </TableCell>
    </>
  );
};

export default PlayerRow;
