import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Clubs from "./pages/Clubs";
import MyClubs from "./pages/MyClubs";
import Admin from "./pages/Admin";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageClubs from "./pages/admin/ManageClubs";
import AdminRoute from "./components/AdminRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/clubs" element={<Clubs />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }

        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myclubs"
          element={
            <ProtectedRoute>
              <MyClubs />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
        <Route path="/admin/events" element={
          <AdminRoute>
            <ManageEvents />
          </AdminRoute>
        } />
        <Route path="/admin/clubs" element={
          <AdminRoute>
            <ManageClubs />
          </AdminRoute>
        } />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
