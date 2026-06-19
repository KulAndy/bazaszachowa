import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Content from "../components/app/Content";
import MarkdownFileReader from "../components/app/MarkdownFileReader";
import { NOMENU_URLS } from "../settings";

const Documentation = () => {
  const { file } = useParams();
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/fileList.json");
      const data = response.data as string[];
      setFileList(data);
    };

    void fetchData();
  }, []);

  return file !== undefined && file !== null ? (
    <Content style={{ overflow: "auto", width: "100%" } as const}>
      <MarkdownFileReader filePath={`/docs/${file}`} />
    </Content>
  ) : (
    <Content>
      <ul>
        {fileList.map((element) => (
          <li key={element}>
            <Link to={NOMENU_URLS.docs + element}>{element}</Link>
          </li>
        ))}
      </ul>
    </Content>
  );
};

export default Documentation;
