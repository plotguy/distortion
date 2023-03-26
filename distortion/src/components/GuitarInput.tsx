import { useState } from "react";
import GuitarString from "./GuitarString";
import Pedal from "./Pedal";
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
import RadioButton from "./RadioButton";

const GuitarInput = () => {

    const [playMode, setPlayMode] = useState<"strum" | "single">("strum");

    const radioChangeHandler = (e: any) => {
        setPlayMode(e.target.value);
      };

    const [distortion, setDistortion] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);

    return (
    <div>
        <div className="absolute w-1/6 left-[42%]">
        <Pedal distortion={distortion} volume={volume} setDistortion={setDistortion} setVolume={setVolume} />
        </div>
    
    <div className="">
    <RadioButton
          changed={radioChangeHandler}
          id="1"
          isSelected={playMode === "strum"}
          label="👋🏼 Strum mode"
          value="strum"
        />

        <RadioButton
          changed={radioChangeHandler}
          id="2"
          isSelected={playMode === "single"}
          label="👆🏼 Finger picking mode"
          value="single"
        />
    </div>
    <div className="flex flex-col">
        <GuitarString baseNote={"E2"} strum={playMode === "strum"} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"A3"} strum={playMode === "strum"} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"D3"} strum={playMode === "strum"} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"G3"} strum={playMode === "strum"} distortion={distortion} volume={volume} />

    </div>
    </div>
    );
};

export default GuitarInput;