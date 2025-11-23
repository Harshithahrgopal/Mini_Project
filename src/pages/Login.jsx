import React, { useState } from "react";
import "../styles/auth.css";

export default function Login({ onSwitch, onLoginSuccess }) {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      setMessage("⚠ Please select a role first");
      return;
    }

    if (role === "admin" && username === "admin@gmail.com" && password === "admin123") {
      setShowOtpPopup(true);
      setMessage("");
    } else if (role === "verifier" && username === "verifier@gmail.com" && password === "verify123") {
      setShowOtpPopup(true);
      setMessage("");
    } else {
      setMessage("❌ Invalid Username / Password / Role");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp === "123456") {
      setShowOtpPopup(false);
      setShowSuccessPopup(true);
      setMessage("");

      setTimeout(() => {
        onLoginSuccess(role);
      }, 2000);
    } else {
      setMessage("❌ Incorrect OTP, try again");
    }
  };

  const handleResend = () => {
    setMessage("🔁 OTP Resent Successfully");
  };

  return (
    <div className="auth-wrapper">
      
      {/* LEFT IMAGE SECTION */}
      <div className="auth-left">
        <img 
          src="/background-login.jpg" 
          className="left-img"
          alt="login-visual"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="auth-right">
        <div className="auth-card">

          <h2 className="title">Login</h2>

          <div className="role-btn-container">
            <button
              className={`role-btn ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>

            <button
              className={`role-btn ${role === "verifier" ? "active" : ""}`}
              onClick={() => setRole("verifier")}
            >
              Verifier
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="form">
            <input
              type="text"
              placeholder="Username / Email"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-primary">
              Send OTP
            </button>
          </form>

          {!showOtpPopup && message && <p className="msg">{message}</p>}

          <p className="link" onClick={onSwitch}>
            Click here to Register as a Verifier
          </p>

          {/* OTP POPUP */}
          {showOtpPopup && (
            <div className="popup-overlay">
              <div className="popup-card">
                <h3>Enter OTP</h3>
                <p className="small-text">
                  OTP has been sent to your registered mobile number
                </p>

                <form onSubmit={handleVerifyOtp} className="popup-form">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    className="input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button type="submit" className="btn-primary">
                    Verify OTP
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleResend}
                  >
                    Resend OTP
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SUCCESS POPUP */}
          {showSuccessPopup && (
            <div className="popup-overlay">
              <div className="popup-card">
                <h2 style={{ color: "#38bdf8" }}>🎉 Login Successful</h2>
                <p className="small-text">Redirecting...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
