import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownFileReader = ({ filePath }: { filePath: string }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    const fetchMarkdownFile = async () => {
      const response = await fetch(filePath);
      const markdownText = await response.text();
      setMarkdownContent(markdownText);
    };

    fetchMarkdownFile();
  }, [filePath]);

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownFileReader;
