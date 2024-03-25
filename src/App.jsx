import { useAuth0 } from "@auth0/auth0-react";
import CustomKanban from "./components/NotionKanban";

function App() {
  const { loginWithPopup, loginWithRedirect, logout, isAuthenticated } =
    useAuth0();
  return (
    <div>
      <ul>
        <li>
          <button onClick={loginWithPopup}>Login with Popup</button>
        </li>
        <li>
          <button onClick={loginWithRedirect}>Login with Redirect</button>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
      <h3>User is {isAuthenticated ? "Logged in" : "Not logged in"}</h3>
      {isAuthenticated && (
        <div>
          <CustomKanban />
        </div>
      )}
    </div>
  );
}

export default App;
