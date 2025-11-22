// src/StatsPanel.jsx
import React from "react";

export default function StatsPanel({ stats }) {
  const { total, perType, lastAttack } = stats;

  const fmtTime = (ts) => {
    if (!ts) return "-";
    const d = new Date(ts);
    return d.toLocaleTimeString();
  };

  return (
    <div className="stats">
      <h2>Attack Telemetry</h2>

      <div className="stats-card stats-primary">
        <div className="stats-label">Total Simulated Attacks</div>
        <div className="stats-value">{total}</div>
        <div className="stats-caption">
          Attack events since you opened the page.
        </div>
      </div>

      <div className="stats-grid">
        <StatsChip label="XSS" value={perType["XSS"]} />
        <StatsChip label="SQL Injection" value={perType["SQLi"]} />
        <StatsChip label="Brute Force" value={perType["Brute Force"]} />
        <StatsChip label="RCE" value={perType["RCE"]} />
      </div>

      <div className="stats-card stats-secondary">
        <div className="stats-label">Last Attack Event</div>
        {lastAttack ? (
          <>
            <p className="last-attack-type">
              {lastAttack.type} attack on server #{lastAttack.targetId}
            </p>
            <p className="last-attack-meta">
              Source:{" "}
              {lastAttack.fromExternal ? "external node 🌐" : "internal host"}
            </p>
            <p className="last-attack-meta">Time: {fmtTime(lastAttack.at)}</p>
          </>
        ) : (
          <p className="last-attack-meta">Waiting for first simulated attack…</p>
        )}
      </div>

      <div className="stats-note">
        All data is <strong>randomly generated</strong> for visualization only.
        No real logs, traffic, or IPs are used.
      </div>
    </div>
  );
}

function StatsChip({ label, value }) {
  return (
    <div className="stats-chip">
      <span className="stats-chip-label">{label}</span>
      <span className="stats-chip-value">{value}</span>
    </div>
  );
}
