import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";

import Content from "../../components/app/Content";
import { useI18n } from "../../context/useI18n";
import { API } from "../../settings";

import { validateSource } from "./validator";

const UploadGames = () => {
  const { t } = useI18n();
  const [source, setSource] = useState<
    "lichess" | "livechess" | "pgn_file" | "remote_pgn"
  >("lichess");

  const [email, setEmail] = useState("");
  const [pgn, setPgn] = useState("");
  const [url, setUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      let body = {};

      switch (source) {
        case "lichess":
        case "livechess": {
          if (!(url && source) || !validateSource(url, source)) {
            alert(t("uploads.invalida_data"));
            return;
          }
          body = { source, url };
          break;
        }
        case "pgn_file": {
          if (!(email && verificationCode && pgn && source)) {
            alert(t("uploads.invalida_data"));
            return;
          }
          body = { email, pgn, source, verificationCode };
          break;
        }
        case "remote_pgn": {
          if (
            !(email && verificationCode && url && source) ||
            !validateSource(url, source)
          ) {
            alert(t("uploads.invalida_data"));
            return;
          }
          body = { email, source, url, verificationCode };
          break;
        }
      }
      axios
        .post(API.BASE_URL + API.upload_games.upload, body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          switch (response.status) {
            case 200: {
              alert(t("uploads.successfully_added"));
              break;
            }
            case 208: {
              alert(t("uploads.link_exists"));
              break;
            }
            case 400: {
              alert(t("uploads.incorrect_data"));
              break;
            }
            case 401: {
              alert(t("uploads.verification_failed"));
              break;
            }
            case 503: {
              alert(t("uploads.internal_error"));
              break;
            }
            default: {
              alert(t("uploads.unknown_response"));
              break;
            }
          }
        })
        .catch((error: AxiosError) => {
          const status = error?.response?.status;

          switch (status) {
            case 400: {
              alert(t("uploads.incorrect_data"));
              break;
            }
            case 401: {
              alert(t("uploads.verification_failed"));
              break;
            }
            case 503: {
              alert(t("uploads.internal_error"));
              break;
            }
            default: {
              alert(t("uploads.unknown_response"));
              break;
            }
          }
        });
    },
    [source, email, pgn, url, verificationCode, t],
  );

  const generateCode = useCallback(() => {
    axios
      .post(
        API.BASE_URL + API.upload_games.verification,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        alert(t("uploads.sent_code"));
      })
      .catch(() => {
        alert(t("uploads.code_failed"));
      });
  }, [email, t]);

  return (
    <Content>
      <h1>{t("uploads.game_upload")}</h1>
      <article>
        {t("uploads.encouragement")}
        <br />
        {t("uploads.verification")}
        <hr />
        {t("uploads.archive")}
        <hr />
        {t("contact.remark")}:
        <ul>
          <li>{t("uploads.empty_year")}</li>
          <li>{t("uploads.name_order")}</li>
          <li>{t("uploads.decoding")}</li>
          <li>{t("uploads.variants")}</li>
          <li>{t("uploads.short_games")}</li>
        </ul>
      </article>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 } as const}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t("uploads.source")}</FormLabel>
            <RadioGroup
              name="source"
              onChange={(event) => {
                setSource(
                  event.target.value as
                    | "lichess"
                    | "livechess"
                    | "pgn_file"
                    | "remote_pgn",
                );
              }}
              value={source}
            >
              <FormControlLabel
                control={<Radio />}
                label="Lichess"
                value="lichess"
              />
              <FormControlLabel
                control={<Radio />}
                label="Livechess"
                value="livechess"
              />
              <FormControlLabel
                control={<Radio />}
                label={t("uploads.remote_pgn")}
                value="remote_pgn"
              />
              <FormControlLabel
                control={<Radio />}
                label={t("uploads.pgn_file")}
                value="pgn_file"
              />
            </RadioGroup>
          </FormControl>
          {["pgn_file", "remote_pgn"].includes(source) && (
            <>
              <TextField
                label={t("contact.email")}
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
              <TextField
                label={t("uploads.verification_code")}
                onChange={(event) => setVerificationCode(event.target.value)}
                required
                value={verificationCode}
              />
              <Box sx={{ textAlign: "center" } as const}>
                <Button
                  onClick={generateCode}
                  type="button"
                  variant="contained"
                >
                  {t("uploads.send_code")}
                </Button>
              </Box>
            </>
          )}
          {source === "pgn_file" ? (
            <input
              accept=".pgn, .txt"
              onChange={(event) => {
                const files = event.target.files;

                if (!files?.length) {
                  return;
                }

                const file = files[0];
                void file.text().then((data) => {
                  setPgn(data);
                });
              }}
              required
              type="file"
            />
          ) : (
            <TextField
              fullWidth
              label="URL"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://lichess.org/braodcast/some-tournament/xyz"
              required
              type="url"
              value={url}
            />
          )}
          <Box sx={{ textAlign: "center" } as const}>
            <Button type="submit" variant="contained">
              {t("contact.send")}
            </Button>
          </Box>
        </Box>
      </form>
    </Content>
  );
};

export default UploadGames;
