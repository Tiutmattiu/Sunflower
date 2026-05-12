import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

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
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);