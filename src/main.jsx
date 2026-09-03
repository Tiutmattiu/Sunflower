import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function StartScreen({ onStart }) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "20px 16px",
        background: "#1a1e1b",
        color: "#e4dccd",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <section
        style={{
          width: "min(100%, 520px)",
          background: "#232b24",
          border: "1px solid #3a4534",
          borderRadius: 18,
          padding: "clamp(20px, 6vw, 34px)",
          boxShadow: "0 18px 60px rgba(0,0,0,.28)",
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 18 }}>🌻</div>
        <div
          style={{
            color: "#b9aa73",
            fontSize: 13,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Sunflower Market
        </div>
        <h1
          style={{
            color: "#e6c873",
            fontSize: "clamp(1.8rem, 8vw, 2.6rem)",
            lineHeight: 1.05,
            margin: "0 0 18px",
          }}
        >
          You want a sunflower.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, marginBottom: 10 }}>
          There is one problem: nobody will sell you one.
        </p>
        <p style={{ color: "#a9a492", lineHeight: 1.55, marginBottom: 24 }}>
          You have 14 rounds before the market closes. Read the market, trade what you have,
          and find your own way to the flower.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            background: "#1e241f",
            border: "1px solid #343e32",
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          <div>🥫 Sardines are money.</div>
          <div>🤝 You may plan up to 3 offers each round.</div>
          <div>👀 Other traders move while you do.</div>
          <div>📈 What people want can change what things are worth.</div>
        </div>

        <p style={{ color: "#8b8b7a", fontSize: 13, lineHeight: 1.45, marginBottom: 18 }}>
          You are not expected to understand the market on your first run.
        </p>

        <button
          onClick={onStart}
          style={{
            width: "100%",
            minHeight: 52,
            border: "1px solid #c9a44b",
            borderRadius: 10,
            background: "#5a4a2e",
            color: "#ffecb3",
            font: "inherit",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Enter the market →
        </button>
      </section>
    </main>
  );
}

function GameGate() {
  const [started, setStarted] = useState(false);
  return started ? <App /> : <StartScreen onStart={() => setStarted(true)} />;
}

// 错误边界：捕获 App 渲染期间的所有崩溃
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