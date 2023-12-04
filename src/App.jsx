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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recovery" element={<Account_Recovery />} />
          <Route path="/new-password" element={<New_Password />} />
        </Route>
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
