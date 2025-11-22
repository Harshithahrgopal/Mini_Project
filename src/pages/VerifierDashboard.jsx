import React, { useState } from "react";
import "../index.css";
import VotingGuidelines from "./VotingGuidelines";

export default function VerifierDashboard() {
  const [aadhar, setAadhar] = useState("");
  const [voterId, setVoterId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showVerifiedPopup, setShowVerifiedPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [moveToGuidelines, setMoveToGuidelines] = useState(false);

  const handleVerification = (e) => {
    e.preventDefault();
    if (!aadhar || !voterId) {
      setMessage("⚠ Please enter Aadhar Number and Voter ID");
      return;
    }
    setShowOtpPopup(true);
    setMessage("");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === "654321") {
      setShowOtpPopup(false);
      setShowVerifiedPopup(true);

      setTimeout(() => {
        setShowVerifiedPopup(false);
        setMoveToGuidelines(true);   // ⭐ move to guideline page
      }, 2000);
    } else {
      setMessage("❌ Wrong OTP, try again");
    }
  };

  if (moveToGuidelines) return <VotingGuidelines />;

  return (
    <>
      <header className="top-navbar">
        <div className="nav-title">Verifier Dashboard</div>
        <button className="nav-btn logout-btn" onClick={() => window.location.reload()}>
          Logout
        </button>
      </header>

      <div className="verifier-wrapper">
        <div className="verify-card">
          <h1 className="verify-title">🗳 Election Verification Process</h1>
          <p className="verify-subtitle">
            Secure identity validation before allowing a voter to participate
          </p>

          <h2 className="page-title">Voter Identity Verification</h2>

          <form className="verify-form" onSubmit={handleVerification}>
            <input type="text" className="input-field" placeholder="Enter Aadhar Number"
              value={aadhar} onChange={(e)=>setAadhar(e.target.value)}/>
            <input type="text" className="input-field" placeholder="Enter Voter ID"
              value={voterId} onChange={(e)=>setVoterId(e.target.value)}/>
            <button className="btn-primary wide" type="submit">Verify Voter</button>
          </form>

          {message && <p className="msg">{message}</p>}
        </div>

        {showOtpPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Enter OTP</h3>
              <p className="small-text">OTP sent to voter registered mobile</p>

              <form onSubmit={handleVerifyOtp} className="popup-form">
                <input type="text" maxLength="6" className="input"
                  placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)}/>
                <button className="btn-primary">Verify OTP</button>
              </form>

              {message && <p className="msg">{message}</p>}
            </div>
          </div>
        )}

        {showVerifiedPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h2 style={{ color: "#1d4ed8" }}>✔ Voter Verified Successfully</h2>
              <p className="small-text">Redirecting to voting guidelines...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
