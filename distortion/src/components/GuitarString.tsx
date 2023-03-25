import { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

type GuitarStringProps = {
  baseNote: string;
  strum: boolean;
  distortion: number;
  volume: number;
};

const GuitarString = ({ baseNote, strum, distortion, volume }: GuitarStringProps) => {
  const canvasRef = useRef<any>(null);
  const outputCanvasRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const monoSynthRef = useRef<Tone.MonoSynth | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);


  const drawSineWave = (analyser: AnalyserNode) => {
    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 50, 0, 0.3)';

      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  };

  useEffect(() => {
    gainRef.current = new Tone.Gain(volume).toDestination();
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

    // Create a distortion effect
    const distortionEffect = new Tone.Distortion(distortion).toDestination();
    monoSynthRef.current.connect(distortionEffect);

    Tone.Transport.start();
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = 4096;
    monoSynthRef.current.connect(analyser);
    drawSineWave(analyser);
    drawString(canvasRef.current, canvasRef.current.getContext('2d'), {
        x: 0,
        y: 0,
    });

    return () => {
      monoSynthRef.current?.dispose();
      gainRef.current?.dispose();
    };
  }, [baseNote, distortion, volume, strum]);

  const drawString = (canvas: any, ctx: any, position: any) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    if (isDragging || strum) {
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
    if (!isDragging && !strum) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    const ctx = canvasRef.current.getContext('2d');
    drawString(canvasRef.current, ctx, { x, y });

    if (strum) {
        monoSynthRef.current?.triggerAttackRelease(baseNote, "4n", "+0.05");
    }
  };

  const handleMouseDown = (e: any) => {
  
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // if the y is not in the middle of the canvas, return
    if (y < canvasRef.current.height / 2 - 10 || y > canvasRef.current.height / 2 + 10) return;


    setMousePosition({ x, y });
    setIsDragging(true);
  };

  const handleMouseUp = () => {

    // check if the mouseup is triggered by mouseleave
    if (!isDragging && !strum) return;
    setIsDragging(false);

    const dragDistance = Math.abs(mousePosition.y - canvasRef.current.height / 2);
    const volume = Math.min(dragDistance / 100, 1);
    if (gainRef.current) {
        gainRef.current.gain.value = volume;
    }
    if (!strum) {
        monoSynthRef.current?.triggerAttackRelease(baseNote, "4n", "+0.1");
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawString(canvasRef.current, ctx, mousePosition);
  }, [isDragging, mousePosition]);

  return (
    <div className="flex flex-row">
    <canvas
      ref={canvasRef}
      width="500"
      height="70"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`string-canvas ${ strum ? 'strum-cursor' : 'finger-cursor'}`}
    ></canvas>
    <canvas
      ref={outputCanvasRef}
      width="500"
      height="70"
      className="string-canvas"
    ></canvas>
    </div>
  );
};

export default GuitarString;