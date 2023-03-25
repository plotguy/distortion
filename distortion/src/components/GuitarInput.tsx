import { useState } from "react";
import GuitarString from "./GuitarString";
import Pedal from "./Pedal";



const GuitarInput = () => {

    const [strum, setStrum] = useState<boolean>(false);

    const [distortion, setDistortion] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);

    const handleStrumChange = () => {
        setStrum(!strum);
    }

    return (
    <div>
        <div className="absolute w-1/6 left-[42%]">
        <Pedal distortion={distortion} volume={volume} setDistortion={setDistortion} setVolume={setVolume} />
        </div>
    <button onClick={handleStrumChange}>Strum {strum ? 'on' : 'off'}</button>
    <div className="flex flex-col">
        <GuitarString baseNote={"E2"} strum={strum} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"A3"} strum={strum} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"D3"} strum={strum} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"G3"} strum={strum} distortion={distortion} volume={volume} />

    </div>
    </div>
    );
};

export default GuitarInput;