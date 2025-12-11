import React, { useState, useEffect } from "react";
import VotingGuidelines from "./VotingGuidelines";

import voters from "../data/voters.json";
import elections from "../data/elections.json";
import wards from "../data/wards.json";
import candidates from "../data/candidates.json";

export default function VerifierDashboard() {
  const [aadhar, setAadhar] = useState("");
  const [voterId, setVoterId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showVerifiedPopup, setShowVerifiedPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [moveToGuidelines, setMoveToGuidelines] = useState(false);
  const [verifiedVoter, setVerifiedVoter] = useState(null);

  // Dynamic election + ward details state
  const [electionDetails, setElectionDetails] = useState(null);
  const [wardDetails, setWardDetails] = useState(null);
  const [wardCandidates, setWardCandidates] = useState([]);
  const [registeredVotersCount, setRegisteredVotersCount] = useState(0);

  useEffect(() => {
    // Set election details (assuming the first/upcoming election)
    if (elections.length > 0) {
      const upcomingElection = elections.find(e => e.status === "upcoming") || elections[0];
      setElectionDetails(upcomingElection);
    }
  }, []);

  // When a voter is verified, load ward and candidates info dynamically
  useEffect(() => {
    if (!verifiedVoter) return;

    // Find ward info
    const ward = wards.find(
      w => w.ward_number === verifiedVoter.ward_number || 
           w.ward_number?.$numberInt === verifiedVoter.ward_number || 
           Number(w.ward_number) === Number(verifiedVoter.ward_number)
    );
    setWardDetails(ward || null);

    // Filter candidates for ward
    const wardCands = candidates.filter(
      c => Number(c.ward_number) === Number(verifiedVoter.ward_number)
    );
    setWardCandidates(wardCands);

    // Count registered voters in ward
    const count = voters.filter(
      v => Number(v.ward_number) === Number(verifiedVoter.ward_number)
    ).length;
    setRegisteredVotersCount(count);
  }, [verifiedVoter]);

  const handleVerification = (e) => {
    e.preventDefault();
    if (!aadhar || !voterId) {
      setMessage("⚠ Please enter Aadhar Number and Voter ID");
      return;
    }

    const foundVoter = voters.find(
      (v) => v.aadhar_number === aadhar && v.voter_id === voterId
    );

    if (!foundVoter) {
      setMessage("❌ Voter not found with given Aadhar and Voter ID.");
      return;
    }

    setVerifiedVoter(foundVoter);
    setShowOtpPopup(true);
    setMessage("");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === "654321") {
      setShowOtpPopup(false);
      setShowVerifiedPopup(true);

      localStorage.setItem("ward_number", verifiedVoter.ward_number);

      setTimeout(() => {
        setShowVerifiedPopup(false);
        setMoveToGuidelines(true);
      }, 2000);
    } else {
      setMessage("❌ Wrong OTP, try again");
    }
  };

  if (moveToGuidelines) return <VotingGuidelines />;

  // Helper: Format election time nicely
  const formatTimeRange = (start, end) => {
    if (!start || !end) return "7:00 AM – 6:00 PM (Today)";
    const options = { hour: "2-digit", minute: "2-digit" };
    const startTime = new Date(start).toLocaleTimeString([], options);
    const endTime = new Date(end).toLocaleTimeString([], options);
    return `${startTime} – ${endTime} (Today)`;
  };

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

          {electionDetails ? (
            <ul className="info-list">
              <li>
                Election: <strong>{electionDetails.election_name}</strong>
              </li>
              <li>
                Polling Time:{" "}
                <strong>
                  {formatTimeRange(electionDetails.start_time, electionDetails.end_time)}
                </strong>
              </li>
              {wardDetails && (
                <>
                  <li>
                    Ward Number: <strong>{wardDetails.ward_number}</strong>
                  </li>
                  <li>
                    Ward Name: <strong>{wardDetails.ward_name}</strong>
                  </li>
                  <li>
                    Verifier: <strong>{wardDetails.verifier}</strong>
                  </li>
                  <li>
                    Registered Voters in Ward:{" "}
                    <strong>{registeredVotersCount}</strong>
                  </li>
                </>
              )}
            </ul>
          ) : (
            <p>Loading election details...</p>
          )}

          <h2 className="info-title">🛡 Verification Rules</h2>
          <ul className="info-list">
            <li>Aadhar & Voter ID both must be produced</li>
            <li>Verify details with official government records</li>
            <li>OTP validation is mandatory for identity confirmation</li>
            <li>No duplicate or impersonation allowed</li>
            <li>Only verified voters allowed to enter booth</li>
          </ul>
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

            <button className="btn-primary wide" type="submit">
              Verify Voter
            </button>
          </form>

          {message && <p className="msg">{message}</p>}

          {/* Show logged-in voter details after verification */}
          {verifiedVoter && (
            <div
              style={{
                marginTop: "20px",
                color: "#0f5132",
                fontWeight: "700",
                textAlign: "left",
              }}
            >
              <p>
                <strong>Logged in voter:</strong> {verifiedVoter.full_name} (Ward{" "}
                {verifiedVoter.ward_number})
              </p>

              <h3>Candidates in Your Ward</h3>
              {wardCandidates.length > 0 ? (
                <ul style={{ paddingLeft: "20px" }}>
                  {wardCandidates.map((c) => (
                    <li key={c._id?.$oid || c._id}>
                      {c.full_name} — {c.party}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No candidates found for your ward.</p>
              )}
            </div>
          )}
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
          display:flex;justify-content:center;align-items:flex-start;
          gap:60px;padding-top:120px;min-height:80vh;
        }
        .side-info {
          width:480px;min-height:450px;background:white;padding:32px;
          border-radius:14px;border-left:6px solid #38bdf8;
          box-shadow:0px 0px 18px rgba(56,189,248,0.28);
          font-size: 16px;
          color: #334155;
        }
        .verify-card {
          width:480px;min-height:450px;padding:38px;border-radius:14px;
          background:white;text-align:center;border:2px solid #38bdf8;
          box-shadow:0px 0px 18px rgba(56,189,248,0.25);
        }
        .verify-title {font-size:30px;color:#38bdf8;}
        .verify-subtitle {color:#334155;font-size:16px;margin-bottom:22px;}
        .info-title {color:#38bdf8;font-size:20px;margin-bottom:10px;}
        .info-list {line-height:1.6;margin-bottom:22px;}
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
