import React from "react";
import { Html } from "@react-three/drei";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Optionally log to a reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ background: "rgba(0,0,0,0.5)", padding: 16, borderRadius: 8, color: "white" }}>
            <p>Something went wrong rendering the scene.</p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}