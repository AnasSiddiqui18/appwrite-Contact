import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { account } from "../appwrite/appwriteConfig";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const supabase = createClient(
  "https://yuceplafchimtpmfxvog.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y2VwbGFmY2hpbXRwbWZ4dm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NTQ5MjcsImV4cCI6MjAxNzUzMDkyN30.mkEI-23GQ6ZHPBbvcK3mK-uXq0v1C4CPoJHycWAHGZs"
);

const userContext = createContext({
  handleLogin: () => {},
  handleLogout: () => {},
  getToken: () => {},
  signUpHandler: () => {},
  handleRecovery: () => {},
  handleUpdate: () => {},
  googleLogin: () => {},
  OAuthlogOut: () => {},
  auth: false,
  appwriteLogin: false,
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [appwriteLogin, setAppwriteLogin] = useState(false);

  const navigate = useNavigate();

  //? To handle the login funcionality

  const handleLogin = async (data) => {
    try {
      const res = await account.createEmailSession(data.email, data.password);

      console.log(`Email session create successfully`, res);
      localStorage.setItem("token", res.$id);
      setAuth(true);
      console.log("login function runs");

      setAppwriteLogin(true);

      return { response: res };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  };

  //? *****

  //? Get current token when the component mounts

  //? *****

  //? To handle the logout functionality

  const handleLogout = async () => {
    try {
      const res = await account.deleteSession("current");
      if (res) console.log(`User logged out successfully`, res);
      setAuth(false);
      localStorage.removeItem("token");

      return res;
    } catch (error) {
      console.log(`Error in logout`, error);
    }
  };

  //? *****

  //? To handle the sign up functionality

  const signUpHandler = async (data) => {
    try {
      const res = await account.create(
        "unique()",
        data.email,
        data.password,
        data.name
      );
      console.log(`User created successfully`, res);
      return res;
    } catch (error) {
      console.log(`Error while creating the user`, error);
    }
  };

  //? *****

  //? To handle the account recovery process

  const handleRecovery = async (data) => {
    try {
      const response = await account.createRecovery(
        data.email,
        "http://localhost:5173/new-password"
      );
      return response;
    } catch (error) {
      console.log(`Error in the account recovery`, error);
    }
  };

  //? *****

  //? To set a new password

  const handleUpdate = async (data) => {
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const userId = urlParams.get("userId");
      const secret = urlParams.get("secret");

      const res = await account.updateRecovery(
        userId,
        secret,
        data.password,
        data.password
      );

      return res;
    } catch (error) {
      console.log(`Error while setting new password`, error);
    }
  };

  //? *****

  //? OAuth state handler helps us if we want to do something when the state get changes

  const OAuthStateHandler = useCallback(async () => {
    const { data: authLogin } = await supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`current event`, event);
        if (!session) {
          // navigate("/login");
          if (!session && event === "SIGNED_OUT") {
            authLogin.subscription.unsubscribe();
          }
          console.log("auth set to false");
          setAuth(false);
        } else {
          navigate(`/profile/${session.user.id}`);
          setAuth(true);
          const jwt_token = session.access_token;
          const decoded = jwtDecode(jwt_token);
          const session_id = decoded.session_id;
          localStorage.setItem("token", session_id);
          console.log(session.access_token);
        }
      }
    );
  }, [navigate]);

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) return false;
    return token;
  };

  useEffect(() => {
    const token = getToken();
    setAuth(true);
  }, []);

  //? *** Google login

  const googleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      console.log("data :", data);
      if (error) throw error("Error in the google login");
    } catch (error) {
      console.log(error);
    }
    return googleLogin;
  };

  //? *****

  return (
    <userContext.Provider
      value={{
        handleLogin,
        auth,
        handleLogout,
        signUpHandler,
        handleRecovery,
        handleUpdate,
        getToken,
        googleLogin,
        supabase,
        appwriteLogin,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(userContext);
