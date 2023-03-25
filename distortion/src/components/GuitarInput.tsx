import { useState } from "react";
import GuitarString from "./GuitarString";
import Pedal from "./Pedal";



const GuitarInput = () => {

    const [pick, setPick] = useState<boolean>(false);
    const [cursor, setCursor] = useState<string>('pointer');

    const [distortion, setDistortion] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);

    const handlePickChange = () => {

        if (pick) {
            setCursor('auto');
        } else {
            setCursor('grab');

        }
        setPick(!pick);
    }

    return (
    <div style={{ cursor: cursor }}>
        <div className="absolute w-1/6 left-[42%]">
        <Pedal distortion={distortion} volume={volume} setDistortion={setDistortion} setVolume={setVolume} />
        </div>
    <button onClick={handlePickChange}>Pick {pick ? 'on' : 'off'}</button>
    <div className="flex flex-col">
        <GuitarString baseNote={"E2"} pick={pick} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"A3"} pick={pick} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"D3"} pick={pick} distortion={distortion} volume={volume} />
        <GuitarString baseNote={"G3"} pick={pick} distortion={distortion} volume={volume} />

    </div>
    </div>
    );
};

export default GuitarInput;