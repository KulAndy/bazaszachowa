import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface TouchableIconProps extends React.HTMLProps<HTMLSpanElement> {
  disable?: boolean;
  icon: IconDefinition;
  iconColor?: string;
  onClick: () => void;
}

const TouchableIcon: React.FC<TouchableIconProps> = ({
  className = "",
  disable = false,
  icon,
  iconColor = "black",
  onClick = () => {},
  style = {},
  ...props
}) => {
  if (disable) {
    return (
      <span
        className={`${className} ${iconColor} disabled`}
        style={style}
        {...props}
      >
        <FontAwesomeIcon color={iconColor} icon={icon} />
      </span>
    );
  } else {
    return (
      <span
        className={`${className} ${iconColor}`}
        onClick={onClick}
        style={style}
        {...props}
      >
        <FontAwesomeIcon color={iconColor} icon={icon} />
      </span>
    );
  }
};

export default TouchableIcon;
