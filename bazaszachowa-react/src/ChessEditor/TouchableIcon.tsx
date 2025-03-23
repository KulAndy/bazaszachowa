import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface TouchableIconProps extends React.HTMLProps<HTMLSpanElement> {
  icon: IconDefinition;
  onClick: () => void;
  iconColor?: string;
  disable?: boolean;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({
  icon,
  onClick = () => {},
  style = {},
  iconColor = "black",
  disable = false,
  className = "",
  ...props
}) => {
  if (disable) {
    return (
      <span
        style={style}
        className={className + " " + iconColor + " disabled"}
        {...props}
      >
        <FontAwesomeIcon icon={icon} color={iconColor} />
      </span>
    );
  } else {
    return (
      <span
        onClick={onClick}
        style={style}
        className={className + " " + iconColor}
        {...props}
      >
        <FontAwesomeIcon icon={icon} color={iconColor} />
      </span>
    );
  }
};

export default TouchableIcon;
