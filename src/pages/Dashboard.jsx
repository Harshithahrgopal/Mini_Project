import React, { useState, useEffect } from "react";
import candidatesDataRaw from "../data/candidates.json";
import wardsDataRaw from "../data/wards.json";
import electionsDataRaw from "../data/elections.json";
import resultsDataRaw from "../data/results.json";
import "../index.css";

// Helpers to parse MongoDB extended JSON format
function parseNumberInt(obj) {
  if (obj && typeof obj === "object" && "$numberInt" in obj) {
    return Number(obj["$numberInt"]);
  }
  return Number(obj);
}

function parseOid(obj) {
  if (obj && typeof obj === "object" && "$oid" in obj) {
    return obj["$oid"];
  }
  return obj;
}

export default function Dashboard() {
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [electionEnded, setElectionEnded] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [wards, setWards] = useState([]);

  // ⭐ dynamic results
  const [resultsData, setResultsData] = useState(resultsDataRaw);

  const [candidatePopup, setCandidatePopup] = useState(false);
  const [editCandidateIndex, setEditCandidateIndex] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    party: "",
    ward: "",
    phone: "",
    aadhar: "",
    address: "",
  });

  const [wardPopup, setWardPopup] = useState(false);
  const [editWardIndex, setEditWardIndex] = useState(null);
  const [wardForm, setWardForm] = useState({
    number: "",
    name: "",
    district: "",
    population: "",
    verifier: "",
  });

  // Load initial JSON data
  useEffect(() => {
    const parsedCandidates = candidatesDataRaw.map((c) => ({
      _id: parseOid(c._id),
      full_name: c.full_name,
      party: c.party,
      ward: parseNumberInt(c.ward_number),
      phone: c.phone_number,
      aadhar: c.aadhar_number,
      address: c.address,
    }));
    setCandidates(parsedCandidates);

    const parsedWards = wardsDataRaw.map((w) => ({
      _id: parseOid(w._id),
      number: parseNumberInt(w.ward_number),
      name: w.ward_name,
      district: w.district,
      population: parseNumberInt(w.population),
      verifier: w.verifier,
    }));
    setWards(parsedWards);

    if (electionsDataRaw.length > 0) {
      const election = electionsDataRaw[0];
      setStartTime(election.start_time);
      setEndTime(election.end_time);

      setStatus(election.status || "");
      setElectionEnded((election.status || "").toLowerCase() === "completed");
    }
  }, []);

  // Election timer end detection
  useEffect(() => {
    if (!endTime || electionEnded) return;

    const timer = setInterval(() => {
      if (new Date() >= new Date(endTime)) {
        setElectionEnded(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, electionEnded]);

  // =====================================================
  // 🔄 REFRESH BUTTON LOGIC (WORKING FOR YOUR JSON)
  // =====================================================
  const handleRefresh = () => {
    const updatedResults = JSON.parse(JSON.stringify(resultsData));
    const updatedWards = [...wards];

    // Get first ward key from results.json (e.g., "151")
    const firstWardKey = Object.keys(updatedResults)[0];

    // 1️⃣ Increase vote of 1st candidate in that ward
    if (updatedResults[firstWardKey] && updatedResults[firstWardKey][0]) {
      updatedResults[firstWardKey][0].votes += 1;
    }

    // 2️⃣ Increase population of that ward
    const wardIndex = wards.findIndex(
      (w) => String(w.number) === String(firstWardKey)
    );

    if (wardIndex !== -1) {
      updatedWards[wardIndex] = {
        ...updatedWards[wardIndex],
      };
    }

    setResultsData(updatedResults);
    setWards(updatedWards);
  };

  // =====================================================
  // RESULTS TABLE BUILDER
  // =====================================================
  const getResultsData = () => {
    return wards.map((ward) => {
      const wardKey = String(ward.number);
      const wardResults = resultsData[wardKey] || [];

      const totalVotes = wardResults.reduce(
        (sum, c) => sum + (c.votes || 0),
        0
      );

      const candidateShare = wardResults.map((c) => ({
        name: c.candidate_full_name,
        party: c.party,
        votes: c.votes,
      }));

      return {
        wardNumber: ward.number,
        population: ward.population,
        totalVotes,
        candidateShare,
      };
    });
  };

  // =====================================================
  // CANDIDATE FORM HANDLING
  // =====================================================
  const handleCandidateChange = (e) =>
    setCandidateForm({ ...candidateForm, [e.target.name]: e.target.value });

  const handleCandidateSave = (e) => {
    e.preventDefault();

    if (!candidateForm.name || !candidateForm.party || !candidateForm.ward)
      return;

    if (editCandidateIndex !== null) {
      const updated = [...candidates];
      updated[editCandidateIndex] = candidateForm;
      setCandidates(updated);
      setEditCandidateIndex(null);
    } else {
      setCandidates([...candidates, candidateForm]);
    }

    setCandidatePopup(false);

    setCandidateForm({
      name: "",
      party: "",
      ward: "",
      phone: "",
      aadhar: "",
      address: "",
    });
  };

  const handleCandidateEdit = (index) => {
    setEditCandidateIndex(index);
    setCandidateForm(candidates[index]);
    setCandidatePopup(true);
  };

  const handleCandidateDelete = (index) =>
    setCandidates(candidates.filter((_, i) => i !== index));

  // =====================================================
  // WARD FORM HANDLING
  // =====================================================
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

    setWardForm({
      number: "",
      name: "",
      district: "",
      population: "",
      verifier: "",
    });
  };

  const handleWardEdit = (index) => {
    setEditWardIndex(index);
    setWardForm(wards[index]);
    setWardPopup(true);
  };

  const handleWardDelete = (index) =>
    setWards(wards.filter((_, i) => i !== index));

  // =====================================================
  // RENDER UI
  // =====================================================
  return (
    <>
      {/* NAVBAR */}
      <header className="top-navbar">
        <div className="nav-title">E-Voting Admin Dashboard</div>

        <div className="nav-actions">
              <button
                className="nav-btn"
                onClick={handleRefresh}
              >
                🔄
              </button>
          <button className="nav-btn">Share</button>
          <button className="nav-btn">Export</button>
          <button className="nav-btn primary">This Week</button>
          <button className="nav-btn logout-btn" onClick={() => window.location.reload()}>
            Logout
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-logo">Admin Panel</h2>

          <button className={`menu-item ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
            📊 Dashboard
          </button>

          <button className={`menu-item ${activeTab === "candidate" ? "active" : ""}`} onClick={() => setActiveTab("candidate")}>
            🧑‍💼 Candidates
          </button>

          <button className={`menu-item ${activeTab === "ward" ? "active" : ""}`} onClick={() => setActiveTab("ward")}>
            📍 Wards
          </button>

          <button className={`menu-item ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            📈 Results
          </button>

          <button className="menu-item logout" onClick={() => window.location.reload()}>
            🚪 Logout
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-content">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="content-section">
              <h2 className="page-title">Election Overview</h2>

              <div className="overview-box">
                <div className="overview-card">
                  <h3>Candidates</h3>
                  <p className="ov-number">{candidates.length}</p>
                </div>

                <div className="overview-card">
                  <h3>Wards</h3>
                  <p className="ov-number">{wards.length}</p>
                </div>

                <div className="overview-card">
                  <h3>Election Status</h3>
                  <p className="ov-status">{status}</p>
                </div>
              </div>
            </div>
          )}

          {/* RESULTS TAB */}
          {activeTab === "results" && (
            <div className="content-section">
              <h2 className="page-title">Election Results</h2>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Total Population</th>
                    <th>Total Votes</th>
                    <th>Candidate Share</th>
                  </tr>
                </thead>

                <tbody>
                  {getResultsData().map((r, i) => (
                    <tr key={i}>
                      <td>{r.wardNumber}</td>
                      <td>{r.population}</td>
                      <td>{r.totalVotes}</td>
                      <td>
                        {r.candidateShare.length === 0
                          ? "No Candidates"
                          : r.candidateShare.map((c, j) => (
                              <div key={j}>
                                {c.name} ({c.party}): {c.votes}
                              </div>
                            ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================
              CANDIDATE MANAGEMENT TAB
          ================================= */}
          {activeTab === "candidate" && (
            <div className="content-section">
              <div className="header-row">
                <h2 className="page-title">Candidate Management</h2>

                <button
                  className="btn-primary small"
                  onClick={() => {
                    setCandidateForm({
                      name: "",
                      party: "",
                      ward: "",
                      phone: "",
                      aadhar: "",
                      address: "",
                    });
                    setEditCandidateIndex(null);
                    setCandidatePopup(true);
                  }}
                >
                  + Add Candidate
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Ward</th>
                    <th>Phone</th>
                    <th>Aadhar</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {candidates.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No candidate records
                      </td>
                    </tr>
                  ) : (
                    candidates.map((c, i) => (
                      <tr key={i}>
                        <td>{c.full_name || c.name}</td>
                        <td>{c.party}</td>
                        <td>{c.ward}</td>
                        <td>{c.phone}</td>
                        <td>{c.aadhar}</td>

                        <td>
                          <button className="edit-btn" onClick={() => handleCandidateEdit(i)}>
                            Edit
                          </button>

                          <button className="delete-btn" onClick={() => handleCandidateDelete(i)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Candidate Popup */}
              {candidatePopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>{editCandidateIndex !== null ? "Edit Candidate" : "Add Candidate"}</h3>

                    <form className="popup-form-layout" onSubmit={handleCandidateSave}>
                      <input className="popup-input" placeholder="Full Name" name="name" value={candidateForm.name} onChange={handleCandidateChange} required />

                      <input className="popup-input" placeholder="Party" name="party" value={candidateForm.party} onChange={handleCandidateChange} required />

                      <input className="popup-input" placeholder="Ward No" name="ward" value={candidateForm.ward} onChange={handleCandidateChange} required />

                      <input className="popup-input" placeholder="Phone" name="phone" value={candidateForm.phone} onChange={handleCandidateChange} />

                      <input className="popup-input" placeholder="Aadhar Number" name="aadhar" value={candidateForm.aadhar} onChange={handleCandidateChange} />

                      <textarea className="popup-input" placeholder="Address" name="address" value={candidateForm.address} onChange={handleCandidateChange}></textarea>

                      <div className="popup-btns">
                        <button className="btn-primary" type="submit">Save</button>

                        <button className="btn-secondary" type="button" onClick={() => setCandidatePopup(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================
              WARD MANAGEMENT TAB
          ================================= */}
          {activeTab === "ward" && (
            <div className="content-section">
              <div className="header-row">
                <h2 className="page-title">Ward Management</h2>

                <button
                  className="btn-primary small"
                  onClick={() => {
                    setWardForm({
                      number: "",
                      name: "",
                      district: "",
                      population: "",
                      verifier: "",
                    });
                    setEditWardIndex(null);
                    setWardPopup(true);
                  }}
                >
                  + Add Ward
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>District</th>
                    <th>Population</th>
                    <th>Verifier</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {wards.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No ward records
                      </td>
                    </tr>
                  ) : (
                    wards.map((w, i) => (
                      <tr key={i}>
                        <td>{w.number}</td>
                        <td>{w.name}</td>
                        <td>{w.district}</td>
                        <td>{w.population}</td>
                        <td>{w.verifier}</td>

                        <td>
                          <button className="edit-btn" onClick={() => handleWardEdit(i)}>
                            Edit
                          </button>

                          <button className="delete-btn" onClick={() => handleWardDelete(i)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Ward Popup */}
              {wardPopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>{editWardIndex !== null ? "Edit Ward" : "Add Ward"}</h3>

                    <form className="popup-form-layout" onSubmit={handleWardSave}>
                      <input className="popup-input" placeholder="Ward Number" name="number" value={wardForm.number} onChange={handleWardChange} required />

                      <input className="popup-input" placeholder="Ward Name" name="name" value={wardForm.name} onChange={handleWardChange} required />

                      <input className="popup-input" placeholder="District" name="district" value={wardForm.district} onChange={handleWardChange} required />

                      <input className="popup-input" placeholder="Population" name="population" value={wardForm.population} onChange={handleWardChange} />

                      <input className="popup-input" placeholder="Verifier" name="verifier" value={wardForm.verifier} onChange={handleWardChange} />

                      <div className="popup-btns">
                        <button className="btn-primary" type="submit">Save</button>

                        <button className="btn-secondary" type="button" onClick={() => setWardPopup(false)}>
                          Cancel
                        </button>
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
