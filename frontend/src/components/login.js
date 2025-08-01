import React, { useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

export default function Login() {
  const { state, signIn, signOut } = useAuthContext();

  return (
    <div
      className="d-flex flex-column min-vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)",
      }}
    >
      {/* Hero Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3">
        
        {/* App Name */}
        <h1
         
          style={{
            fontSize: "4.5rem",
            background: "linear-gradient(90deg, #60a5fa, #2563eb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DevSubsHub
        </h1>

        {/* Tagline */}
        <p
          className="mb-4"
          style={{
            fontSize: "1.25rem",
            maxWidth: "640px",
            color: "#cbd5e1",
          }}
        >
          A modern dashboard to manage all your developer subscriptions —
          track costs, billing cycles, and API keys with ease.
        </p>

       
       <div className="d-flex flex-wrap justify-content-center gap-4 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
  {[
    { icon: "bi-wallet2", title: "Track Spending", desc: "Monitor monthly & yearly costs." },
    { icon: "bi-calendar-event", title: "Billing Alerts", desc: "Never miss payment deadlines." },
    { icon: "bi-key", title: "API Key Manager", desc: "Store & track all your API credentials." }
  ].map((f, i) => (
    <div
      key={i}
      className="p-4 rounded shadow-lg text-center"
      style={{
        background: "rgba(30, 41, 59, 0.35)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: "220px",
        maxWidth: "260px",
      }}
    >
      <i
        className={`bi ${f.icon}`}
        style={{
          fontSize: "2.2rem",
          color: "#60a5fa",
          marginBottom: "0.5rem",
        }}
      ></i>
      <h5 className="fw-bold mb-2" style={{ fontSize: "1.25rem", color: "#fff" }}>
        {f.title}
      </h5>
      <p className="mb-0" style={{ fontSize: "1rem", color: "#fff" }}>
        {f.desc}
      </p>
    </div>
  ))}
</div>


        {/* Login / Logout Button */}
        {!state.isAuthenticated ? (
          <button
            onClick={() => signIn()}
            className="btn btn-lg px-5 py-3 fw-semibold"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #2563eb)",
              border: "none",
              color: "#fff",
              borderRadius: "0.75rem",
              fontSize: "1.1rem",
              boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login 
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="btn btn-lg px-5 py-3 fw-semibold"
            style={{
              background: "linear-gradient(90deg, #dc2626, #b91c1c)",
              border: "none",
              color: "#fff",
              borderRadius: "0.75rem",
              fontSize: "1.1rem",
              boxShadow: "0 8px 24px rgba(220,38,38,0.3)",
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        )}
      </div>

      {/* Footer */}
      <footer
        className="text-center py-3"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          fontSize: "0.9rem",
          color: "#94a3b8",
        }}
      >
        © 2025 DevSubsHub. All rights reserved.
      </footer>
    </div>
  );
}
