import React, { useState } from "react";
import "./index.css";

export default function VoteSelectionPage() {
  const candidates = [
    { name: "Candidate 1", party:"BJP", symbol:"🪔 Lotus" },
    { name: "Candidate 2", party:"INC", symbol:"🖐 Hand" },
    { name: "Candidate 3", party:"JDS", symbol:"🌾 Farmer" }
  ];

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const submitVote = () => {
    setSubmitted(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🗳 Cast Your Vote</h1>

      <div style={styles.card}>
        {/* LEFT COLUMN | CANDIDATE LIST */}
        <div style={styles.left}>
          <h2 style={{ marginBottom:"15px", color:"#1e293b" }}>Candidates</h2>
          {candidates.map((c, i) => (
            <button
              key={i}
              style={{
                ...styles.candidateBtn,
                border: selected === i ? "2px solid #2563eb" : "2px solid #e2e8f0",
                background: selected === i ? "#dbeafe" : "white"
              }}
              onClick={() => setSelected(i)}
            >
              <span style={{ fontWeight:"600" }}>{c.name}</span>
              <br />
              <span style={{ color:"#475569", fontSize:"14px" }}>{c.party} • {c.symbol}</span>
            </button>
          ))}
        </div>

        {/* RIGHT COLUMN | SELECTION & CONFIRM */}
        <div style={styles.right}>
          {selected === null ? (
            <p style={{ color:"#475569", fontSize:"18px" }}>Please select a candidate from the list</p>
          ) : (
            <div>
              <h2 style={{ marginBottom:"15px", color:"#0f172a" }}>
                Selected Candidate:
              </h2>
              <p style={{ fontSize:"22px", fontWeight:"700", marginBottom:"15px" }}>
                {candidates[selected].name}
              </p>

              <button style={styles.confirmBtn} onClick={submitVote}>
                Confirm Vote
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {submitted && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{ color:"#1d4ed8", marginBottom:"10px" }}>🎉 Vote Cast Successfully</h2>
            <p style={{ fontSize:"16px", color:"#334155" }}>Thank you for participating</p>
          </div>
        </div>
      )}
    </div>
  );
}


/* INLINE CSS */
const styles = {
  page: {
    background:"#e8f0ff",
    minHeight:"100vh",
    textAlign:"center",
    padding:"40px"
  },
  heading: {
    fontSize:"34px",
    fontWeight:"700",
    marginBottom:"30px"
  },
  card: {
    width:"70%",
    margin:"0 auto",
    display:"flex",
    gap:"25px",
    padding:"25px",
    background:"white",
    borderRadius:"15px",
    boxShadow:"0 10px 25px rgba(0,0,0,0.15)",
    justifyContent:"space-between"
  },
  left: {
    width:"40%",
    display:"flex",
    flexDirection:"column",
    gap:"12px"
  },
  candidateBtn: {
    padding:"12px",
    textAlign:"left",
    borderRadius:"10px",
    background:"white",
    cursor:"pointer",
    fontSize:"18px"
  },
  right: {
    width:"60%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    background:"#f8fafc",
    borderRadius:"10px",
    padding:"25px",
    border:"2px solid #e2e8f0"
  },
  confirmBtn: {
    padding:"12px 20px",
    background:"#2563eb",
    border:"none",
    borderRadius:"8px",
    color:"white",
    fontSize:"18px",
    cursor:"pointer",
    marginTop:"15px"
  },
  overlay: {
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.5)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  popup: {
    background:"white",
    padding:"30px 50px",
    borderRadius:"12px",
    textAlign:"center",
    boxShadow:"0 8px 20px rgba(0,0,0,0.2)"
  }
};
