import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import Content from "../components/app/Content";
import { useI18n } from "../context/useI18n";
import { admin_mail, API } from "../settings";

const Contact = () => {
  const [formData, setFormData] = useState<{
    attachment: File | null;
    content: string;
    email: string;
    subject: string;
  }>({
    attachment: null,
    content: "",
    email: "",
    subject: "",
  });

  const { t } = useI18n();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files, name, value } = event.target;
      setFormData((previous) => ({
        ...previous,
        [name]: files ? files[0] : value,
      }));
    },
    [],
  );

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));
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
      form.append("email", formData.email);
      form.append("subject", formData.subject);
      form.append("content", formData.content);
      form.append("attachment", formData.attachment || "");

      fetch(API.BASE_URL + API.send_mail, {
        body: form,
        method: "POST",
      })
        .then((response) => {
          if (response.status === 200) {
            alert(t("contact.successfully_sent"));
          } else {
            throw new Error("Send failed");
          }
        })
        .catch(() => {
          alert(t("contact.failed_sent"));
        });
    },
    [formData, t],
  );

  return (
    <Content classNames={["contact"] as const}>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t("contact.email")}
          margin="normal"
          name="email"
          onChange={handleInputChange}
          required
          type="email"
          value={formData.email}
        />

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">{t("contact.subject")}</FormLabel>
          <RadioGroup
            name="subject"
            onChange={handleInputChange}
            value={formData.subject}
          >
            <FormControlLabel
              control={<Radio />}
              label={t("contact.idea")}
              value="Pomysł"
            />
            <FormControlLabel
              control={<Radio />}
              label={t("contact.remark")}
              value="Uwaga"
            />
            <FormControlLabel
              control={<Radio />}
              label={t("contact.bug_in_game")}
              value="Błąd w partii"
            />
            <FormControlLabel
              control={<Radio />}
              label={t("contact.missing_game")}
              value="Brakująca partia"
            />
            <FormControlLabel
              control={<Radio />}
              label={t("contact.other")}
              value="Inne"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label={t("contact.content")}
          margin="normal"
          multiline
          name="content"
          onChange={handleContentChange}
          rows={6}
          value={formData.content}
        />

        <Box marginY={2}>
          <label htmlFor="attachment">
            {t("contact.game")} {t("contact.game_limit")}{" "}
          </label>
          <br />
          <input
            accept=".pgn, .txt, .cbv, .zip, .7z, .rar"
            id="attachment"
            name="attachment"
            onChange={handleInputChange}
            type="file"
          />
        </Box>

        <div style={{ textAlign: "center" } as const}>
          <Button color="primary" type="submit" variant="contained">
            {t("contact.send")}
          </Button>
        </div>
      </form>

      <Box component="address" marginTop={4}>
        <Typography>
          {t("contact.phone")}:{" "}
          <Link href="tel:+48730758890">
            {
              // eslint-disable-next-line i18next/no-literal-string
            }
            +48 730 758 890
          </Link>
        </Typography>
        <Typography>
          {t("e_mail")}:{" "}
          <Link href="mailto:andykrk22@gmail.com">{admin_mail}</Link>
        </Typography>
      </Box>
    </Content>
  );
};

export default Contact;
