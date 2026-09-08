import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./AppCore";
import SceneLab from "./SceneLab.jsx";

function StartScreen({ onStart }) {
  return (
    <main className="start-screen">
      <section className="start-card">
        <div className="start-flower">🌻</div>
        <div className="eyebrow">Sunflower Market</div>
        <h1>You want a sunflower.</h1>
        <p>You do not know why.</p>
        <p className="muted">You only know that it feels like a way home.</p>
        <div className="start-rules">
          <div><strong>Look around.</strong> Places, people and public stories change as the harbour moves.</div>
          <div><strong>Attention is scarce.</strong> Travel, inspection, negotiation and consequential work take attention; reading what you already know does not.</div>
          <div><strong>Commitments are real.</strong> Cash can be reserved, people can be elsewhere, cargo can arrive late, and invitations can be missed.</div>
          <div><strong>End the day when you choose.</strong> The harbour continues without waiting for you.</div>
        </div>
        <p className="muted small">That is enough to begin. The rest will appear when it matters.</p>
        <button className="btn gold start-button" onClick={onStart}>Enter the harbour →</button>
      </section>
    </main>
  );
}

function GameGate() {
  if (new URLSearchParams(window.location.search).has("sceneLab")) return <SceneLab />;
  const [started, setStarted] = useState(() => new URLSearchParams(window.location.search).has("play"));
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
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: 12, padding: "10px 14px", cursor: "pointer" }}
          >
            Reload game
          </button>
          {import.meta.env.DEV && (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, marginTop: 20 }}>
              {this.state.error?.stack}
            </pre>
          )}
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
