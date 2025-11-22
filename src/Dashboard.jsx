import React, { useState, useEffect } from "react";
import "./index.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  // TIMER STATES
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [electionEnded, setElectionEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (endTime && new Date() >= new Date(endTime)) {
        setElectionEnded(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  // =================== CANDIDATES ===================
  const [candidates, setCandidates] = useState([]);
  const [candidatePopup, setCandidatePopup] = useState(false);
  const [editCandidateIndex, setEditCandidateIndex] = useState(null);

  const [candidateForm, setCandidateForm] = useState({
    name: "",
    party: "",
    ward: "",
    phone: "",
    aadhar: "",
    address: ""
  });

  const handleCandidateChange = (e) =>
    setCandidateForm({ ...candidateForm, [e.target.name]: e.target.value });

  const handleCandidateSave = (e) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.party || !candidateForm.ward) return;

    if (editCandidateIndex !== null) {
      const updated = [...candidates];
      updated[editCandidateIndex] = candidateForm;
      setCandidates(updated);
      setEditCandidateIndex(null);
    } else {
      setCandidates([...candidates, candidateForm]);
    }

    setCandidatePopup(false);
    setCandidateForm({ name: "", party: "", ward: "", phone: "", aadhar: "", address: "" });
  };

  const handleCandidateDelete = (index) =>
    setCandidates(candidates.filter((_, i) => i !== index));

  const handleCandidateEdit = (index) => {
    setEditCandidateIndex(index);
    setCandidateForm(candidates[index]);
    setCandidatePopup(true);
  };

  // =================== WARDS ===================
  const [wards, setWards] = useState([]);
  const [wardPopup, setWardPopup] = useState(false);
  const [editWardIndex, setEditWardIndex] = useState(null);

  const [wardForm, setWardForm] = useState({
    number: "",
    name: "",
    district: "",
    population: "",
    verifier: ""
  });

  const handleWardChange = (e) =>
    setWardForm({ ...wardForm, [e.target.name]: e.target.value });

  const handleWardSave = (e) => {
    e.preventDefault();
    if (!wardForm.number || !wardForm.name || !wardForm.district) return;

    if (editWardIndex !== null) {
      const updated = [...wards];
      updated[editWardIndex] = wardForm;
      setWards(updated);
      setEditWardIndex(null);
    } else {
      setWards([...wards, wardForm]);
    }

    setWardPopup(false);
    setWardForm({ number: "", name: "", district: "", population: "", verifier: "" });
  };

  const handleWardDelete = (index) =>
    setWards(wards.filter((_, i) => i !== index));

  const handleWardEdit = (index) => {
    setEditWardIndex(index);
    setWardForm(wards[index]);
    setWardPopup(true);
  };

  // ========= MOCK RESULT CALCULATION =========
  const getResultsData = () => {
    return wards.map((w) => {
      const totalVotes = Math.floor(Number(w.population) * 0.65);
      const votePct = ((totalVotes / Number(w.population)) * 100).toFixed(1);

      const votesPerCandidate = candidates
        .filter((c) => c.ward === w.number)
        .map((c) => ({
          name: c.name,
          pct: (100 / (candidates.filter(cd => cd.ward === w.number).length || 1)).toFixed(1)
        }));

      return {
        wardNumber: w.number,
        population: Number(w.population),
        totalVotes,
        percent: votePct,
        candidateShare: votesPerCandidate
      };
    });
  };

  return (
    <>
      {/* ========= TOP NAVBAR ========= */}
      <header className="top-navbar">
        <div className="nav-title">E-Voting Admin Dashboard</div>

        <div className="nav-actions">
          <button className="nav-btn">Share</button>
          <button className="nav-btn">Export</button>
          <button className="nav-btn primary">This Week</button>
          <button className="nav-btn logout-btn" onClick={() => window.location.reload()}>
            Logout
          </button>
        </div>
      </header>

      {/* ========= MAIN LAYOUT ========= */}
      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-logo">Admin Panel</h2>

          <button className={`menu-item ${activeTab==="home" && "active"}`} onClick={()=>setActiveTab("home")}>📊 Dashboard</button>
          <button className={`menu-item ${activeTab==="candidate" && "active"}`} onClick={()=>setActiveTab("candidate")}>🧑‍💼 Candidates</button>
          <button className={`menu-item ${activeTab==="ward" && "active"}`} onClick={()=>setActiveTab("ward")}>📍 Wards</button>
          <button
            className={`menu-item ${activeTab==="results" && "active"}`}
            onClick={() => electionEnded && setActiveTab("results")}
            disabled={!electionEnded}
          >
            📈 Results {!electionEnded && "(Locked)"}
          </button>
          <button className="menu-item logout" onClick={() => window.location.reload()}>🚪 Logout</button>
        </aside>

        {/* ========= MAIN CONTENT ========= */}
        <main className="dashboard-content">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="content-section">
              <h2 className="page-title">Election Overview</h2>

              <div className="overview-box">
                <div className="overview-card"><h3>Candidates</h3><p className="ov-number">{candidates.length}</p></div>
                <div className="overview-card"><h3>Wards</h3><p className="ov-number">{wards.length}</p></div>
                <div className="overview-card"><h3>Status</h3><p className="ov-status">{electionEnded ? "Completed" : "Running / Pending"}</p></div>
              </div>

              <div className="timer-box">
                <h3>Election Timer</h3>
                <div className="timer-form">
                  <input type="datetime-local" className="input-field" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
                  <input type="datetime-local" className="input-field" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />
                  <button className="btn-primary">Save Timer</button>
                </div>
              </div>
            </div>
          )}

          {/* RESULTS TAB */}
          {activeTab === "results" && electionEnded && (
            <div className="content-section">
              <h2 className="page-title">Election Results</h2>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Total Population</th>
                    <th>Voted</th>
                    <th>Vote %</th>
                    <th>Candidate Share</th>
                  </tr>
                </thead>
                <tbody>
                  {getResultsData().map((r, i) => (
                    <tr key={i}>
                      <td>{r.wardNumber}</td>
                      <td>{r.population}</td>
                      <td>{r.totalVotes}</td>
                      <td>{r.percent}%</td>
                      <td>
                        {r.candidateShare.length === 0
                          ? "No Candidates"
                          : r.candidateShare.map((c, j) => (
                              <div key={j}>{c.name}: {c.pct}%</div>
                            ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CANDIDATE TAB */}
          {activeTab === "candidate" && (
            <div className="content-section">
              <div className="header-row">
                <h2 className="page-title">Candidate Management</h2>
                <button className="btn-primary small" onClick={() => setCandidatePopup(true)}>+ Add Candidate</button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Party</th><th>Ward</th><th>Phone</th><th>Aadhar</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.length === 0 ? (
                    <tr><td colSpan="6" className="empty-row">No candidate records</td></tr>
                  ) : (
                    candidates.map((c, i) => (
                      <tr key={i}>
                        <td>{c.name}</td><td>{c.party}</td><td>{c.ward}</td><td>{c.phone}</td><td>{c.aadhar}</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleCandidateEdit(i)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleCandidateDelete(i)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {candidatePopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>{editCandidateIndex !== null ? "Edit Candidate" : "Add Candidate"}</h3>
                    <form className="popup-form-layout" onSubmit={handleCandidateSave}>
                      <input className="popup-input" name="name" placeholder="Full Name" value={candidateForm.name} onChange={handleCandidateChange}/>
                      <input className="popup-input" name="party" placeholder="Party" value={candidateForm.party} onChange={handleCandidateChange}/>
                      <input className="popup-input" name="ward" placeholder="Ward No" value={candidateForm.ward} onChange={handleCandidateChange}/>
                      <input className="popup-input" name="phone" placeholder="Phone" value={candidateForm.phone} onChange={handleCandidateChange}/>
                      <input className="popup-input" name="aadhar" placeholder="Aadhar Number" value={candidateForm.aadhar} onChange={handleCandidateChange}/>
                      <textarea className="popup-input" name="address" placeholder="Address" value={candidateForm.address} onChange={handleCandidateChange}/>

                      <div className="popup-btns">
                        <button className="btn-primary" type="submit">Save</button>
                        <button className="btn-secondary" type="button" onClick={() => { setCandidatePopup(false); setEditCandidateIndex(null); }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WARD TAB */}
          {activeTab === "ward" && (
            <div className="content-section">
              <div className="header-row">
                <h2 className="page-title">Ward Management</h2>
                <button className="btn-primary small" onClick={() => setWardPopup(true)}>+ Add Ward</button>
              </div>

              <table className="data-table">
                <thead>
                  <tr><th>No</th><th>Name</th><th>District</th><th>Population</th><th>Verifier</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {wards.length === 0 ? (
                    <tr><td colSpan="6" className="empty-row">No ward records</td></tr>
                  ) : (
                    wards.map((w, i) => (
                      <tr key={i}>
                        <td>{w.number}</td><td>{w.name}</td><td>{w.district}</td><td>{w.population}</td><td>{w.verifier}</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleWardEdit(i)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleWardDelete(i)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {wardPopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>{editWardIndex !== null ? "Edit Ward" : "Add Ward"}</h3>
                    <form className="popup-form-layout" onSubmit={handleWardSave}>
                      <input className="popup-input" name="number" placeholder="Ward Number" value={wardForm.number} onChange={handleWardChange}/>
                      <input className="popup-input" name="name" placeholder="Ward Name" value={wardForm.name} onChange={handleWardChange}/>
                      <input className="popup-input" name="district" placeholder="District" value={wardForm.district} onChange={handleWardChange}/>
                      <input className="popup-input" name="population" placeholder="Population" value={wardForm.population} onChange={handleWardChange}/>
                      <input className="popup-input" name="verifier" placeholder="Verifier" value={wardForm.verifier} onChange={handleWardChange}/>

                      <div className="popup-btns">
                        <button className="btn-primary">Save</button>
                        <button className="btn-secondary" type="button" onClick={() => { setWardPopup(false); setEditWardIndex(null); }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
