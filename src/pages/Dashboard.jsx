import React, { useState, useEffect } from "react";
import candidatesDataRaw from "../data/candidates.json";
import wardsDataRaw from "../data/wards.json";
import electionsDataRaw from "../data/elections.json";
import resultsDataRaw from "../data/results.json"; // <-- Import results JSON
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

  // Timer states
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [electionEnded, setElectionEnded] = useState(false);

  // Candidates and wards states
  const [candidates, setCandidates] = useState([]);
  const [wards, setWards] = useState([]);

  // Candidate management states
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

  // Ward management states
  const [wardPopup, setWardPopup] = useState(false);
  const [editWardIndex, setEditWardIndex] = useState(null);
  const [wardForm, setWardForm] = useState({
    number: "",
    name: "",
    district: "",
    population: "",
    verifier: "",
  });

  // Parse and load JSON data on mount
  useEffect(() => {
    // Parse candidates
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

    // Parse wards
    const parsedWards = wardsDataRaw.map((w) => ({
      _id: parseOid(w._id),
      number: parseNumberInt(w.ward_number),
      name: w.ward_name,
      district: w.district,
      population: parseNumberInt(w.population),
      verifier: w.verifier,
    }));
    setWards(parsedWards);

    // Set election timer and status
    if (electionsDataRaw.length > 0) {
      const election = electionsDataRaw[0];
      setStartTime(election.start_time);
      setEndTime(election.end_time);

      setStatus(election.status || "");
      setElectionEnded(
        (election.status || "").toLowerCase() === "completed"
      );
    }
  }, []);

  // Election timer effect to update electionEnded dynamically
  useEffect(() => {
    if (!endTime || electionEnded) return;

    const timer = setInterval(() => {
      if (new Date() >= new Date(endTime)) {
        setElectionEnded(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, electionEnded]);

  // Handlers for candidate form inputs
  const handleCandidateChange = (e) =>
    setCandidateForm({ ...candidateForm, [e.target.name]: e.target.value });

  // Save candidate (add or edit)
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

  // Delete candidate
  const handleCandidateDelete = (index) =>
    setCandidates(candidates.filter((_, i) => i !== index));

  // Edit candidate (open popup with data)
  const handleCandidateEdit = (index) => {
    setEditCandidateIndex(index);
    setCandidateForm(candidates[index]);
    setCandidatePopup(true);
  };

  // Handlers for ward form inputs
  const handleWardChange = (e) =>
    setWardForm({ ...wardForm, [e.target.name]: e.target.value });

  // Save ward (add or edit)
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

  // Delete ward
  const handleWardDelete = (index) =>
    setWards(wards.filter((_, i) => i !== index));

  // Edit ward (open popup with data)
  const handleWardEdit = (index) => {
    setEditWardIndex(index);
    setWardForm(wards[index]);
    setWardPopup(true);
  };

  // Calculate real election results data from results.json
  const getResultsData = () => {
    return wards.map((ward) => {
      const wardNumberStr = String(ward.number);
      const wardResults = resultsDataRaw[wardNumberStr] || [];

      const totalVotes = wardResults.reduce((sum, c) => sum + (c.votes || 0), 0);

      const votePct = ward.population
        ? ((totalVotes / ward.population) * 100).toFixed(1)
        : "0.0";

      const candidateShare = wardResults.map((c) => {
        const pct =
          totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : "0.0";
        return {
          name: c.candidate_full_name,
          party: c.party,
          votes: c.votes,
          pct,
        };
      });

      return {
        wardNumber: ward.number,
        population: ward.population,
        totalVotes,
        percent: votePct,
        candidateShare,
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
          <button
            className="nav-btn logout-btn"
            onClick={() => window.location.reload()}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ========= MAIN LAYOUT ========= */}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-logo">Admin Panel</h2>

          <button
            className={`menu-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            📊 Dashboard
          </button>
          <button
            className={`menu-item ${activeTab === "candidate" ? "active" : ""}`}
            onClick={() => setActiveTab("candidate")}
          >
            🧑‍💼 Candidates
          </button>
          <button
            className={`menu-item ${activeTab === "ward" ? "active" : ""}`}
            onClick={() => setActiveTab("ward")}
          >
            📍 Wards
          </button>
          {/* RESULTS TAB UNLOCKED ALWAYS */}
          <button
            className={`menu-item ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
            title=""
          >
            📈 Results
          </button>
          <button
            className="menu-item logout"
            onClick={() => window.location.reload()}
          >
            🚪 Logout
          </button>
        </aside>

        {/* ========= MAIN CONTENT ========= */}
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

              <div className="timer-box">
                <h3>Election Timer</h3>
                <div className="timer-form">
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => alert("Timer saved (not implemented)")}
                  >
                    Save Timer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RESULTS TAB - ALWAYS VISIBLE */}
          {activeTab === "results" && (
            <div className="content-section">
              <h2 className="page-title">Election Results</h2>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Total Population</th>
                    <th>Voted</th>
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

          {/* CANDIDATE TAB */}
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
                      <tr key={c._id || i}>
                        <td>{c.full_name || c.name}</td>
                        <td>{c.party}</td>
                        <td>{c.ward}</td>
                        <td>{c.phone}</td>
                        <td>{c.aadhar}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleCandidateEdit(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleCandidateDelete(i)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Candidate popup */}
              {candidatePopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>
                      {editCandidateIndex !== null
                        ? "Edit Candidate"
                        : "Add Candidate"}
                    </h3>
                    <form
                      className="popup-form-layout"
                      onSubmit={handleCandidateSave}
                    >
                      <input
                        className="popup-input"
                        name="name"
                        placeholder="Full Name"
                        value={candidateForm.name}
                        onChange={handleCandidateChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="party"
                        placeholder="Party"
                        value={candidateForm.party}
                        onChange={handleCandidateChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="ward"
                        placeholder="Ward No"
                        value={candidateForm.ward}
                        onChange={handleCandidateChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="phone"
                        placeholder="Phone"
                        value={candidateForm.phone}
                        onChange={handleCandidateChange}
                      />
                      <input
                        className="popup-input"
                        name="aadhar"
                        placeholder="Aadhar Number"
                        value={candidateForm.aadhar}
                        onChange={handleCandidateChange}
                      />
                      <textarea
                        className="popup-input"
                        name="address"
                        placeholder="Address"
                        value={candidateForm.address}
                        onChange={handleCandidateChange}
                      />

                      <div className="popup-btns">
                        <button className="btn-primary" type="submit">
                          Save
                        </button>
                        <button
                          className="btn-secondary"
                          type="button"
                          onClick={() => {
                            setCandidatePopup(false);
                            setEditCandidateIndex(null);
                          }}
                        >
                          Cancel
                        </button>
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
                      <tr key={w._id || i}>
                        <td>{w.number}</td>
                        <td>{w.name}</td>
                        <td>{w.district}</td>
                        <td>{w.population}</td>
                        <td>{w.verifier}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => handleWardEdit(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleWardDelete(i)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Ward popup */}
              {wardPopup && (
                <div className="popup-overlay">
                  <div className="popup-box">
                    <h3>{editWardIndex !== null ? "Edit Ward" : "Add Ward"}</h3>
                    <form className="popup-form-layout" onSubmit={handleWardSave}>
                      <input
                        className="popup-input"
                        name="number"
                        placeholder="Ward Number"
                        value={wardForm.number}
                        onChange={handleWardChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="name"
                        placeholder="Ward Name"
                        value={wardForm.name}
                        onChange={handleWardChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="district"
                        placeholder="District"
                        value={wardForm.district}
                        onChange={handleWardChange}
                        required
                      />
                      <input
                        className="popup-input"
                        name="population"
                        placeholder="Population"
                        type="number"
                        value={wardForm.population}
                        onChange={handleWardChange}
                      />
                      <input
                        className="popup-input"
                        name="verifier"
                        placeholder="Verifier"
                        value={wardForm.verifier}
                        onChange={handleWardChange}
                      />

                      <div className="popup-btns">
                        <button className="btn-primary" type="submit">
                          Save
                        </button>
                        <button
                          className="btn-secondary"
                          type="button"
                          onClick={() => {
                            setWardPopup(false);
                            setEditWardIndex(null);
                          }}
                        >
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
