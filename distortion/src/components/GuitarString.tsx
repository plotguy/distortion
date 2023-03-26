import { useRef, useEffect, useState, useCallback } from "react";
import * as Tone from "tone";

type GuitarStringProps = {
  baseNote: string;
  playMode: string;
  distortion: number;
  volume: number;
  fretKeys: any;
};

const GuitarString = ({
  baseNote,
  playMode,
  distortion,
  volume,
  fretKeys,
}: GuitarStringProps) => {
  const guitarCanvasRef = useRef<any>(null);
  const inputCanvasRef = useRef<any>(null);
  const outputCanvasRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pressedKeyMap, setPressedKeyMap] = useState<Map<string, boolean>>(
    new Map()
  );

  const fretKeyToNote = new Map<string, string>(fretKeys);

  const monoSynthRef = useRef<Tone.MonoSynth | null>(null);
  const volumeRef = useRef<Tone.Volume | null>(null);

  const drawSineWave = (
    analyser: AnalyserNode,
    canvasRef: any,
    input: boolean
  ) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // set up a listener to listen for keyboard events, and when a
    // key in fretKeyToNote is pressed, play the corresponding note
    const keyDownHandler = (e: any) => {
      const note = fretKeyToNote.get(e.key.toUpperCase());
      if (note) {
        setPressedKeyMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(e.key.toUpperCase(), true);
            return newMap;
        });
        monoSynthRef.current?.triggerAttackRelease(note, "4n", "+0.1");
      }
    };
    // Add a new keyUpHandler function
    const keyUpHandler = (e: any) => {
      if (fretKeyToNote.has(e.key.toUpperCase())) {
        // setTimeout
        setTimeout(() => {
        setPressedKeyMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(e.key.toUpperCase(), false);
            return newMap;
        });
        }, 300);
      }
    };

    // register the keyDownHandler listener
    document.addEventListener("keydown", keyDownHandler);
    // register the keyUpHandler listener
    document.addEventListener("keyup", keyUpHandler);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = input ? "#ecf0f1" : "yellow";

      ctx.beginPath();

      const mid = canvas.height / 2;

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;

        let y = v * mid;

        // Reduce the amplitude of y but still make it centered
        // around the middle of the canvas
        if (input) {
          y = (y - mid) * 0.5 + mid;
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, mid);
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  };

  useEffect(() => {
    volumeRef.current = new Tone.Volume(volume).toDestination();
    monoSynthRef.current = new Tone.MonoSynth({
      oscillator: {
        type: "fmsquare5",
        modulationType: "triangle",
        modulationIndex: 2,
        harmonicity: 0.501,
      },
      filter: {
        Q: 1,
        type: "lowpass",
        rolloff: -24,
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 2,
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.8,
        release: 1.5,
        baseFrequency: 50,
        octaves: 4.4,
      },
    }).connect(volumeRef.current);

    // Create a distortion effect
    const distortionEffect = new Tone.Distortion(distortion).toDestination();
    monoSynthRef.current.connect(distortionEffect);

    Tone.Transport.start();
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = 4096;
    monoSynthRef.current.connect(analyser);
    drawSineWave(analyser, inputCanvasRef, true);
    drawSineWave(analyser, outputCanvasRef, false);
    drawString(
      guitarCanvasRef.current,
      guitarCanvasRef.current.getContext("2d"),
      {
        x: 0,
        y: 0,
      }
    );

    return () => {
      monoSynthRef.current?.dispose();
      volumeRef.current?.dispose();
    };
  }, [baseNote, distortion, volume, playMode]);

  const drawString = useCallback(
    (canvas: any, ctx: any, position: any) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      if (isDragging || playMode === "strum") {
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
      ctx.strokeStyle = "#e4e9ed";
      ctx.stroke();
    },
    [isDragging, playMode]
  );

  const handleMouseMove = (e: any) => {
    if (!isDragging && !(playMode === "strum")) return;

    const rect = guitarCanvasRef.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    const ctx = guitarCanvasRef.current.getContext("2d");
    drawString(guitarCanvasRef.current, ctx, { x, y });

    if (playMode === "strum") {
      monoSynthRef.current?.triggerAttackRelease(baseNote, "4n", "+0.05");
    }
  };

  const handleMouseDown = (e: any) => {
    const rect = guitarCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // if the y is not in the middle of the canvas, return
    if (
      y < guitarCanvasRef.current.height / 2 - 10 ||
      y > guitarCanvasRef.current.height / 2 + 10
    )
      return;

    setMousePosition({ x, y });
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    // check if the mouseup is triggered by mouseleave
    if (!isDragging && !(playMode === "strum")) return;
    setIsDragging(false);

    const dragDistance = Math.abs(
      mousePosition.y - guitarCanvasRef.current.height / 2
    );
    const volumePct = dragDistance / 35;

    // map volumeDelta (which goes from 0 to 1) to a scale from -20 to 20
    const volumeDelta = volumePct * 40 - 20;

    if (!(playMode === "strum")) {
      if (volumeRef.current) {
        volumeRef.current.volume.value = volumeDelta;
      }
      monoSynthRef.current?.triggerAttackRelease(baseNote, "4n", "+0.1");
    }
  };

  useEffect(() => {
    const ctx = guitarCanvasRef.current.getContext("2d");
    drawString(guitarCanvasRef.current, ctx, mousePosition);
  }, [isDragging, mousePosition, drawString]);

  return (
    <>
      <div className="flex flex-row">
        {playMode === "fret" && (
          <div className="absolute flex flex-row">
            {fretKeys.map((fret: any, index: number) => {
              const isKeyPressed = pressedKeyMap.get(fret[0]);
              return (
                <div className="flex flex-col">
                  <span
                    key={index}
                    className={`text-white font-mono px-2 ${
                      isKeyPressed ? "text-2xl transition duration-100 text-yellow-400 transition duration-100" : ""
                    }`}
                  >
                    {fret[1]}
                  </span>
                  <div className="text-white mx-2">|</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <canvas
          ref={guitarCanvasRef}
          width="400"
          height="70"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`string-canvas ${
            playMode === "strum" ? "strum-cursor" : "finger-cursor"
          }`}
        ></canvas>
        <canvas
          ref={inputCanvasRef}
          width="300"
          height="70"
          className="string-canvas"
        ></canvas>
        <canvas
          ref={outputCanvasRef}
          width="600"
          height="70"
          className="string-canvas"
        ></canvas>
      </div>
    </>
  );
};

export default GuitarString;
