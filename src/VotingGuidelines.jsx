import React, { useState } from "react";
import VoteSelectionPage from "./VoteSelectionPage";

export default function VotingGuidelines() {
  const [goToVote, setGoToVote] = useState(false);

  if (goToVote) return <VoteSelectionPage />;

  return (
    <>
      <style>
        {`
          .guidelines-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding-top: 60px;
            background: linear-gradient(135deg, #00307a, #1d4ed8);
          }
          .guidelines-card {
            background: white;
            width: 600px;
            padding: 30px 35px;
            border-radius: 18px;
            text-align: center;
            box-shadow: 0px 8px 25px rgba(0,0,0,0.25);
            animation: fadeIn 0.4s ease-out;
          }
          .guidelines-title {
            font-size: 30px;
            font-weight: 800;
            color: #00307a;
          }
          .guidelines-sub {
            font-size: 15px;
            margin-bottom: 15px;
            color: #475569;
          }
          .guidelines-list {
            text-align: left;
            font-size: 16px;
            line-height: 1.6rem;
            padding-left: 20px;
            margin-bottom: 20px;
            color: #1e293b;
          }
          .cast-btn {
            background: #00307a;
            color: white;
            padding: 14px 26px;
            font-size: 18px;
            font-weight: 700;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s ease;
          }
          .cast-btn:hover {
            background: #001d4d;
            transform: translateY(-3px);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="guidelines-wrapper">
        <div className="guidelines-card">
          <h1 className="guidelines-title">🗳 Voting Guidelines</h1>
          <p className="guidelines-sub">Read carefully before casting your vote</p>

          <ul className="guidelines-list">
            <li>✔ You can vote only once.</li>
            <li>✔ Select your candidate carefully.</li>
            <li>✔ Vote cannot be changed after submission.</li>
            <li>✔ Ensure stable internet during voting.</li>
            <li>✔ Your identity and vote are confidential.</li>
            <li>✔ Do not refresh or close the tab while voting.</li>
          </ul>

          <button className="cast-btn" onClick={() => setGoToVote(true)}>
            Proceed to Cast Vote
          </button>
        </div>
      </div>
    </>
  );
}
