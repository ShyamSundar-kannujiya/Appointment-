import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ClientBook from "./pages/ClientBook";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Bookings from "./pages/Bookings";
import OwnerProfile from "./pages/OwnerProfile";
import UserGuide from "./pages/UserGuide";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/services" element={<Services />} />

      <Route path="/book/:slug" element={<ClientBook />} />

      <Route path="/customers" element={<Customers />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/bookings" element={<Bookings />} />

      <Route path="/owner-profile" element={<OwnerProfile />} />

      <Route path="/guide" element={<UserGuide publicMode />} />

      <Route path="/user-guide" element={<UserGuide />} />
    </Routes>
  );
}

export default App;
