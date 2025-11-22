
````markdown
# 🛡️ Cyber Attack Simulation Visualizer
*A real-time, browser-based cyber attack simulation and network visualization dashboard.*

---

## 📌 Overview

Cyber Attack Simulation Visualizer is a **frontend-only cyber range simulator** that models real-time cyber attacks on a virtual network.  
Using **React**, **HTML Canvas**, and **state-driven animation**, the tool generates and visualizes attack events such as XSS, SQL Injection, Brute Force, and RCE.

All traffic, telemetry, and animations are **fully simulated**, requiring:

- ❌ No backend  
- ❌ No APIs  
- ❌ No real network scanning  

This makes it ideal for **educational demos**, **SOC-style visualizations**, and **portfolio showcases**.

---

## 🧠 Core Concepts & Architecture

### **1. Network Topology Generator**
The app initializes a virtual network by generating N servers, each with:

```json
{ "id": number, "x": float, "y": float }
````

* Coordinates are normalized (0–1 range) then mapped to canvas pixels
* Optional faint line edges form a synthetic "network graph"

### **2. Attack Event Engine**

Each attack event has:

```json
{
  "id": string,
  "type": "XSS" | "SQLi" | "Brute Force" | "RCE",
  "color": "#hex",
  "startedAt": number,
  "source": { "x": float, "y": float, "external": boolean },
  "target": { "id": number, "x": float, "y": float }
}
```

The engine:

* Spawns attacks at a frequency defined by the UI slider
* Chooses randomized internal/external attack origins
* Adds colored animated beams to the visualization
* Logs data for telemetry

### **3. Real-Time Canvas Rendering**

Canvas displays:

* Server nodes with neon glow
* Active attack beams that animate from source → target
* Beam opacity decay over 2.6 seconds
* Target nodes highlighted during attack

Rendering is powered by `requestAnimationFrame` at ~60 FPS.

### **4. Telemetry Subsystem**

Maintains:

* Total attack count
* Per-attack-type counters
* Last attack metadata
* (Future-ready) Attack logs, server health, anomaly detection

### **5. User Control Panel**

Interactive controls:

* **Pause/Resume** simulation
* **Attack Speed Slider** (200–2000ms interval)

State updates immediately alter simulation behavior.

---

## 🚀 Features

### **🔹 Real-Time Cyber Attack Simulation**

* Simulated XSS, SQLi, Brute Force, RCE
* Internal and external attack sources
* Dynamic target allocation

### **🔹 High-Performance HTML Canvas Visualization**

* Animated neon attack beams
* Color-coded by attack type
* Smooth fade-out effects
* Network node glow indicators

### **🔹 Live Telemetry Dashboard**

* Per-type attack statistics
* Last event snapshot
* Highlighted active targets

### **🔹 Interactive Simulation Controls**

* ⏯ Pause / Resume
* 🎚 Adjustable attack frequency

### **🔹 Zero Backend**

Entire project runs in the browser with deterministic, safe simulation logic.

---

## 🛠️ Tech Stack

| Layer              | Technology                   |
| ------------------ | ---------------------------- |
| Frontend Framework | **React (Vite)**             |
| Visualization      | **HTML5 Canvas**             |
| State Management   | React Hooks                  |
| Styling            | Custom CSS (Cyber-themed UI) |
| Build Tool         | Vite                         |

---

## 📁 Project Structure

```
src/
  ├── App.jsx              # Main UI + attack engine + controls
  ├── NetworkCanvas.jsx    # Canvas renderer + animation loop
  ├── StatsPanel.jsx       # Telemetry and statistics
  ├── styles.css           # Cyberpunk-inspired design system
  └── main.jsx             # React entry point
```

---

## ⚙️ How It Works (Technical Deep Dive)

### **Attack Loop Execution**

* Driven via `setInterval(...)`
* Interval is dynamically set from **user slider**
* Disabled when `isPaused = true`

### **Animation Pipeline**

* Canvas draws using a persistent animation frame loop
* Each attack beam:

  * Moves along vector path
  * Decays opacity over lifetime
  * Shrinks line width over time (`age → alpha`)

### **State Synchronization**

* React state for attacks
* Canvas rendering decoupled via props
* Stats updated on every attack event
* Attack events automatically garbage-collected after timeout

---

## 🔧 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/cyber-attack-sim-visualizer.git

cd cyber-attack-sim-visualizer

# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open:

```
http://localhost:5173/
```

---

## 🛡️ Security Disclaimer

This project is **purely a simulation**.
It does *not* perform any real network scanning, probing, exploitation, or traffic generation.

All attacks are fictional, randomly generated, and computed client-side.

---

## 🧩 Future Enhancements

* Server health + node "destruction" animations
* SOC-style scrolling log feed
* Attack heatmap
* MITRE ATT&CK technique mapping
* IDS-style anomaly detection
* Three.js 3D network mode
* Screenshot / GIF export button

```
