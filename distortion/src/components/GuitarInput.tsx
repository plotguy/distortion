import { useState } from "react";
import GuitarString from "./GuitarString";
import Pedal from "./Pedal";
import "react-toggle/style.css" // for ES6 modules
import RadioButton from "./RadioButton";

const GuitarInput = () => {

    const [playMode, setPlayMode] = useState<"strum" | "single">("single");
    const [on, turnOn] = useState<boolean>(true);

    const handleToggle = () => {
        turnOn(!on);
    }
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

    </div>
    <div className="flex flex-col">
        <GuitarString baseNote={"E2"} strum={playMode === "strum"} distortion={activeDistortion} volume={activeVolume} />
        <GuitarString baseNote={"A3"} strum={playMode === "strum"} distortion={activeDistortion} volume={activeVolume} />
        <GuitarString baseNote={"D3"} strum={playMode === "strum"} distortion={activeDistortion} volume={activeVolume} />
        <GuitarString baseNote={"G3"} strum={playMode === "strum"} distortion={activeDistortion} volume={activeVolume} />

    </div>
    </div>
    );
};

export default GuitarInput;