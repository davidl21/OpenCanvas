import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ColorPicker from "./ColorPicker";

const Canvas = () => {
  const canvasRef = useRef(null);
  // default black
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const draw = (x, y) => {
      console.log(color);
      context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      console.log(`rgb(${color.r}, ${color.g}, ${color.b})`);
      context.fillRect(x, y, 5, 5);
    };

    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      draw(x, y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [color]);

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="border border-orange-300 rounded-3xl"
      />
      <ColorPicker onColorChange={setColor} />
    </div>
  );
};

export default Canvas;
