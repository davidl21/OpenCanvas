import React, { useEffect, useRef } from "react";
import axios from "axios";

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const draw = (x, y) => {
      context.fillStyle = "black";

      // adjust rectangle fill size
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
  }, []);

  return (
    <div className="mt-10 flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="border border-orange-300 rounded-3xl"
      />
    </div>
  );
};

export default Canvas;
