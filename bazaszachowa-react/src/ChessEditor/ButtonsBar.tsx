import {
  faBackwardFast,
  faBackwardStep,
  faCircleHalfStroke,
  faCirclePlay,
  faCircleStop,
  faDownload,
  faFileLines,
  faFish,
  faForwardFast,
  faForwardStep,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";

import TouchableIcon from "./TouchableIcon";

interface ButtonsBarProperties {
  download: () => void;
  firstMove: () => void;
  flip: () => void;
  isFirst: boolean;
  isLast: boolean;
  lastMove: () => void;
  nextMove: () => void;
  notationLayout: string;
  notationSwitch: boolean;
  playing: boolean;
  prevMove: () => void;
  setNotationLayout: (x: string) => void;
  setPlaying: () => void;
  width: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ButtonsBar: React.FC<ButtonsBarProperties> = ({
  download = () => {},
  firstMove = () => {},
  flip = () => {},
  isFirst = true,
  isLast = true,
  lastMove = () => {},
  nextMove = () => {},
  notationLayout = "column",
  notationSwitch = false,
  playing,
  prevMove: previousMove = () => {},
  setNotationLayout = () => {},
  setPlaying,
  width,
  zoomIn = () => {},
  zoomOut = () => {},
}) => {
  const activeIconColor = "black";
  const inactiveIconColor = "gray";

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case "-": {
            zoomOut();
            event.preventDefault();
            break;
          }
          case "+": {
            zoomIn();
            event.preventDefault();
            break;
          }
          case "f": {
            flip();
            event.preventDefault();
            break;
          }
          case "p": {
            setPlaying();
            event.preventDefault();
            break;
          }
          case "r": {
            globalThis.location.reload();
            break;
          }
          case "s": {
            download();
            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      } else {
        switch (event.code) {
          case "ArrowDown": {
            firstMove();
            event.preventDefault();
            break;
          }
          case "ArrowLeft": {
            previousMove();
            event.preventDefault();
            break;
          }
          case "ArrowRight": {
            nextMove();
            event.preventDefault();
            break;
          }
          case "ArrowUp": {
            lastMove();
            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      }
    };

    globalThis.addEventListener("keydown", handleKeyPress);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    download,
    firstMove,
    flip,
    lastMove,
    nextMove,
    playing,
    previousMove,
    setPlaying,
    zoomIn,
    zoomOut,
  ]);

  return (
    <div
      className="black"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 15,
        marginTop: 15,
        width: width,
      }}
    >
      <TouchableIcon
        className="control"
        icon={faCircleHalfStroke}
        iconColor={activeIconColor}
        onClick={flip}
        title="CTRL + F"
      />
      <TouchableIcon
        className="control"
        disable={isFirst}
        icon={faBackwardFast}
        iconColor={isFirst ? inactiveIconColor : activeIconColor}
        onClick={firstMove}
        title="↓"
      />
      <TouchableIcon
        className="control"
        disable={isFirst}
        icon={faBackwardStep}
        iconColor={isFirst ? inactiveIconColor : activeIconColor}
        onClick={previousMove}
        title="←"
      />
      <TouchableIcon
        className="control"
        icon={playing ? faCircleStop : faCirclePlay}
        iconColor={activeIconColor}
        onClick={setPlaying}
        title="CTRL + P"
      />
      <TouchableIcon
        className="control"
        disable={isLast}
        icon={faForwardStep}
        iconColor={isLast ? inactiveIconColor : activeIconColor}
        onClick={nextMove}
        title="→"
      />
      <TouchableIcon
        className="control"
        disable={isLast}
        icon={faForwardFast}
        iconColor={isLast ? inactiveIconColor : activeIconColor}
        onClick={lastMove}
        title="↑"
      />
      <TouchableIcon className="control" icon={faDownload} onClick={download} />
      <TouchableIcon
        className="control"
        icon={faMagnifyingGlassMinus}
        onClick={zoomOut}
      />
      <TouchableIcon
        className="control"
        icon={faMagnifyingGlassPlus}
        onClick={zoomIn}
      />
      <>
        {notationSwitch && (
          <TouchableIcon
            className="control switchNotation"
            icon={notationLayout === "none" ? faFileLines : faFish}
            onClick={() => {
              setNotationLayout(
                notationLayout === "none"
                  ? window.innerHeight > window.innerWidth
                    ? "bottom"
                    : "right"
                  : "none",
              );
            }}
          />
        )}
      </>
    </div>
  );
};

export default ButtonsBar;
