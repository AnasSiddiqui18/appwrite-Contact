import { createContext, useContext, useState } from "react";
const userContext = createContext();

export const UserProvider = ({ children }) => {
  // const [username, setUserName] = useState("");
  const [auth, setAuth] = useState(false);

  // const handlerFunction = (name) => setUserName(name);
  const handleLogin = () => setAuth(!auth);

  return (
    <userContext.Provider value={{ handleLogin, auth, setAuth }}>
      {children}
    </userContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(userContext);
