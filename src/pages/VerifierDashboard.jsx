import React, { useState } from "react";
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
        setMoveToGuidelines(true);
      }, 2000);
    } else {
      setMessage("❌ Wrong OTP, try again");
    }
  };

  if (moveToGuidelines) return <VotingGuidelines />;

  return (
    <>
      {/* NAVBAR */}
      <header className="top-navbar">
        <div className="nav-title">Verifier Dashboard</div>
        <button className="logout-btn" onClick={() => window.location.reload()}>
          Logout
        </button>
      </header>

      {/* MAIN CENTER WRAPPER */}
      <div className="center-wrapper">

        {/* LEFT INFO BOX */}
        <div className="side-info">
          <h2 className="info-title">📌 Ongoing Election Details</h2>
          <ul className="info-list">
            <li>Election Type: <strong>Municipal / Local Body Election</strong></li>
            <li>Ward Number: <strong>Ward 27 — Gandhi Nagar</strong></li>
            <li>Polling Booth: <strong>Govt Higher Primary School, Gandhi Nagar</strong></li>
            <li>Polling Time: <strong>7:00 AM – 6:00 PM (Today)</strong></li>
            <li>Registered Voters in Ward: <strong>6,482</strong></li>
          </ul>

          <h2 className="info-title">🛡 Verification Rules</h2>
          <ul className="info-list">
            <li>Aadhar & Voter ID both must be produced</li>
            <li>Verify details with official government records</li>
            <li>OTP validation is mandatory for identity confirmation</li>
            <li>No duplicate or impersonation allowed</li>
            <li>Only verified voters allowed to enter booth</li>
          </ul>

          {/* QUOTES */}
         
        </div>

        {/* RIGHT VERIFICATION CARD */}
        <div className="verify-card">
          <h1 className="verify-title">🗳 Voter Identity Verification</h1>
          <p className="verify-subtitle">
            Authenticate identity before entering the secure voting area.
          </p>

          <form className="verify-form" onSubmit={handleVerification}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Aadhar Number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Enter Voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />

            <button className="btn-primary wide" type="submit">Verify Voter</button>
          </form>

          {message && <p className="msg">{message}</p>}
        </div>
      </div>
      
       <div className="bottom-quote">
  ✨ “Your vote is your voice. Don’t let others speak for you.”
</div>

         

      {/* OTP POPUP */}
      {showOtpPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>🔐 OTP Verification</h3>
            <p className="small-text">OTP has been sent to registered mobile number</p>

            <form onSubmit={handleVerifyOtp} className="popup-form">
              <input
                type="text"
                maxLength="6"
                className="input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="btn-primary wide">Verify OTP</button>
            </form>
            {message && <p className="msg">{message}</p>}
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showVerifiedPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2 className="success-text">✔ Voter Verified Successfully</h2>
            <p className="small-text">Redirecting to voting guidelines...</p>
          </div>
        </div>
      )}

      {/* INLINE CSS */}
      <style>{`
        .top-navbar {
          display:flex;justify-content:space-between;align-items:center;
          background:#38bdf8;padding:14px 24px;color:white;font-size:20px;font-weight:600;
        }
        .logout-btn {
          background:white;color:#38bdf8;padding:6px 14px;border-radius:6px;
          font-weight:600;border:none;cursor:pointer;
        }

        .center-wrapper {
          display:flex;justify-content:center;align-items:center;
          gap:60px;padding-top:120px;min-height:80vh;
        }

        .side-info {
          width:480px;min-height:450px;background:white;padding:32px;
          border-radius:14px;border-left:6px solid #38bdf8;
          box-shadow:0px 0px 18px rgba(56,189,248,0.28);
        }

        .verify-card {
          width:480px;min-height:450px;padding:38px;border-radius:14px;
          background:white;text-align:center;border:2px solid #38bdf8;
          box-shadow:0px 0px 18px rgba(56,189,248,0.25);
        }

        .verify-title {font-size:30px;color:#38bdf8;}
        .verify-subtitle {color:#334155;font-size:16px;margin-bottom:22px;}

        .info-title {color:#38bdf8;font-size:20px;margin-bottom:10px;}
        .info-list {color:#334155;font-size:16px;line-height:1.6;margin-bottom:22px;}

        .quote {font-size:12px;color:#475569;margin-top:6px;font-style:italic;}

        .verify-form {display:flex;flex-direction:column;gap:14px;}
        .input-field {
          padding:14px;border-radius:10px;border:2px solid #38bdf8;text-align:center;font-size:16px;
        }

        .btn-primary {
          padding:14px;background:#38bdf8;color:white;border:none;border-radius:10px;
          font-size:18px;font-weight:600;cursor:pointer;
        }

        .msg {color:#e11d48;font-weight:600;margin-top:12px;font-size:15px;}
        .wide {width:100%;}

        .popup-overlay {
          position:fixed;inset:0;background:rgba(0,0,0,0.5);
          display:flex;justify-content:center;align-items:center;
        }
        .popup-card {
          background:white;padding:30px;width:360px;border-radius:14px;text-align:center;
          border:2px solid #38bdf8;box-shadow:0 0 15px rgba(56,189,248,0.3);
        }
                  .bottom-quote {
          width: 100%;
          text-align: center;
          position: fixed;
          bottom: 10px;
          left: 0;
          font-size: 14px;
          font-style: italic;
          color: #475569;
          font-weight: 500;
        }

        .success-text {color:#38bdf8;font-size:22px;font-weight:700;}
        .small-text {font-size:14px;color:#475569;}
        .input {padding:12px;width:100%;border:2px solid #38bdf8;border-radius:10px;text-align:center;}
      `}</style>
    </>
  );
}
