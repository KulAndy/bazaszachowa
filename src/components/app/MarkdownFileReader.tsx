import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownFileReader = ({ filePath }: { readonly filePath: string }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    const fetchMarkdownFile = async () => {
      const response = await fetch(filePath);
      const markdownText = await response.text();
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
