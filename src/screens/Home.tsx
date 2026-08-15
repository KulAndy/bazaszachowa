import Content from "../components/app/Content";
import Markdown from "../components/app/Markdown";
import logo from "../logo.svg";
import "../styles/Home.scss";

const Home = () => {
  return (
    <div id="home">
      <Content classNames={["float-left"] as const} contentId="left-content">
        <Markdown screen="home" section="left" />
      </Content>

      <Content classNames={["float-left"] as const}>
        <img alt="Logo" id="logo" src={logo} />
      </Content>

      <Content classNames={["float-left"] as const} contentId="right-content">
        <article>
          <Markdown screen="home" />
        </article>
      </Content>
    </div>
  );
};

export default Home;
