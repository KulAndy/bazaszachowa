import "./Contact.css";
import React, { useState } from "react";

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === admin_mail) {
      alert("Niedozwolony adres");
    } else if (emailRegex.test(formData.email)) {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("subject", formData.subject);
      form.append("content", formData.content);
      form.append("attachment", formData.attachment || "");

      try {
        void fetch(API.BASE_URL + API.send_mail, {
          body: form,
          method: "POST",
        }).then((response) => {
          if (response.status === 200) {
            alert(t("successfully_sent"));
          } else {
            alert(t("failled_sent"));
          }
        });
      } catch {
        alert(t("failled_sent"));
      }
    } else {
      alert(t("invalid_mail"));
    }
  };

  return (
    <Content classNames={["contact"]}>
      <form
        action={API.BASE_URL + API.send_mail}
        encType="multipart/form-data"
        id="form"
        method="post"
        onSubmit={handleSubmit}
        target="_self"
      >
        <h3>{t("email")}: </h3>
        <input
          name="email"
          onChange={handleInputChange}
          required
          type="email"
          value={formData.email}
        />
        <h3>{t("subject")}: </h3>
        <input
          id="sub1"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Pomysł"
        />
        <label htmlFor="sub1">{t("idea")}</label>
        <br />
        <input
          id="sub2"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Uwaga"
        />
        <label htmlFor="sub2"> {t("remark")} </label>
        <br />
        <input
          id="sub3"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Błąd w partii"
        />
        <label htmlFor="sub3"> {t("bug_in_game")} </label>
        <br />
        <input
          id="sub4"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Brakująca partia"
        />
        <label htmlFor="sub4"> {t("missing_game")} </label>
        <br />
        <input
          id="sub5"
          name="subject"
          onChange={handleInputChange}
          required
          type="radio"
          value="Inne"
        />
        <label htmlFor="sub5"> {t("other")} </label>
        <br />
        <h4> {t("content")} : </h4>
        <textarea
          cols={50}
          form="form"
          name="content"
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { name, value } = event.target;

            setFormData((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          }}
          placeholder="Wpisz tekst..."
          rows={6}
          value={formData.content}
        ></textarea>
        <br />
        <label htmlFor="attachment">
          {t("game")} {t("game_limit")}
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
        <input name="submit" type="submit" value={t("send")} />
      </form>
      <address>
        <p>
          {t("phone")} : <a href="tel:+48730758890">+48 730 758 890</a>
        </p>
        <p>
          {t("e_mail")} : <a href="andykrk22@gmail.com">andykrk22@gmail.com</a>
        </p>
      </address>
    </Content>
  );
};

export default Contact;
