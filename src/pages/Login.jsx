import React, { useState, useEffect } from "react";
import "../styles/auth.css";

import admins from "../data/admins";
import verifiers from "../data/verifiers";

export default function Login({ onSwitch, onLoginSuccess }) {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // -------- Timer State --------
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // -------- Generate a 6-digit OTP --------
  const createOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // -------- Countdown Timer Logic --------
  useEffect(() => {
    let interval = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startOtpTimer = () => {
    setTimer(60);
    setIsTimerActive(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!role) {
      setMessage("⚠ Please select a role first");
      setLoading(false);
      return;
    }

    const users = role === "admin" ? admins : verifiers;

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === username.toLowerCase() ||
          u.fullname.toLowerCase() === username.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
      setMessage("❌ Invalid username or password");
      setLoading(false);
      return;
    }

    const newOtp = createOtp();
    setGeneratedOtp(newOtp);

    setUserData(user);
    setShowOtpPopup(true);
    setLoading(false);

    setMessage(`📩 Your OTP: ${newOtp}`);

    startOtpTimer();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);

    if (otp === generatedOtp) {
      setShowOtpPopup(false);
      setShowSuccessPopup(true);
      setMessage("");

      setTimeout(() => {
        onLoginSuccess(userData.role, userData, "fake-jwt-token");
        setShowSuccessPopup(false);
      }, 2000);
    } else {
      setMessage("❌ Invalid OTP");
    }

    setLoading(false);
  };

  const handleResend = () => {
    if (timer > 0) return; // prevent click before time

    const newOtp = createOtp();
    setGeneratedOtp(newOtp);
    setMessage(`🔁 OTP Resent Successfully: ${newOtp}`);

    startOtpTimer();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img
          src="/background-login.jpg"
          className="left-img"
          alt="login-visual"
        />
      </div>

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
              placeholder="Enter username or email"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Send OTP"}
            </button>
          </form>

          {message && (
            <div className="message-box">
              <p className="msg">{message}</p>
            </div>
          )}

          <p className="link" onClick={onSwitch}>
            Click here to Register as a Voter
          </p>

          {showOtpPopup && (
            <div className="popup-overlay">
              <div className="popup-card">
                <h3>Enter OTP</h3>

                <form onSubmit={handleVerifyOtp} className="popup-form">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter OTP"
                    className="input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    className={`btn-secondary ${
                      timer > 0 ? "disabled-btn" : ""
                    }`}
                    onClick={handleResend}
                    disabled={timer > 0}
                  >
                    {timer > 0
                      ? `Resend in ${timer}s`
                      : "Resend OTP"}
                  </button>
                </form>

                {/* Show OTP for testing */}
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#38bdf8" }}>
                  OTP: {generatedOtp}
                </p>
              </div>
            </div>
          )}

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
