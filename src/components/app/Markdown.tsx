import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

import { useI18n } from "../../context/useI18n";

const markdownFiles = import.meta.glob("/src/i18n/markdowns/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

interface Properties {
  readonly screen: string;
  readonly section?: string;
}

const rehypePlugins = [rehypeKatex];
const remarkPlugins = [remarkMath];

const Markdown = ({ screen, section = "main" }: Properties) => {
  const { locale } = useI18n();

  const localeCode = locale.split("-")[0].toLowerCase();

  const path = `/src/i18n/markdowns/${localeCode}/${screen}/${section}.md`;
  const fallbackPath = `/src/i18n/markdowns/en/${screen}/${section}.md`;

  const content = markdownFiles[path] ?? markdownFiles[fallbackPath];

  if (!content) {
    console.error(`Markdown file not found: ${path}`);
    return null;
  }

  return (
    <ReactMarkdown rehypePlugins={rehypePlugins} remarkPlugins={remarkPlugins}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
