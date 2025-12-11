import React, { useState, useEffect } from "react";
import candidatesData from "../data/candidates.json";
import VerifierDashboard from "./VerifierDashboard";

export default function VoteSelectionPage() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [wardNumber, setWardNumber] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const ward = localStorage.getItem("ward_number");
    if (ward) setWardNumber(parseInt(ward));
  }, []);

  if (!wardNumber) {
    return (
      <div style={{ padding: 30, textAlign: "center", fontSize: 18, color: "red" }}>
        Error: Ward number not found. Please verify your identity first.
      </div>
    );
  }

  const candidates = candidatesData.filter((c) => c.ward_number === wardNumber);

  const NOTA = {
    num: candidates.length + 1,
    full_name: "NOTA",
    party: "None Of The Above",
  };

  const finalCandidates = [...candidates, NOTA];

  const submitVote = () => {
    setSubmitted(true);
    // Replace with actual submission logic here if needed
    setTimeout(() => {
      setRedirect(true); 
    }, 2500 );
  };

  if(redirect) return <VerifierDashboard />;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🗳 Cast Your Vote</h1>
      <p style={styles.subText}>
        Choose your candidate carefully — Your vote shapes the future.
      </p>

      <div style={styles.containerBox}>
        <div style={styles.grid}>
          {finalCandidates.map((c, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                borderColor: selected === index ? "#38bdf8" : "#b3e6ff",
                background: selected === index ? "#e0f7ff" : "white",
                transform: selected === index ? "scale(1.03)" : "scale(1)",
                cursor: "pointer",
              }}
              onClick={() => setSelected(index)}
            >
              {/* Show serial number: c.num if present (for NOTA), else index+1 */}
              <span style={styles.num}>{c.num ?? index + 1}</span>
              <div style={styles.party}>{c.party}</div>
              <div style={styles.name}>{c.full_name}</div>
              <button
                style={styles.voteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(index);
                }}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          ...styles.bottomBox,
          display: selected !== null && !submitted ? "block" : "none",
        }}
      >
        <h3 style={styles.selectedTitle}>Selected Candidate</h3>
        <p style={styles.selectedName}>
          {selected !== null ? finalCandidates[selected].full_name : ""}
        </p>
        <button style={styles.confirmBtn} onClick={submitVote}>
          Confirm Vote
        </button>
      </div>

      {submitted && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{ color: "#38bdf8" }}>🎉 Vote Cast Successfully!</h2>
            <p>Thank you for voting.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/************* INLINE STYLES *************/
const styles = {
  page: {
    background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    minHeight: "100vh",
    padding: "30px",
    textAlign: "center",
  },
  heading: { fontSize: "42px", fontWeight: "800", color: "white" },
  subText: { color: "white", fontSize: "18px", marginBottom: "20px" },

  containerBox: {
    width: "85%",
    margin: "0 auto",
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgb(0 0 0 / 0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    padding: "14px",
    borderRadius: "12px",
    border: "3px solid #b3e6ff",
    boxShadow: "0 0 10px rgb(0 0 0 / 0.07)",
    transition: "all 0.3s ease",
  },

  num: {
    display: "inline-block",
    background: "#38bdf8",
    color: "white",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    marginBottom: "15px",
  },

  party: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0ea5e9",
    marginBottom: "10px",
    whiteSpace: "nowrap",
  },

  name: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  voteBtn: {
    background: "#38bdf8",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s ease",
  },

  bottomBox: {
    marginTop: "30px",
    padding: "20px",
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 0 18px rgb(0 0 0 / 0.1)",
  },

  selectedTitle: { color: "#38bdf8", marginBottom: "10px" },
  selectedName: {
    fontWeight: "700",
    fontSize: "22px",
    marginBottom: "18px",
    color: "#334155",
  },

  confirmBtn: {
    padding: "14px 45px",
    background: "#38bdf8",
    color: "white",
    fontWeight: "700",
    fontSize: "20px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    padding: "32px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 0 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "380px",
  },
};
