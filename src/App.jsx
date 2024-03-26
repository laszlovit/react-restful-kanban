import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import Home from "./pages/Home"; // Import your home page component
import NavBar from "./components/NavBar";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated && <NavBar />}{" "}
      {!isAuthenticated && (
        <div className="grid min-h-full h-screen place-items-center bg-neutral-900 px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Todos
            </h1>
            <p className="mt-6 text-base leading-7 text-neutral-400">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
      {isAuthenticated && <Home />} {/* Render home page when authenticated */}
    </div>
  );
}

export default App;
