import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Profile,
  Login,
  Signup,
  Layout,
  Notfound,
} from "./components/constants";
import Account_Recovery from "./components/Account_Recovery";
import New_Password from "./components/New_Password";
import { AuthProvider } from "./context/userContext.jsx";
import Loading from "./components/Loading.jsx";
import PrivateRoute from "./context/utils/PrivateRoute.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recovery" element={<Account_Recovery />} />
            <Route path="/new-password" element={<New_Password />} />
          </Route>
          <Route path="/success" element={<Loading />} />
          <Route path="/*" element={<Notfound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
