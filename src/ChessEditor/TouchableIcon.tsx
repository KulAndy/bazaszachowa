import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { noop } from "es-toolkit";

interface TouchableIconProperties extends React.HTMLProps<HTMLSpanElement> {
  readonly disable?: boolean;
  readonly icon: FontAwesomeIconProps["icon"];
  readonly iconColor?: string;
  readonly onClick: () => void;
}

const TouchableIcon: React.FC<TouchableIconProperties> = ({
  className = "",
  disable = false,
  icon,
  iconColor = "black",
  onClick = noop,
  ...properties
}) => {
  if (disable) {
    return (
      <span className={`${className} ${iconColor} disabled`} {...properties}>
        <FontAwesomeIcon color={iconColor} icon={icon} />
      </span>
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      className={`${className} ${iconColor}`}
      onClick={onClick}
      {...properties}
    >
      <FontAwesomeIcon color={iconColor} icon={icon} />
    </span>
  );
};

export default TouchableIcon;
