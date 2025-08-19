import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Content from "../components/Content";
import MarkdownFileReader from "../components/MarkdownFileReader";
import { NOMENU_URLS } from "../settings";

const Docs = () => {
  const { file } = useParams();
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/fileList.json");
      const data = (await response.json()) as string[];
      setFileList(data);
    };

    fetchData();
  }, []);

  if (file !== undefined && file !== null) {
    return (
      <Content style={{ width: "100%" }}>
        <MarkdownFileReader filePath={`/docs/${file}`} />
      </Content>
    );
  } else {
    return (
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
  }
};

export default Docs;
