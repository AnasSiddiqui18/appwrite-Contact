import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Loading />} />
            <Route path="/recovery" element={<Account_Recovery />} />
            <Route path="/new-password" element={<New_Password />} />
          </Route>
          <Route path="/*" element={<Notfound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
