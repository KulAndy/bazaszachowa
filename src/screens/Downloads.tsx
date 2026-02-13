import { useEffect, useState } from "react";

import Content from "../components/app/Content";
import { useI18n } from "../context/useI18n";
import { API } from "../settings";

interface Dump {
  description: string;
  modifiedTime: string;
  name: string;
  size: string;
  webViewLink: string;
}

const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, index)).toFixed(2))} ${sizes[index]}`;
};

const Downloads = () => {
  const { t } = useI18n();
  const [dumps, setDumps] = useState<Dump[]>([]);
  useEffect(() => {
    void fetch(API.BASE_URL + API.dumps)
      .then((response) => response.json())
      .then(setDumps);
  }, []);

  return (
    <Content>
      {t("base")}
      <ul>
        {dumps.map((item) => (
          <li key={item.name}>
            <p>
              <a href={item.webViewLink}>{item.name}</a>
              {` - ${item.description}, `}
              {formatFileSize(Number.parseInt(item.size) || 0)}
            </p>
            <p>
              {t("download.modified")}: {formatDate(item.modifiedTime)}{" "}
            </p>
          </li>
        ))}
      </ul>
      {t("download.tools")}
      <ul>
        <li>
          <a href="https://github.com/KulAndy/chess-scrappers">
            {t("download.scrappers")}
          </a>
        </li>
      </ul>
      <p>
        <a href="https://github.com/KulAndy/bazaszachowa/tree/react/src/i18n">
          {t("download.translation")}
        </a>
      </p>
      <p>{t("download.translation_info")}</p>
    </Content>
  );
};

export default Downloads;
