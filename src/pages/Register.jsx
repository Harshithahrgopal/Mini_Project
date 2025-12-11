import React, { useState } from "react";
import "../styles/auth.css";
import initialVoters from "../data/voters.json"; // Make sure this path is correct

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    full_name: "",
    aadhar_number: "",
    voter_id: "",
    ward_number: "",
    phone_number: "",
  });

  // Load voters from localStorage or fallback to initialVoters.json
  const [voters, setVoters] = useState(() => {
    const saved = localStorage.getItem("voters");
    return saved ? JSON.parse(saved) : initialVoters;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Convert ward_number to integer
    const wardNum = parseInt(form.ward_number, 10);

    if (isNaN(wardNum)) {
      alert("Ward Number must be a valid number");
      return;
    }

    // Create a new voter object matching the JSON structure
    const newVoter = {
      _id: Date.now().toString(), // simple unique id
      full_name: form.full_name,
      aadhar_number: form.aadhar_number,
      voter_id: form.voter_id,
      ward_number: wardNum,
      phone_number: form.phone_number,
    };

    // Check if aadhar_number or voter_id already exists (optional validation)
    const aadharExists = voters.some(v => v.aadhar_number === newVoter.aadhar_number);
    const voterIdExists = voters.some(v => v.voter_id === newVoter.voter_id);

    if (aadharExists) {
      alert("Aadhar number already registered.");
      return;
    }
    if (voterIdExists) {
      alert("Voter ID already registered.");
      return;
    }

    // Add new voter
    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    localStorage.setItem("voters", JSON.stringify(updatedVoters));

    alert("Voter Registered Successfully ✔");

    // Clear form
    setForm({
      full_name: "",
      aadhar_number: "",
      voter_id: "",
      ward_number: "",
      phone_number: "",
    });

    // Switch to login or other screen
    onSwitch();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img
          src="/background-login.jpg"
          className="left-img"
          alt="register-visual"
        />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="title">Voter Registration</h2>

          <form onSubmit={handleRegister} className="form">
            <input
              name="full_name"
              className="input"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <input
              name="aadhar_number"
              className="input"
              placeholder="Aadhar Number"
              value={form.aadhar_number}
              onChange={handleChange}
              required
            />
            <input
              name="voter_id"
              className="input"
              placeholder="Voter ID"
              value={form.voter_id}
              onChange={handleChange}
              required
            />
            <input
              name="ward_number"
              className="input"
              placeholder="Ward Number"
              value={form.ward_number}
              onChange={handleChange}
              required
              type="number"
            />
            <input
              name="phone_number"
              className="input"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              required
            />

            <button className="btn-primary" type="submit">
              Register
            </button>
          </form>

          <p className="link" onClick={onSwitch}>
            Already have an account? <span>Login as Verifier </span>
          </p>
        </div>
      </div>
    </div>
  );
}
