import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import Content from "../components/Content";
import { useI18n } from "../context/useI18n";
import { admin_mail, API } from "../settings";

const Bug = () => {
  const { t } = useI18n();
  const { base, gameid } = useParams();

  const [formData, setFormData] = useState({
    agreement: false,
    email: "",
    firstname: "",
    id: gameid,
    lastname: "",
    link: "",
    notices: "",
    table: base,
    type: "",
  });

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((previousData) => ({ ...previousData, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.SubmitEvent) => {
      event.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

      if (formData.email.trim() === admin_mail) {
        alert(t("contact.forbidden_mail"));
        return;
      }
      if (!emailRegex.test(formData.email)) {
        alert(t("contact.invalid_mail"));
        return;
      }

      const form = new FormData();
      const content = `${formData.type}:\n${formData.notices}\n${
        formData.link ? `prawidłowa partia: ${formData.link}` : ""
      }`;
      form.append("email", formData.email);
      form.append(
        "subject",
        `Błąd w partii ${base || "xxxx"}-${gameid || 0} - ${formData.type}`,
      );
      form.append("content", content);
      form.append("attachment", "");

      fetch(API.BASE_URL + API.send_mail, { body: form, method: "POST" })
        .then((response) => {
          if (response.status === 200) {
            alert(t("contact.successfully_sent"));
          } else {
            throw new Error("Send error");
          }
        })
        .catch(() => {
          alert(t("contact.failed_sent"));
        });
    },
    [base, gameid, formData],
  );

  return (
    <Content classNames={["bug"] as const}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label={t("lastname")}
            name="lastname"
            onChange={handleInputChange}
            required
            value={formData.lastname}
          />
          <TextField
            label={t("firstname")}
            name="firstname"
            onChange={handleInputChange}
            required
            value={formData.firstname}
          />
          <TextField
            label={t("e_mail")}
            name="email"
            onChange={handleInputChange}
            required
            type="email"
            value={formData.email}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">{t("problem")}</FormLabel>
            <RadioGroup
              name="type"
              onChange={handleInputChange}
              value={formData.type}
            >
              <FormControlLabel
                control={<Radio />}
                label={t("bug.incorrect_notation")}
                value="błędny zapis"
              />
              <FormControlLabel
                control={<Radio />}
                label={t("bug.nonexistent_game")}
                value="nie istnieje"
              />
              <FormControlLabel
                control={<Radio />}
                label={t("bug.incorrect_data")}
                value="błędne dane"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label={t("bug.game_link")}
            name="link"
            onChange={handleInputChange}
            type="url"
            value={formData.link}
          />

          <TextField
            label={t("bug.additional_info")}
            multiline
            name="notices"
            onChange={handleInputChange}
            rows={6}
            value={formData.notices}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="agreement"
                onChange={handleInputChange}
                required
              />
            }
            label={t("bug.gdpr")}
          />

          <div style={{ textAlign: "center" } as const}>
            <Button color="primary" type="submit" variant="contained">
              {t("contact.send")}
            </Button>
          </div>
        </Box>

        <input name="id" type="hidden" value={gameid} />
        <input name="table" type="hidden" value={base} />
      </form>
    </Content>
  );
};

export default Bug;
