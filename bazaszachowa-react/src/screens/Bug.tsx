import "./Bug.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Content from "../components/Content";
import { admin_mail, API } from "../settings";
const Bug = () => {
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

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
        `Błąd w partii ${base}-${gameid} - ${formData.type}`,
      );
      form.append("content", content);
      form.append("attachment", "");

      try {
        const response = await fetch(API.BASE_URL + API.send_mail, {
          body: form,
          method: "POST",
        });

        if (response.status === 200) {
          alert("Poprawnie wysłano wiadomość");
        } else {
          alert("Nie udało się wysłać wiadomości");
        }
      } catch {
        alert("Nie udało się wysłać wiadomości");
      }
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
              <label htmlFor="lastname">Nazwisko*</label>
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
              <label htmlFor="firstname">Imię*</label>
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
              <label htmlFor="email">email*</label>
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
                Problem
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
                <label htmlFor="wrongNotation">Nieprawidłowy zapis</label>
                <input
                  id="notExist"
                  name="type"
                  onChange={handleInputChange}
                  required
                  type="radio"
                  value="nie istnieje"
                />
                <label htmlFor="notExist">Nieisniejąca partia</label>
                <input
                  id="wrongData"
                  name="type"
                  onChange={handleInputChange}
                  required
                  type="radio"
                  value="błędne dane"
                />
                <label htmlFor="wrongData">Błędne dane</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="link">link do turnieju/poprawnej partii </label>
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
              <label htmlFor="notices">dodatkowe informacje</label>
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
                <label htmlFor="agreement">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych dla
                  potrzeb niezbędnych do realizacji procesu przetwarzania
                  zgłoszenia błędu zgodnie z ustawą z dnia 10 maja 2018 roku o
                  ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz
                  zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE)
                  2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób
                  fizycznych w związku z przetwarzaniem danych osobowych i w
                  sprawie swobodnego przepływu takich danych oraz uchylenia
                  dyrektywy 95/46/WE (RODO). Administratorem danych jest autor
                  strony.
                </label>
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan={2}>
              <input type="submit" value="Wyślij" />
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
