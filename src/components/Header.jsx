import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

function Header() {
  const { auth, handleLogout, appwriteLogin, supabase } = useUser();

  const navigate = useNavigate();

  const OAuthlogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error("Error while sign out OAuth Account");
      navigate("/");
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigate = async () => {
    if (appwriteLogin) {
      const res = await handleLogout();
      console.log(res);
      navigate("/");
    } else {
      OAuthlogOut();
    }
  };

  console.log("auth = ", auth);

  return (
    <div
      className="w-full bg-gray-600 text-white flex justify-between p-padding"
      id="header"
    >
      <div>Contactify {JSON.stringify(auth)}</div>
      <nav>
        <ul className="flex gap-8">
          {!auth ? <NavLink to="/">Home</NavLink> : null}
          {!auth ? <NavLink to="/login">Log In</NavLink> : null}
          {!auth ? <NavLink to="/signup">Sign Up</NavLink> : null}
          {auth ? <button onClick={handleNavigate}>Log Out</button> : null}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
