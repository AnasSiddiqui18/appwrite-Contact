import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../userContext";
import { useCallback, useEffect, useState } from "react";

const PrivateRoute = () => {
  const { auth, getToken, getUser } = useUser();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [userIsPresent, setUserIsPresent] = useState(false);

  const handleToken = useCallback(() => {
    const res = getToken();
    console.log("token", res);

    if (res) {
      setTokenChecked(true);
    } else {
      setTokenChecked(false);
    }
  }, [getToken]);

  const handleUser = useCallback(async () => {
    try {
      const res = await getUser();
      if (res) {
        setUserIsPresent(true);

        console.log(res);
      } else {
        setUserIsPresent(false);
      }
    } catch (error) {
      console.log("error while getting the user", error);
    }
  }, [getUser]);

  useEffect(() => {
    handleToken();
    handleUser();
  }, [handleToken, handleUser]);

  // Render nothing until the token is checked
  if (!tokenChecked) {
    return null;
  }
  if (!userIsPresent) {
    return <h3>Loading..</h3>;
  }

  return auth && tokenChecked ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
