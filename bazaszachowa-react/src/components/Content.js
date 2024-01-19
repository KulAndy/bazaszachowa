import React from "react";
const Content = ({
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
