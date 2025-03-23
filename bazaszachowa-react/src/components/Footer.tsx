import { admin_mail } from "../settings";

const Footer = () => {
  return (
    <footer>
      <p>
        Chętni mogą dorzucić się do hostingu:{" "}
        <a href="https://zrzutka.pl/z/bazaszachowa">zrzutka</a>
      </p>
      <hr />
      <p>
        <address>
          <span className="copyleft">©</span>
          <a href={`mailto:${admin_mail}`}>Andrzej Kulesza</a>
          {" " + new Date().getFullYear()}
        </address>
      </p>
    </footer>
  );
};

export default Footer;
