import React from "react";
import Navbar from "../components/Navbar";

const NotFoundPage = () => {
  return (
    <div className="py-24 flex flex-col items-center text-center">
      <Navbar />
      <h1 className="mt-20 text-3xl text-red-500">Error 404: Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
