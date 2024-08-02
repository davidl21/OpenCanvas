import React, { useEffect, useRef } from "react";
import axios from "axios";

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // You can add your canvas drawing code here
  }, []);

  return (
    <div className="mt-10 flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="border border-orange-300 rounded-md"
      />
    </div>
  );
};

export default Canvas;
