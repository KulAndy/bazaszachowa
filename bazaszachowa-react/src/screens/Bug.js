import "./Bug.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Content from "../components/Content";
import { API, admin_mail } from "../settings";
const Bug = () => {
  const { base, gameid } = useParams();
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    link: "",
    type: "",
    notices: "",
    agreement: "",
    id: gameid,
    table: base,
  });
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() == admin_mail) {
      alert("Niedozwolony adres");
    } else if (!emailRegex.test(formData.email)) {
      alert("To nie jest poprawny email");
    } else {
      console.log(formData);
      const form = new FormData();
      const content = `${formData.type}:
      ${formData.notices}
      ${
        formData.link.trim().length > 0
          ? "prawidłowa partia: " + formData.link
          : ""
      }`;
      form.append("email", formData.email);
      form.append(
        "subject",
        "Błąd w partii" + (base + "-" + gameid) + formData.type
      );
      form.append("content", content);
      form.append("attachment", []);

      try {
        const response = await fetch(API.BASE_URL + API.send_mail, {
          method: "POST",
          body: form,
        });

        if (response.status == 200) {
          alert("Poprawnie wysłano wiadomość");
        } else {
          alert("Nie udało się wysłać wiadomości");
        }
      } catch (error) {
        alert("Nie udało się wysłać wiadomości");
      }
    }
  };

  return (
    <Content className={["bug"]}>
      <form
        action={API.BASE_URL + API.send_mail}
        method="post"
        id="form"
        target="_self"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <table class="no_border">
          <tr>
            <td>
              <label for="lastname">Nazwisko*</label>
              <br />
            </td>
            <td>
              <input
                name="lastname"
                id="lastname"
                required
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="firstname">Imię*</label>
              <br />
            </td>
            <td>
              <input
                name="firstname"
                id="firstname"
                required
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="email">email*</label>
              <br />
            </td>
            <td>
              <input
                type="email"
                name="email"
                id="email"
                required
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="type" id="problemLabel">
                Problem
              </label>
              <br />
            </td>
            <td>
              <div id="radioContainer">
                <input
                  type="radio"
                  name="type"
                  value="błędny zapis"
                  id="wrongNotation"
                  required
                  onChange={handleInputChange}
                />
                <label for="wrongNotation">Nieprawidłowy zapis</label>
                <input
                  type="radio"
                  name="type"
                  value="nie istnieje"
                  id="notExist"
                  require
                  onChange={handleInputChange}
                />
                <label for="notExist">Nieisniejąca partia</label>
                <input
                  type="radio"
                  name="type"
                  value="błędne dane"
                  id="wrongData"
                  require
                  onChange={handleInputChange}
                />
                <label for="wrongData">Błędne dane</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="link">link do turnieju/poprawnej partii </label>
            </td>
            <td>
              <input
                type="url"
                name="link"
                id="link"
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <label for="notices">dodatkowe informacje</label>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <textarea
                name="notices"
                id="notices"
                cols="75"
                rows="10"
                onChange={handleInputChange}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div>
                <input
                  type="checkbox"
                  name="agreement"
                  id="agreement"
                  required
                  onChange={handleInputChange}
                />
                <label for="agreement">
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
            <td colspan="2">
              <input type="submit" value="Wyślij" />
            </td>
          </tr>
        </table>

        <input
          type="hidden"
          name="id"
          value={gameid}
          onChange={handleInputChange}
        />
        <input
          type="hidden"
          name="table"
          value={base}
          onChange={handleInputChange}
        />
      </form>
    </Content>
  );
};

export default Bug;
