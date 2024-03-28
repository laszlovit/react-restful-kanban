import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="bg-neutral-900">
      <div className="mx-auto flex justify-between items-center px-12 py-6">
        <a className="text-lg font-bold text-white" href="#">
          Todo App
        </a>
        <button
          className="block lg:hidden focus:outline-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div
          className="hidden lg:flex lg:flex-grow lg:items-center lg:w-auto"
          id="navbarSupportedContent"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto"></ul>
          {isAuthenticated && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
