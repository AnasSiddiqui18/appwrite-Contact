import { NavLink } from "react-router-dom";
import { useUser } from "../context/userContext";
import { account } from "../appwrite/appwriteConfig";
import { useNavigate } from "react-router-dom";

function Header() {
  const { auth, handleLogin } = useUser();

  const navigate = useNavigate();

  const handleLogout = async () => {
    handleLogin();
    navigate("/");

    try {
      const res = await account.deleteSession("current");
      if (res) console.log(`User logged out successfully`, res);
    } catch (error) {
      console.log(`Error in logout`, error);
    }
  };

  return (
    <div
      className="w-full bg-gray-600 text-white flex justify-between p-padding"
      id="header"
    >
      <div>Contactify</div>
      <nav>
        <ul className="flex gap-8">
          {!auth && <NavLink to="/">Home</NavLink>}
          {!auth && <NavLink to="/login">Log In</NavLink>}
          {!auth && <NavLink to="/signup">Sign Up</NavLink>}
          {auth && (
            <NavLink to="/" onClick={handleLogout}>
              Log Out
            </NavLink>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
