import React from "react";

const Navbar = () => {
  return (
    <nav className="top-0 z-25 py-2 bg-slate-300 bg-opacity-30 backdrop-blur-lg border-b rounded-full lg:w-[500px] sm:w-[300px] mx-auto">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <span className="p-2 text-4xl tracking-tight text-orange-400">
              <a href="/">OpenCanvas</a>
            </span>
          </div>
          <ul className="p-2 flex space-x-12">
            <li
              key="3"
              className="hover:text-orange-600 transition-color duration-300 text-orange-400 text-xl"
            >
              <a
                href="https://www.linkedin.com/in/davidl21"
                target="_blank"
                rel="noopener noreferrer"
              >
                connect w/ me
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
