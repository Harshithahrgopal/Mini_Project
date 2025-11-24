import React, { useState } from "react";
import VerifierDashboard from "./VerifierDashboard";

export default function VoteSelectionPage() {
  const candidates = [
    { num: 1, name: "Candidate 1", party: "BJP", symbol: "🪔" },
    { num: 2, name: "Candidate 2", party: "INC", symbol: "🖐" },
    { num: 3, name: "Candidate 3", party: "JDS", symbol: "🌾" },
    { num: 4, name: "Candidate 4", party: "AAP", symbol: "🎈" },
    { num: 5, name: "Candidate 5", party: "Independent", symbol: "⭐" },
    { num: 6, name: "NOTA", party: "None Of The Above", symbol: "❌" }
  ];

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Submit Vote Handler
  const submitVote = () => {
    setSubmitted(true);

    setTimeout(() => {
      setRedirect(true);
    }, 2500); // After 2.5s redirect
  };

  // Redirect Condition
  if (redirect) return <VerifierDashboard />;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🗳 Cast Your Vote</h1>
      <p style={styles.subText}>Choose your candidate carefully — Your vote shapes the future.</p>

      <div style={styles.containerBox}>
        <div style={styles.grid}>
          {candidates.map((c, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                borderColor: selected === index ? "#38bdf8" : "#b3e6ff",
                background: selected === index ? "#e0f7ff" : "white",
                transform: selected === index ? "scale(1.03)" : "scale(1)"
              }}
            >
              <span style={styles.num}>{c.num}</span>

              <div style={styles.symbolArea}>
                <div style={styles.symbol}>{c.symbol}</div>
                <div style={styles.party}>{c.party}</div>
              </div>

              <div style={styles.name}>{c.name}</div>

              <button style={styles.voteBtn} onClick={() => setSelected(index)}>
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRM AREA */}
      <div
        style={{
          ...styles.bottomBox,
          display: selected !== null && !submitted ? "block" : "none"
        }}
      >
        <h3 style={styles.selectedTitle}>Selected Candidate</h3>
        <p style={styles.selectedName}>{candidates[selected]?.name}</p>
        <button style={styles.confirmBtn} onClick={submitVote}>Confirm Vote</button>
      </div>

      {/* SUCCESS POPUP */}
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
    width: "85%", margin: "0 auto",
    background: "white", padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px"
  },

  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    borderRadius: "14px",
    border: "3px solid #38bdf8",
    boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
    transition: "0.3s",
    minHeight: "100px"
  },

  num: { fontSize: "22px", fontWeight: "800", width: "50px", textAlign: "center" },
  symbolArea: { display: "flex", flexDirection: "column", alignItems: "center", width: "80px" },
  symbol: { fontSize: "45px" },
  party: { fontSize: "16px", fontWeight: "700", marginTop: "5px", color: "#0f172a" },

  name: { fontSize: "21px", fontWeight: "800", color: "#38bdf8", flex: "1", textAlign: "left", paddingLeft: "10px" },

  voteBtn: {
    background: "#38bdf8", color: "white",
    padding: "10px 28px",
    border: "none", borderRadius: "10px",
    fontSize: "18px", fontWeight: "700",
    cursor: "pointer", transition: "0.3s"
  },

  bottomBox: {
    background: "white",
    marginTop: "30px",
    width: "45%", padding: "22px",
    borderRadius: "16px", border: "2px solid #38bdf8",
    boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
    marginLeft: "auto",
    marginRight: "auto"
  },
  selectedTitle: { fontSize: "20px", fontWeight: "700" },
  selectedName: { fontSize: "26px", fontWeight: "800", color: "#38bdf8" },

  confirmBtn: {
    padding: "12px 35px",
    background: "#38bdf8",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer"
  },

  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex", justifyContent: "center", alignItems: "center"
  },
  popup: {
    background: "white", padding: "35px 60px",
    borderRadius: "15px", textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.4)"
  }
};
