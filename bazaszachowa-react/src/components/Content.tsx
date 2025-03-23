import React from "react";

interface ContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  contentId?: string;
  classNames?: string[];
}

const Content: React.FC<ContentProps> = ({
  children,
  contentId = "content",
  classNames = [],
  ...props
}) => {
  return (
    <div id={contentId} className={classNames.join(" ")} {...props}>
      {children}
    </div>
  );
};

export default Content;
