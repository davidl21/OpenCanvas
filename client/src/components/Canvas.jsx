import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ColorPicker from "./ColorPicker";

const Canvas = () => {
  const canvasRef = useRef(null);
  // default black
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const gridSize = 1000;
  const pixelSize = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const draw = (x, y) => {
      console.log(color);
      context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      console.log(`rgb(${color.r}, ${color.g}, ${color.b})`);
      context.fillRect(x, y, pixelSize, pixelSize);
    };

    const handleMouseDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(x, y);
      const gridX = Math.floor(x / gridSize) * gridSize;
      const gridY = Math.floor(y / gridSize) * gridSize;

      // Snap to 5x5 grid within the 1000x1000 grid
      const snappedX =
        Math.floor((x % gridSize) / pixelSize) * pixelSize + gridX;
      const snappedY =
        Math.floor((y % gridSize) / pixelSize) * pixelSize + gridY;
      console.log(gridX, gridY);
      draw(snappedX, snappedY);
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
        width={gridSize}
        height={gridSize}
        className="border border-orange-300 rounded-3xl"
      />
      <ColorPicker onColorChange={setColor} />
    </div>
  );
};

export default Canvas;
