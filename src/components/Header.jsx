import { NavLink } from "react-router-dom";
import { useUser } from "../context/userContext";

function Header() {
  const { auth, OAuthlogOut, tokenPresent } = useUser();

  if (tokenPresent) {
    console.log("token is present");
  }

  return (
    <div
      className="w-full bg-gray-600 text-white flex justify-between p-padding"
      id="header"
    >
      <div>Contactify</div>
      <nav>
        <ul className="flex gap-8">
          {!auth && !tokenPresent ? <NavLink to="/">Home</NavLink> : null}
          {!auth && !tokenPresent ? (
            <NavLink to="/login">Log In</NavLink>
          ) : null}
          {!auth && !tokenPresent ? (
            <NavLink to="/signup">Sign Up</NavLink>
          ) : null}
          {auth && tokenPresent ? (
            <button onClick={OAuthlogOut}>Log Out</button>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
