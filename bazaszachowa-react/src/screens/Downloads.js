import { API } from "../settings";
import Content from "../components/Content";

const Downloads = () => {
  return (
    <Content>
      <ul>
        Baza
        <li>
          <a
            href={`${API.BASE_URL}${API.base_download}poland`}
            download="GigaBaza.pgn.gz"
          >
            Polska
          </a>{" "}
          (ok 150 MB)
        </li>
        <li>
          <a
            href={`${API.BASE_URL}${API.base_download}all`}
            download="TeraBaza.pgn.gz"
          >
            całość
          </a>{" "}
          (ok 2,5 GB)
        </li>
      </ul>
    </Content>
  );
};

export default Downloads;
