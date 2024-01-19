import React, { useEffect } from "react";
import {
  faCircleHalfStroke,
  faBackwardFast,
  faBackwardStep,
  faCirclePlay,
  faCircleStop,
  faForwardStep,
  faForwardFast,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faDownload,
  faFish,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import TouchableIcon from "./TouchableIcon";

const ButtonsBar = ({
  flip = () => {},
  playing,
  setPlaying,
  width,
  isFirst = true,
  isLast = true,
  firstMove = () => {},
  prevMove = () => {},
  nextMove = () => {},
  lastMove = () => {},
  download = () => {},
  zoomIn = () => {},
  zoomOut = () => {},
  notationSwitch = false,
  notationLayout = "column",
  setNotationLayout = () => {},
}) => {
  const activeIconColor = "black";
  const inactiveIconColor = "gray";

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "f":
            flip();
            e.preventDefault();
            break;
          case "r":
            window.location.reload();
            break;
          case "s":
            download();
            e.preventDefault();
            break;
          case "p":
            setPlaying(!playing);
            e.preventDefault();
            break;
          case "+":
            zoomIn();
            e.preventDefault();
            break;
          case "-":
            zoomOut();
            e.preventDefault();
            break;
          default:
            break;
        }
      } else {
        switch (e.code) {
          case "ArrowLeft":
            prevMove();
            e.preventDefault();
            break;
          case "ArrowDown":
            firstMove();
            e.preventDefault();
            break;
          case "ArrowRight":
            nextMove();
            e.preventDefault();
            break;
          case "ArrowUp":
            lastMove();
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: width,
        marginBottom: 15,
        marginTop: 15,
      }}
      className="black"
    >
      <TouchableIcon
        onClick={flip}
        icon={faCircleHalfStroke}
        iconColor={activeIconColor}
        className="control"
        title="CTRL + F"
      />
      <TouchableIcon
        onClick={firstMove}
        icon={faBackwardFast}
        iconColor={isFirst ? inactiveIconColor : activeIconColor}
        disable={isFirst}
        className="control"
        title="↓"
      />
      <TouchableIcon
        onClick={prevMove}
        icon={faBackwardStep}
        iconColor={isFirst ? inactiveIconColor : activeIconColor}
        disable={isFirst}
        className="control"
        title="←"
      />
      <TouchableIcon
        onClick={setPlaying}
        icon={playing ? faCircleStop : faCirclePlay}
        iconColor={activeIconColor}
        className="control"
        title="CTRL + P"
      />
      <TouchableIcon
        onClick={nextMove}
        icon={faForwardStep}
        iconColor={isLast ? inactiveIconColor : activeIconColor}
        disable={isLast}
        className="control"
        title="→"
      />
      <TouchableIcon
        onClick={lastMove}
        icon={faForwardFast}
        iconColor={isLast ? inactiveIconColor : activeIconColor}
        disable={isLast}
        className="control"
        title="↑"
      />
      <TouchableIcon icon={faDownload} className="control" onClick={download} />
      <TouchableIcon
        icon={faMagnifyingGlassMinus}
        className="control"
        onClick={zoomOut}
      />
      <TouchableIcon
        icon={faMagnifyingGlassPlus}
        className="control"
        onClick={zoomIn}
      />
      <>
        {notationSwitch && (
          <TouchableIcon
            icon={notationLayout === "none" ? faFileLines : faFish}
            className="control switchNotation"
            onClick={() => {
              setNotationLayout(
                notationLayout === "none"
                  ? window.innerHeight > window.innerWidth
                    ? "bottom"
                    : "right"
                  : "none"
              );
            }}
          />
        )}
      </>
    </div>
  );
};

export default ButtonsBar;
