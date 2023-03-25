import { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

type GuitarStringProps = {
  baseNote: string;
  pick: boolean;
};

const GuitarString = ({ baseNote, pick }: GuitarStringProps) => {
  const canvasRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const monoSynthRef = useRef<Tone.MonoSynth | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);

  useEffect(() => {
    gainRef.current = new Tone.Gain(0).toDestination();
    monoSynthRef.current = new Tone.MonoSynth(
        {
            "oscillator": {
                "type": "fmsquare5",
                "modulationType" : "triangle",
                  "modulationIndex" : 2,
                  "harmonicity" : 0.501
            },
            "filter": {
                "Q": 1,
                "type": "lowpass",
                "rolloff": -24
            },
            "envelope": {
                "attack": 0.01,
                "decay": 0.1,
                "sustain": 0.4,
                "release": 2
            },
            "filterEnvelope": {
                "attack": 0.01,
                "decay": 0.1,
                "sustain": 0.8,
                "release": 1.5,
                "baseFrequency": 50,
                "octaves": 4.4
            }
        }
    ).connect(gainRef.current);

    return () => {
      monoSynthRef.current?.dispose();
      gainRef.current?.dispose();
    };
  }, [baseNote]);

  const drawString = (canvas: any, ctx: any, position: any) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    if (isDragging || pick) {
      ctx.quadraticCurveTo(
        position.x,
        position.y,
        canvas.width,
        canvas.height / 2
      );
    } else {
      ctx.lineTo(canvas.width, canvas.height / 2);
    }

    ctx.lineWidth = 8;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  };

  const handleMouseMove = (e: any) => {
    // console.log('inside mouse move');
    // console.log(isDragging);
    if (!isDragging && !pick) return;

    // console.log("Inside mouse move!");

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(x,y);

    setMousePosition({ x, y });

    const ctx = canvasRef.current.getContext('2d');
    drawString(canvasRef.current, ctx, { x, y });

    const pitchBend = Math.abs(y - canvasRef.current.height / 2);
    const frequency = baseNote // + pitchBend * 2;
    // monoSynthRef.current.frequency.value = frequency;
    if (pick) {
        monoSynthRef.current?.triggerAttackRelease(frequency, "4n", "+0.1");
    }
  };

  const handleMouseDown = (e: any) => {
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // if the y is not in the middle of the canvas, return
    if (y < canvasRef.current.height / 2 - 10 || y > canvasRef.current.height / 2 + 10) return;

    console.log(x,y);

    setMousePosition({ x, y });
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    console.log('inside mouseup!');

    // check if the mouseup is triggered by mouseleave
    if (!isDragging && !pick) return;
    setIsDragging(false);

    const dragDistance = Math.abs(mousePosition.y - canvasRef.current.height / 2);
    const volume = Math.min(dragDistance / 100, 1);
    if (gainRef.current) {
        gainRef.current.gain.value = volume;
    }
    if (!pick) {
        monoSynthRef.current?.triggerAttackRelease(baseNote, "4n", "+0.1");
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawString(canvasRef.current, ctx, mousePosition);
  }, [isDragging, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height="70"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="string-canvas"
    ></canvas>
  );
};

export default GuitarString;