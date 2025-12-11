import React, { useState } from "react";
import VoteSelectionPage from "./VoteSelectionPage";

export default function VotingGuidelines() {
  const [goToVote, setGoToVote] = useState(false);

  if (goToVote) return <VoteSelectionPage />;

  return (
    <>
      <style>
        {`
          .wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #38bdf8;
            padding: 40px 20px;
          }

          .card {
            background: white;
            width: 800px;
            padding: 40px;
            border-radius: 18px;
            box-shadow: 0px 6px 20px rgba(0,0,0,0.25);
            animation: fadeIn 0.4s ease-out;
          }

          .title {
            font-size: 34px;
            font-weight: 800;
            text-align: center;
            color: #38bdf8;
            margin-bottom: 10px;
          }

          .subtitle {
            text-align: center;
            font-size: 16px;
            margin-bottom: 25px;
            color: #334155;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px 18px;
            margin-bottom: 30px;
            padding: 0 15px;
          }

          .rule-box {
            background: #f0f9ff;
            border-left: 6px solid #38bdf8;
            padding: 14px 16px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 500;
            color: #0f172a;
          }
          .cast-btn {
            display: block;
            margin: auto;
            background: #38bdf8;
            color: white;
            padding: 15px 45px;
            font-size: 20px;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            text-align: center;
            width: auto;
            max-width: 100%;
          }

          .cast-btn:hover {
            background: #0ea5e9;
            transform: scale(1.07);
            box-shadow: 0 0 18px rgba(56,189,248,0.7);
          }

          .cast-btn:active {
            transform: scale(0.95);
          }

          .quote-box {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            font-style: italic;
            color: #334155;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="wrapper">
        <div className="card">
          <h1 className="title">🗳 Voting Guidelines</h1>
          <p className="subtitle">Please read the instructions carefully before casting your vote</p>

          <div className="grid">
            <div className="rule-box">✔ You are allowed to vote only once.</div>
            <div className="rule-box">✔ Review candidate details before voting.</div>
            <div className="rule-box">✔ Voting cannot be changed after confirmation.</div>
            <div className="rule-box">✔ Maintain stable network connectivity.</div>
            <div className="rule-box">✔ Your vote is confidential and secure.</div>
            <div className="rule-box">✔ Do not refresh or exit during voting.</div>
            <div className="rule-box">✔ Any fraudulent attempt is punishable by law.</div>
            <div className="rule-box">✔ Follow booth official instructions strictly.</div>
          </div>

          <button className="cast-btn" onClick={() => setGoToVote(true)}>
            Proceed to Cast Vote
          </button>

          <div className="quote-box">
            ✨ *“The ballot is stronger than the bullet.”* — Abraham Lincoln
          </div>
        </div>
      </div>
    </>
  );
}
