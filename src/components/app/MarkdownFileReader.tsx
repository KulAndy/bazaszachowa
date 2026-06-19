import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownFileReader = ({ filePath }: { readonly filePath: string }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    const fetchMarkdownFile = async () => {
      const response: AxiosResponse<string> = await axios.get(filePath, {
        responseType: "text",
      });

      const markdownText = response.data;
      setMarkdownContent(markdownText);
    };

    void fetchMarkdownFile();
  }, [filePath]);

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm] as const}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownFileReader;
