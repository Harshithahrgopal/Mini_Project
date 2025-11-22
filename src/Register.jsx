import React, { useState } from "react";
import "./styles/auth.css";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    fullname: "",
    aadhar: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Admin Registered Successfully ✔");
    onSwitch();
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT IMAGE */}
      <div className="auth-left">
        <img 
          src="/background-login.jpg"
          className="left-img"
          alt="register-visual"
        />
      </div>

      {/* RIGHT CARD */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="title">Voter Registration</h2>

          <form onSubmit={handleRegister} className="form">
            <input name="fullname" className="input" placeholder="Full Name" onChange={handleChange} />
            <input name="aadhar" className="input" placeholder="Aadhar Number" onChange={handleChange} />
            <input name="phone" className="input" placeholder="Phone Number" onChange={handleChange} />
            <input name="email" className="input" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" className="input" placeholder="Password" onChange={handleChange} />

            <button className="btn-primary" type="submit">Register</button>
          </form>

          <p className="link" onClick={onSwitch}>
            Not a Voter? <span>Login as Admin / Verifier </span>
          </p>
        </div>
      </div>
    </div>
  );
}
