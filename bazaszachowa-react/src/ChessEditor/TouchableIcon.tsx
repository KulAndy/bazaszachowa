/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface TouchableIconProperties extends React.HTMLProps<HTMLSpanElement> {
  disable?: boolean;
  icon: IconDefinition;
  iconColor?: string;
  onClick: () => void;
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
