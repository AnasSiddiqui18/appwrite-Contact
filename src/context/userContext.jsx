import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwrite/appwriteConfig";
const userContext = createContext({
  handleLogin: () => {},
  handleLogout: () => {},
  getToken: () => {},
  signUpHandler: () => {},
  handleRecovery: () => {},
  handleUpdate: () => {},
  auth: false,
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

  //? To handle the login funcionality

  const handleLogin = async (data) => {
    try {
      const res = await account.createEmailSession(data.email, data.password);
      console.log(`Email session create successfully`, res);
      localStorage.setItem("token", res.$id);
      setAuth(true);
      console.log("login function runs");
      return res;
    } catch (error) {
      console.log(`Error in the login session`, error);
    }
  };

  //? *****

  //? Get current token when the component mounts

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    }
  }, []);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    return token;
  };

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

  const handleUpdate = (data) => {
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const userId = urlParams.get("userId");
      const secret = urlParams.get("secret");

      const res = account.updateRecovery(
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
      }}
    >
      {children}
    </userContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(userContext);
