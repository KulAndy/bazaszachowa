import "./Contact.css";
import React, { useState } from "react";
import { API, admin_mail } from "../settings";
import Content from "../components/Content";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    content: "",
    attachment: null,
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
    if (formData.email.trim() === admin_mail) {
      alert("Niedozwolony adres");
    } else if (!emailRegex.test(formData.email)) {
      alert("To nie jest poprawny email");
    } else {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("subject", formData.subject);
      form.append("content", formData.content);
      form.append("attachment", formData.attachment);

      try {
        const response = await fetch(API.BASE_URL + API.send_mail, {
          method: "POST",
          body: form,
        });

        if (response.status === 200) {
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
    <Content classNames={["contact"]}>
      <form
        action={API.BASE_URL + API.send_mail}
        method="post"
        id="form"
        target="_self"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <h3>Email: </h3>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <h3>Temat: </h3>
        <input
          type="radio"
          id="sub1"
          name="subject"
          value="Pomysł"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="sub1">Pomysł</label>
        <br />
        <input
          type="radio"
          id="sub2"
          name="subject"
          value="Uwaga"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="sub2">Uwaga</label>
        <br />
        <input
          type="radio"
          id="sub3"
          name="subject"
          value="Błąd w partii"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="sub3">Błąd w partii</label>
        <br />
        <input
          type="radio"
          id="sub4"
          name="subject"
          value="Brakująca partia"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="sub4">Brakująca partia</label>
        <br />
        <input
          type="radio"
          id="sub5"
          name="subject"
          value="Inne"
          onChange={handleInputChange}
          required
        />
        <label htmlFor="sub5">Inne</label>
        <br />
        <h4>Treść: </h4>
        <textarea
          rows="6"
          cols="50"
          name="content"
          form="form"
          placeholder="Wpisz tekst..."
          value={formData.content}
          onChange={handleInputChange}
        ></textarea>
        <br />
        <label htmlFor="attachment">
          Partia (akceptowane pliki *.pgn, *.txt, *.cbv, *.zip, *.7z, *.rar max
          200MB)
        </label>
        <br />
        <input
          type="file"
          id="attachment"
          name="attachment"
          accept=".pgn, .txt, .cbv, .zip, .7z, .rar"
          onChange={handleInputChange}
        />
        <br /> <br />
        <input type="submit" name="submit" value="wyślij" />
      </form>
      <address>
        <p>
          telefon: <a href="tel:+48730758890">+48 730 758 890</a>
        </p>
        <p>
          mail: <a href="andykrk22@gmail.com">andykrk22@gmail.com</a>
        </p>
      </address>
    </Content>
  );
};

export default Contact;
