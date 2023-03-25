import { useEffect, useRef, useState } from "react";
import { HighContrast } from 'react-dial-knob'


interface KnobProps {
    label: string;
    value: number;
    setValue: (value: number) => void;
}

const Knob = ({ label, value, setValue } : KnobProps) => {
    // create a circular div using tailwind css

    const onValueChange = (value: number) => {
        setValue(value);
    }

    return (
    <div className="flex flex-col items-center mx-8 font-mono">
        <HighContrast theme={{
            defaultColor: 'black',
            activeColor: 'black',
        }} diameter={50} min={-50} max={50} step={1} value={value} onValueChange={onValueChange} />
        {label}

        </div>
    )
}


interface ToggleSwitchProps {
    on: boolean;
    turnOn: () => void;
}

const ToggleSwitch = ({ on, turnOn } : ToggleSwitchProps) => {
    // create an on/off switch using tailwind css
    return (
    <>
    <div className="mt-16 flex flex-col items-center">
        <div className={`h-4 w-4 mb-4 rounded-full ${on ? 'bg-red-500' : 'bg-gray-400'} border border-black`}></div>
    <button 
    onClick={turnOn}
    className={`h-12 w-12 rounded-full ${on ? 'bg-gray-500' : 'bg-gray-300'} border border-gray-700 hover:bg-gray-400`}></button>
    </div>
    </>
    )
}

interface PedalProps {
    distortion: number;
    volume: number;
    setVolume: (value: number) => void;
    setDistortion: (value: number) => void;
}

const Pedal = ({ distortion, volume, setVolume, setDistortion } : PedalProps) => {
    const [on, turnOn] = useState(false);

    const handleToggle = () => {
        turnOn(!on);
    }
    return (
        <div className="flex flex-col items-center bg-yellow-400 p-8">
        <div className="flex flex-row">
            <Knob label={'Output'} value={volume} setValue={setVolume} />
            <Knob label={'Distortion'} value={distortion} setValue={setDistortion} />
        </div>
        <div className="h-48"></div>
        <ToggleSwitch on={on} turnOn={handleToggle} />
        </div>
    )
}


export default Pedal;