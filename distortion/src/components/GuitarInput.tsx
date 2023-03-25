import { useState } from "react";
import GuitarString from "./GuitarString";



const GuitarInput = () => {

    const [pick, setPick] = useState<boolean>(false);
    const [cursor, setCursor] = useState<string>('pointer');

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
    <button onClick={handlePickChange}>Pick {pick ? 'on' : 'off'}</button>
    <div className="flex flex-col">
        <GuitarString baseNote={"E2"} pick={pick} />
        <GuitarString baseNote={"A3"} pick={pick} />
        <GuitarString baseNote={"D3"} pick={pick} />
        <GuitarString baseNote={"G3"} pick={pick} />

    </div>
    </div>
    );
};

export default GuitarInput;