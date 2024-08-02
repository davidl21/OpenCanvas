import React from "react";

const Navbar = () => {
  return (
    <nav className="top-0 z-50 py-3 bg-slate-300 bg-opacity-30 backdrop-blur-lg border-b rounded-full">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <span className="p-2 text-4xl tracking-tight text-orange-400 mr-60">
              OpenCanvas
            </span>
            <ul className="p-2 flex ml-14 space-x-12">
              <li
                key="1"
                className="hover:text-orange-600 transition-color duration-300 text-orange-400 text-xl"
              >
                <a href="/about">about</a>
              </li>
              <li
                key="2"
                className="hover:text-orange-600 transition-color duration-300 text-orange-400 text-xl"
              >
                <a href="/how">how it's built</a>
              </li>
              <li
                key="3"
                className="hover:text-orange-600 transition-color duration-300 text-orange-400 text-xl"
              >
                <a href="/connect">connect w/ me</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
