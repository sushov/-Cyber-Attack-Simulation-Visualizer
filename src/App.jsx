// src/App.jsx
import React, { useEffect, useState } from "react";
import NetworkCanvas from "./NetworkCanvas";
import StatsPanel from "./StatsPanel";

const ATTACK_TYPES = ["XSS", "SQLi", "Brute Force", "RCE"];

const ATTACK_COLORS = {
  XSS: "#facc15",           // yellow
  SQLi: "#38bdf8",          // blue
  "Brute Force": "#f97316", // orange
  RCE: "#ef4444",           // red
};

const NUM_SERVERS = 18;
const ATTACK_LIFETIME_MS = 2600;

function generateServers() {
  const servers = [];
  for (let i = 0; i < NUM_SERVERS; i++) {
    servers.push({
      id: i,
      x: Math.random(),
      y: Math.random(),
    });
  }
  return servers;
}

export default function App() {
  const [servers] = useState(() => generateServers());
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    perType: {
      XSS: 0,
      SQLi: 0,
      "Brute Force": 0,
      RCE: 0,
    },
    lastAttack: null,
  });

  const [isPaused, setIsPaused] = useState(false);
  const [attackSpeed, setAttackSpeed] = useState(1000); // ms between attacks
  const [logs, setLogs] = useState([]); // reserved for future log feed UI

  function addLogEntry(type, targetId, fromExternal) {
    const timestamp = new Date().toLocaleTimeString();
    const sourceLabel = fromExternal ? "external node" : "internal host";

    const entry = `[${timestamp}] ${type} on server #${targetId} from ${sourceLabel}`;

    setLogs((prev) => {
      const next = [entry, ...prev];
      // keep only latest 40 entries
      return next.slice(0, 40);
    });
  }

  function spawnAttack() {
    const now = Date.now();
    const target = servers[Math.floor(Math.random() * servers.length)];
    const srcIsExternal = Math.random() < 0.4;

    const attackType =
      ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

    const source = srcIsExternal
      ? {
          external: true,
          x: Math.random() < 0.5 ? -0.1 : 1.1,
          y: Math.random(),
        }
      : servers[Math.floor(Math.random() * servers.length)];

    const newAttack = {
      id: `${now}-${Math.random()}`,
      type: attackType,
      color: ATTACK_COLORS[attackType],
      startedAt: now,
      source,
      target,
    };

    setAttacks((prev) => {
      const filtered = prev.filter(
        (a) => now - a.startedAt < ATTACK_LIFETIME_MS
      );
      return [...filtered, newAttack];
    });

    setStats((prev) => ({
      total: prev.total + 1,
      perType: {
        ...prev.perType,
        [attackType]: prev.perType[attackType] + 1,
      },
      lastAttack: {
        type: attackType,
        at: now,
        targetId: target.id,
        fromExternal: !!source.external,
      },
    }));

    // reserved for future UI: log feed
    addLogEntry(attackType, target.id, !!source.external);
  }

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      spawnAttack();
    }, attackSpeed);

    return () => clearInterval(interval);
  }, [attackSpeed, isPaused, servers]);

  const activeAttackTargets = new Set(
    attacks
      .map((a) => (a.target ? a.target.id : null))
      .filter((id) => id != null)
  );

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Cyber Attack Simulation Visualizer</h1>
          <p className="subtitle">
            Simulated live attacks on a virtual network – frontend only, no real
            traffic.
          </p>
        </div>
        <span className="badge">Demo · Security · React</span>
      </header>

      <main className="layout">
        <section className="panel panel-main">
          {/* Controls: Pause / Resume + Attack Speed */}
          <div className="controls">
            <button
              className="btn"
              onClick={() => setIsPaused((prev) => !prev)}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>

            <div className="slider-wrap">
              <label>
                Attack Speed: {(1000 / attackSpeed).toFixed(1)} / sec
              </label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={attackSpeed}
                onChange={(e) => setAttackSpeed(Number(e.target.value))}
              />
            </div>
          </div>

          <NetworkCanvas
            servers={servers}
            attacks={attacks}
            activeTargets={activeAttackTargets}
          />
        </section>

        <aside className="panel panel-side">
          <StatsPanel stats={stats} />
          {/* logs state is available if you want to show a log feed later */}
        </aside>
      </main>

      <footer className="footer">
        <span>All activity is simulated · No real systems harmed ⚔️</span>
      </footer>
    </div>
  );
}
