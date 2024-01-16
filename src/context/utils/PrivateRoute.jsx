import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../userContext";
import { useCallback, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const PrivateRoute = () => {
  const { auth, getUser, tokenPresent } = useUser();

  const nofify = () => toast("User Logged In Successfully");

  const handleUser = useCallback(async () => {
    try {
      const res = await getUser();
      if (res) {
        nofify();
        console.log(res);
      }
    } catch (error) {
      console.log("error while getting the user", error);
    }
  }, [getUser]);

  useEffect(() => {
    handleUser();
  }, [handleUser]);

  // Render nothing until the token is checked
  if (!tokenPresent) {
    return <h3>Loading..</h3>;
  }

  return (
    <>
      {" "}
      <ToastContainer theme={"dark"} />
      {auth && tokenPresent ? <Outlet /> : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
