import { admin_mail } from "../settings";

const Footer = () => {
  return (
    <footer>
      <address>
        <span className="copyleft">©</span>
        <a href={`mailto:${admin_mail}`}>Andrzej Kulesza</a>
        {" " + new Date().getFullYear()}
      </address>
    </footer>
  );
};

export default Footer;
