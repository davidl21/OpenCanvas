import React, { useState } from "react";
import { SketchPicker, HuePicker } from "react-color";

const ColorPicker = ({ onColorChange }) => {
  // default black
  const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 1 });

  const handleChangeComplete = (newColor) => {
    console.log("Changed color.");
    console.log(newColor.rgb);
    setColor(newColor.rgb);
    onColorChange(newColor.rgb);
  };

  //   const handleColorChange = (e) => {
  //     console.log("yooo");
  //     const { name, value } = e.target;
  //     const newColor = { ...color, [name]: Number(value) };
  //     setColor(newColor);
  //     onColorChange(newColor);
  //   };

  return (
    <div className="mt-10 flex justify-center bg-slate-300 bg-opacity-30 backdrop-blur-lg border-b rounded-full">
      <div className="p-5">
        <HuePicker color={color} onChangeComplete={handleChangeComplete} />
      </div>
    </div>
  );
};

export default ColorPicker;
