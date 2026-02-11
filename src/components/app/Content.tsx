interface ContentProperties extends React.HTMLProps<HTMLDivElement> {
  readonly children: React.ReactNode;
  readonly classNames?: readonly string[];
  readonly contentId?: string;
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
