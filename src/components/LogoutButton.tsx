import React from "react";
import { FiLogOut } from "react-icons/fi";
import { LogoutOptions, useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin } as LogoutOptions);
  };

  return (
    <>
      {isAuthenticated && (
        <button
          className="group flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900 transition-transform active:scale-[0.985]"
          onClick={handleLogout}
        >
          Log Out
          <FiLogOut className="ml-1" />
        </button>
      )}
    </>
  );
};

export default LogoutButton;
