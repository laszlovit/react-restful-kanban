import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Board from "./Board";

export const CustomKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

export default CustomKanban;
