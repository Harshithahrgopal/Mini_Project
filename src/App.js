import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Dashboard";
import VerifierDashboard from "./pages/VerifierDashboard";

export default function App() {
  const [screen, setScreen] = useState("login");

  const handleLoginSuccess = (userRole) => {
    if (userRole === "admin") {
      setScreen("admin-dashboard");
    } else if (userRole === "verifier") {
      setScreen("verifier-dashboard");
    }
  };

  return (
    <>
      {screen === "login" && (
        <Login onSwitch={() => setScreen("register")} onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === "register" && (
        <Register onSwitch={() => setScreen("login")} />
      )}

      {screen === "admin-dashboard" && <AdminDashboard />}
      {screen === "verifier-dashboard" && <VerifierDashboard />}
    </>
  );
}
