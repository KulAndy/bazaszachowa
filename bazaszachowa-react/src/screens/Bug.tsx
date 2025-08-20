import "./Bug.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Content from "../components/Content";
import { useI18n } from "../i18n/I18nContext";
import { admin_mail, API } from "../settings";
const Bug = () => {
  const { t } = useI18n();
  const { base, gameid } = useParams();
  const [formData, setFormData] = useState({
    agreement: "",
    email: "",
    firstname: "",
    id: gameid,
    lastname: "",
    link: "",
    notices: "",
    table: base,
    type: "",
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === admin_mail) {
      alert("Niedozwolony adres");
    } else if (emailRegex.test(formData.email)) {
      const form = new FormData();
      const content = `${formData.type}:
        ${formData.notices}
        ${
          formData.link.trim().length > 0
            ? `prawidłowa partia: ${formData.link}`
            : ""
        }`;
      form.append("email", formData.email);
      form.append(
        "subject",
        `Błąd w partii ${base || "xxxx"}-${gameid || 0} - ${formData.type}`,
      );
      form.append("content", content);
      form.append("attachment", "");

      fetch(API.BASE_URL + API.send_mail, {
        body: form,
        method: "POST",
      })
        .then((response) => {
          if (response.status === 200) {
            alert("Poprawnie wysłano wiadomość");
          } else {
            throw new Error("Send error");
          }
        })
        .catch(() => {
          alert("Nie udało się wysłać wiadomości");
        });
    } else {
      alert("To nie jest poprawny email");
    }
  };

  return (
    <Content classNames={["bug"]}>
      <form
        action={API.BASE_URL + API.send_mail}
        encType="multipart/form-data"
        id="form"
        method="post"
        onSubmit={handleSubmit}
        target="_self"
      >
        <table className="no_border">
          <tr>
            <td>
              <label htmlFor="lastname">{t("lastname")}*</label>
              <br />
            </td>
            <td>
              <input
                id="lastname"
                name="lastname"
                onChange={handleInputChange}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="firstname">{t("firstname")}*</label>
              <br />
            </td>
            <td>
              <input
                id="firstname"
                name="firstname"
                onChange={handleInputChange}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="email">{t("e_mail")}*</label>
              <br />
            </td>
            <td>
              <input
                id="email"
                name="email"
                onChange={handleInputChange}
                required
                type="email"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="type" id="problemLabel">
                {t("problem")}
              </label>
              <br />
            </td>
            <td>
              <div id="radioContainer">
                <input
                  id="wrongNotation"
                  name="type"
                  onChange={handleInputChange}
                  required
                  type="radio"
                  value="błędny zapis"
                />
                <label htmlFor="wrongNotation">
                  {t("bug.incorrect_notation")}
                </label>
                <input
                  id="notExist"
                  name="type"
                  onChange={handleInputChange}
                  required
                  type="radio"
                  value="nie istnieje"
                />
                <label htmlFor="notExist">{t("bug.nonexistent_game")}</label>
                <input
                  id="wrongData"
                  name="type"
                  onChange={handleInputChange}
                  required
                  type="radio"
                  value="błędne dane"
                />
                <label htmlFor="wrongData">{t("bug.incorrect_data")}</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="link">{t("bug.game_link")} </label>
            </td>
            <td>
              <input
                id="link"
                name="link"
                onChange={handleInputChange}
                type="url"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <label htmlFor="notices">{t("bug.additional_info")}</label>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <textarea
                cols={75}
                id="notices"
                name="notices"
                onChange={handleInputChange}
                rows={10}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div>
                <input
                  id="agreement"
                  name="agreement"
                  onChange={handleInputChange}
                  required
                  type="checkbox"
                />
                <label htmlFor="agreement">{t("bug.gdpr")}</label>
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <input type="submit" value={t("contact.send")} />
            </td>
          </tr>
        </table>

        <input
          name="id"
          onChange={handleInputChange}
          type="hidden"
          value={gameid}
        />
        <input
          name="table"
          onChange={handleInputChange}
          type="hidden"
          value={base}
        />
      </form>
    </Content>
  );
};

export default Bug;
