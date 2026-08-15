import { useParams } from "react-router-dom";

import Content from "../components/app/Content";
import Markdown from "../components/app/Markdown";
import { useI18n } from "../context/useI18n";
import { NOMENU_URLS } from "../settings";

const fileList = ["API", "code_struct", "base"];

const Documentation = () => {
  const { file } = useParams();
  const { t } = useI18n();

  return (
    <Content>
      <ul>
        {fileList.map((element) => (
          <li key={element}>
            <a href={`${NOMENU_URLS.docs}${element}`}>{t(`docs.${element}`)}</a>
          </li>
        ))}
      </ul>
      {file ? (
        <>
          <hr />
          <Markdown screen="docs" section={file} />
        </>
      ) : null}
    </Content>
  );
};

export default Documentation;
