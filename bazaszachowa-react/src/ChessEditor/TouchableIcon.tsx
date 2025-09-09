import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TouchableIconProperties extends React.HTMLProps<HTMLSpanElement> {
  readonly disable?: boolean;
  readonly icon: IconDefinition;
  readonly iconColor?: string;
  readonly onClick: () => void;
}

const TouchableIcon: React.FC<TouchableIconProperties> = ({
  className = "",
  disable = false,
  icon,
  iconColor = "black",
  // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
  onClick = () => {},
  style = {} as const,
  ...properties
}) => {
  if (disable) {
    return (
      <span
        className={`${className} ${iconColor} disabled`}
        style={style}
        {...properties}
      >
        <FontAwesomeIcon color={iconColor} icon={icon} />
      </span>
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      className={`${className} ${iconColor}`}
      onClick={onClick}
      style={style}
      {...properties}
    >
      <FontAwesomeIcon color={iconColor} icon={icon} />
    </span>
  );
};

export default TouchableIcon;
