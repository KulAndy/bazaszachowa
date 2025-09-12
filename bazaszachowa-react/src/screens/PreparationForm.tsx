import "../styles/PreparationForm.css";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchPlayersWithHints from "../components/SearchPlayersWithHint";
import { useI18n } from "../context/useI18n";
import { URLS } from "../settings";

const PreparationForm = () => {
  const { t } = useI18n();
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState("white");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!player.trim()) {
        alert(t("players.player_required"));
        return;
      }
      navigate(`${URLS.preparation.url}${encodeURIComponent(player)}/${color}`);
    },
    [player, color, navigate, t],
  );

  const colorCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setColor(event.target.value),
    [],
  );

  return (
    <form onSubmit={handleSubmit}>
      <SearchPlayersWithHints
        callback={setPlayer}
        label={t("players.player")}
        placeholder="Nowak, Jan"
        required
      />

      <FormControl
        component="fieldset"
        sx={{ display: "block", mt: 2 } as const}
      >
        <FormLabel component="legend" sx={{ textAlign: "center" } as const}>
          {t("color")}
        </FormLabel>
        <RadioGroup
          name="color"
          onChange={colorCallback}
          row
          sx={{ justifyContent: "center" } as const}
          value={color}
        >
          <FormControlLabel
            control={<Radio />}
            label={t("white")}
            value="white"
          />
          <FormControlLabel
            control={<Radio />}
            label={t("black")}
            value="black"
          />
        </RadioGroup>
      </FormControl>

      <div style={{ marginTop: "1rem", textAlign: "center" } as const}>
        <Button type="submit" variant="contained">
          {t("search")}
        </Button>
      </div>
    </form>
  );
};

export default PreparationForm;
