import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function StartScreen({ onStart }) {
  return (
    <main className="start-screen">
      <section className="start-card">
        <div className="start-flower">🌻</div>
        <div className="eyebrow">Sunflower Market</div>
        <h1>You want a sunflower.</h1>
        <p>There is one problem: nobody will sell you one.</p>
        <p className="muted">
          You have 14 days. Every sunrise, noon and sunset the harbour stops. The public market opens once each day at noon; the rest of your time is for information, relationships, investigation and positioning.
        </p>
        <div className="start-rules">
          <div>🥫 Sardine tins are money.</div>
          <div>🌞 The public market clears once at noon.</div>
          <div>🕰 Morning and afternoon actions consume time.</div>
          <div>👀 Other traders commit plans and learn from what they can observe.</div>
        </div>
        <p className="muted small">You are not expected to understand the market on your first run.</p>
        <button className="btn gold start-button" onClick={onStart}>Enter the harbour →</button>
      </section>
    </main>
  );
}

function GameGate() {
  const [started, setStarted] = useState(false);
  return started ? <App /> : <StartScreen onStart={() => setStarted(true)} />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: "#e4dccd", background: "#1a1e1b", padding: 30,
          fontFamily: "monospace", minHeight: "100vh", wordBreak: "break-word"
        }}>
          <h1>💥 Game Crashed</h1>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, marginTop: 20 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GameGate />
    </ErrorBoundary>
  </React.StrictMode>
);
