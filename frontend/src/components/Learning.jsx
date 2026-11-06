import React from "react";
import { learningConcepts } from "../data/portfolioData";

function Learning() {
  return (
    <div>
      <h2 className="section-heading">What I’m Learning</h2>
      <p className="section-subtitle">
        Concepts I’ve explored and keep sharpening.
      </p>

      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "0.6rem 1.5rem",
          }}
        >
          {learningConcepts.map((item) => (
            <div
              key={item}
              style={{
                fontSize: "0.94rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.45rem",
              }}
            >
              <span style={{ color: "#4ade80", marginTop: "2px" }}>✅</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Learning;
