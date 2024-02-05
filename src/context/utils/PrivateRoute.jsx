import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../userContext";
import { useCallback, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const PrivateRoute = () => {
  const { auth, getUser } = useUser();

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

  return (
    <>
      {" "}
      <ToastContainer theme={"dark"} />
      {auth ? <Outlet /> : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
