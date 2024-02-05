import { NavLink } from "react-router-dom";
import { useUser } from "../context/userContext";

function Header() {
  const { auth, OAuthlogOut } = useUser();

  return (
    <div
      className="w-full bg-gray-600 text-white flex justify-between p-padding"
      id="header"
    >
      <div>Contactify</div>
      <nav>
        <ul className="flex gap-8">
          {!auth ? <NavLink to="/">Home</NavLink> : null}
          {!auth ? <NavLink to="/login">Log In</NavLink> : null}
          {!auth ? <NavLink to="/signup">Sign Up</NavLink> : null}
          {auth ? <button onClick={OAuthlogOut}>Log Out</button> : null}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
