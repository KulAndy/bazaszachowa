import React from "react";

interface ContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  classNames?: string[];
  contentId?: string;
}

const Content: React.FC<ContentProps> = ({
  children,
  classNames = [],
  contentId = "content",
  ...props
}) => {
  return (
    <div className={classNames.join(" ")} id={contentId} {...props}>
      {children}
    </div>
  );
};

export default Content;
