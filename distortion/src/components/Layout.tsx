import { useState } from "react";
import GuitarString from "./GuitarString";
import Pedal from "./Pedal";
import "react-toggle/style.css"; // for ES6 modules
import RadioButton from "./RadioButton";

const GuitarInput = () => {
  const [playMode, setPlayMode] = useState<"strum" | "single" | "fret">(
    "single"
  );
  const [on, turnOn] = useState<boolean>(true);

  const handleToggle = () => {
    turnOn(!on);
  };
  const radioChangeHandler = (e: any) => {
    setPlayMode(e.target.value);
  };

  const [distortion, setDistortion] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  const activeDistortion = on ? distortion : 0;
  const activeVolume = on ? volume : 0;

  return (
    <div>
      <div className="absolute w-1/6 left-[50%]">
        <Pedal
          distortion={distortion}
          volume={volume}
          setDistortion={setDistortion}
          setVolume={setVolume}
          handleToggle={handleToggle}
          on={on}
        />
      </div>

      <div>
        <RadioButton
          changed={radioChangeHandler}
          id="2"
          isSelected={playMode === "single"}
          label="👆🏼 Finger picking mode"
          value="single"
        />
        <RadioButton
          changed={radioChangeHandler}
          id="1"
          isSelected={playMode === "strum"}
          label="👋🏼 Strum mode"
          value="strum"
        />
        <RadioButton
          changed={radioChangeHandler}
          id="3"
          isSelected={playMode === "fret"}
          label="🎸 Fret mode"
          value="fret"
        />
      </div>
      <div className="flex flex-col mt-4">
        <GuitarString
          baseNote={"E2"}
          playMode={playMode}
          distortion={activeDistortion}
          volume={activeVolume}
          fretKeys={[
            ["1", "E2"],
            ["2", "F2"],
            ["3", "G2"],
            ["4", "A2"],
            ["5", "B2"],
            ["6", "C3"],
            ["7", "D3"],
            ["8", "E3"],
            ["9", "F3"],
            ["0", "G3"],
          ]}
        />
        <GuitarString
          baseNote={"A3"}
          playMode={playMode}
          distortion={activeDistortion}
          volume={activeVolume}
          fretKeys={[
            ["Q", "A3"],
            ["W", "B3"],
            ["E", "C4"],
            ["R", "D4"],
            ["T", "E4"],
            ["Y", "F4"],
            ["U", "G4"],
            ["I", "A4"],
            ["O", "B4"],
            ["P", "C5"],
          ]}
        />
        <GuitarString
          baseNote={"D3"}
          playMode={playMode}
          distortion={activeDistortion}
          volume={activeVolume}
          fretKeys={[
            ["A", "D3"],
            ["S", "E3"],
            ["D", "F3"],
            ["F", "G3"],
            ["G", "A3"],
            ["H", "B3"],
            ["J", "C4"],
            ["K", "D4"],
            ["L", "E4"],
          ]}
        />
        <GuitarString
          baseNote={"G3"}
          playMode={playMode}
          distortion={activeDistortion}
          volume={activeVolume}
          fretKeys={[
            ["Z", "G3"],
            ["X", "A3"],
            ["C", "B3"],
            ["V", "C4"],
            ["B", "D4"],
            ["N", "E4"],
            ["M", "F4"],
          ]}
        />
      </div>
    </div>
  );
};

export default GuitarInput;
