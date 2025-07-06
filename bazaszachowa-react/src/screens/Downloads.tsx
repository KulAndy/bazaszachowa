import Content from "../components/Content";
import React, { useState, useEffect } from "react";
import { API } from "../settings";

interface Dump {
  name: string;
  webViewLink: string;
  modifiedTime: string;
  size: string;
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
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const Downloads = () => {
  const [dumps, setDumps] = useState<Dump[]>([]);
  useEffect(() => {
    fetch(API.BASE_URL + API.dumps)
      .then((response) => response.json())
      .then(setDumps);
  }, []);

  return (
    <Content>
      Baza
      <ul>
        {dumps.map((item) => (
          <li>
            <p>
              <a href={item.webViewLink}>{item.name}</a>{" "}
              {formatFileSize(parseInt(item.size) || 0)}
            </p>
            <p>Ostatnia modyfikacja: {formatDate(item.modifiedTime)} </p>
          </li>
        ))}
      </ul>
      Narzędzia
      <ul>
        <li>
          <a href="https://github.com/KulAndy/chess-scrappers">Szperacze</a>
        </li>
      </ul>
    </Content>
  );
};

export default Downloads;
