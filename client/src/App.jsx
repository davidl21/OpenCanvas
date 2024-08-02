import React from "react";
import Navbar from "./components/Navbar";
import Canvas from "./components/Canvas";

const App = () => {
  return (
    <div className="py-48 flex flex-col items-center text-center">
      <Navbar />
      <Canvas />
    </div>
  );
};

export default App;
