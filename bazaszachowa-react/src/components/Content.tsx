import React from "react";

interface ContentProperties extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  classNames?: string[];
  contentId?: string;
}

const Content: React.FC<ContentProperties> = ({
  children,
  classNames = [],
  contentId = "content",
  ...properties
}) => {
  return (
    <div className={classNames.join(" ")} id={contentId} {...properties}>
      {children}
    </div>
  );
};

export default Content;
