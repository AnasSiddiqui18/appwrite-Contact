import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

function Header() {
  const { auth, handleLogout, getToken } = useUser();

  const navigate = useNavigate();

  const handleNavigate = async () => {
    const res = await handleLogout();
    console.log(res);
    navigate("/");
  };

  const response = getToken();

  return (
    <div
      className="w-full bg-gray-600 text-white flex justify-between p-padding"
      id="header"
    >
      <div>Contactify</div>
      <nav>
        <ul className="flex gap-8">
          {!auth && !response && <NavLink to="/">Home</NavLink>}
          {!auth && !response && <NavLink to="/login">Log In</NavLink>}
          {!auth && !response && <NavLink to="/signup">Sign Up</NavLink>}
          {auth && response && (
            <button onClick={handleNavigate}>Log Out</button>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
