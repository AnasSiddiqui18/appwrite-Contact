//? UserContext.js
import { createContext } from "react";
import { useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { account } from "../appwrite/appwriteConfig";
import { ID } from "appwrite";

const userContext = createContext({
  handleLogin: () => {},
  OAuthlogOut: () => {},
  getToken: () => {},
  signUpHandler: () => {},
  handleRecovery: () => {},
  handleUpdate: () => {},
  googleLogin: () => {},
  discordLogin: () => {},
  githubLogin: () => {},
  getUser: () => {},
  auth: false,
});

// UserProvider.js

const supabase = createClient(
  "https://yuceplafchimtpmfxvog.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y2VwbGFmY2hpbXRwbWZ4dm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NTQ5MjcsImV4cCI6MjAxNzUzMDkyN30.mkEI-23GQ6ZHPBbvcK3mK-uXq0v1C4CPoJHycWAHGZs"
);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await account.createEmailSession(data.email, data.password);
      localStorage.setItem("token", res.$id);

      setAuth(true);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const signUpHandler = async (data) => {
    try {
      const res = await account.create(ID.unique(), data.email, data.password);

      return res;
    } catch (error) {
      console.error("Unexpected error in sign up:", error.message);
    }
  };

  const handleRecovery = async (data) => {
    try {
      await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "http://localhost:5173/new-password",
      });
    } catch (error) {
      console.log(`Error in the account recovery`, error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await supabase.auth.updateUser({ password: data.password });
    } catch (error) {
      console.log(`Error while setting new password`);
    }
  };

  const OAuthStateHandler = () => {
    const { data: authLogin } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`current event`, event);
        if (!session && event === "SIGNED_OUT") {
          authLogin.subscription.unsubscribe();
          console.log("session is not present");
        } else if (session) {
          console.log(session);
          if (session && session.user.app_metadata.provider !== "email") {
            console.log("session is present");
            setAuth(true);
            navigate(`/profile/${session.user.id}`);
            const jwt_token = session.access_token;
            const decoded = jwtDecode(jwt_token);
            const session_id = decoded.session_id;
            localStorage.setItem("token", session_id);
            console.log(`session`, session);
          }
        }
      }
    );
  };

  const getUser = async () => {
    try {
      const res = await account.get();

      return res;
    } catch (error) {
      console.log(`error while getting the account`, error);
    }
  };

  const OAuthlogOut = async () => {
    try {
      const res = await account.deleteSession("current");
      setAuth(false);
      navigate("/");
      localStorage.removeItem("token");
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    return token;
  };

  useEffect(() => {
    OAuthStateHandler();

    const token = getToken();

    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }

    console.log("use effect runs");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const googleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      console.log(`login with google`, data);

      if (error) throw new error("Error in the google login");
    } catch (error) {
      console.log(error);
    }
  };

  const discordLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
      });

      console.log("Login with discord data :", data);
      if (error) throw new error("Error in the google login");
    } catch (error) {
      console.log(error);
    }
  };

  const githubLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      console.log("Login with github data :", data);
      if (error) throw new error("Error in the google login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <userContext.Provider
      value={{
        handleLogin,
        auth,
        signUpHandler,
        handleRecovery,
        handleUpdate,
        getToken,
        googleLogin,
        discordLogin,
        githubLogin,
        supabase,
        OAuthlogOut,
        getUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

// useUser.js

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(userContext);
