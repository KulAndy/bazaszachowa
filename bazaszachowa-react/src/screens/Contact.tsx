import "./Contact.css";
import React, { useCallback, useState } from "react";

import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";
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

      setFormData((previousData) => ({
        ...previousData,
        [name]: files ? files[0] : value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      // eslint-disable-next-line sonarjs/slow-regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email.trim() === admin_mail) {
        alert("contact.Niedozwolony adres");
      } else if (emailRegex.test(formData.email)) {
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
              throw new Error("Sent failed");
            }
          })
          .catch(() => {
            t("contact.failled_sent");
          });
      } else {
        alert(t("contact.invalid_mail"));
      }
    },
    [
      formData.attachment,
      formData.content,
      formData.email,
      formData.subject,
      t,
    ],
  );

  const handleContent = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      setFormData((previousData) => ({
        ...previousData,
        [name]: value,
      }));
    },
    [],
  );

  return (
    <Content classNames={["contact"] as const}>
      <form
        action={API.BASE_URL + API.send_mail}
        encType="multipart/form-data"
        id="form"
        method="post"
        onSubmit={handleSubmit}
        target="_self"
      >
        <h3>{t("contact.email")}: </h3>
        <input
          name="email"
          onChange={handleInputChange}
          required
          type="email"
          value={formData.email}
        />
        <h3>{t("contact.subject")}: </h3>
        <input
          id="sub1"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Pomysł"
        />
        <label htmlFor="sub1">{t("contact.idea")}</label>
        <br />
        <input
          id="sub2"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Uwaga"
        />
        <label htmlFor="sub2"> {t("contact.remark")} </label>
        <br />
        <input
          id="sub3"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Błąd w partii"
        />
        <label htmlFor="sub3"> {t("contact.bug_in_game")} </label>
        <br />
        <input
          id="sub4"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Brakująca partia"
        />
        <label htmlFor="sub4"> {t("contact.missing_game")} </label>
        <br />
        <input
          id="sub5"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Inne"
        />
        <label htmlFor="sub5"> {t("contact.other")} </label>
        <br />
        <h4> {t("contact.content")} : </h4>
        <textarea
          cols={50}
          form="form"
          name="content"
          onChange={handleContent}
          placeholder="Wpisz tekst..."
          rows={6}
          value={formData.content}
        ></textarea>
        <br />
        <label htmlFor="attachment">
          {t("contact.game")} {t("contact.game_limit")}
        </label>
        <br />
        <input
          accept=".pgn, .txt, .cbv, .zip, .7z, .rar"
          id="attachment"
          name="attachment"
          onChange={handleInputChange}
          type="file"
        />
        <br /> <br />
        <input name="submit" type="submit" value={t("contact.send")} />
      </form>
      <address>
        <p>
          {t("contact.phone")} : <a href="tel:+48730758890">+48 730 758 890</a>
        </p>
        <p>
          {t("e_mail")} : <a href="andykrk22@gmail.com">andykrk22@gmail.com</a>
        </p>
      </address>
    </Content>
  );
};

export default Contact;
