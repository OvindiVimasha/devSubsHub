import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";

export default function Navbar() {
  const { state, signOut } = useAuthContext();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm px-4" style={{background: 'rgba(30,41,59,0.25)'}}>
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{fontSize: '0.92rem', color: '#fff'}}>
        {/* Logo / Title */}
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-white text-primary fw-bold px-3 py-1 rounded">
            DSM
          </span>
          <h1 className="h5 mb-0 fw-semibold text-white">
            Developer Subscriptions Manager
          </h1>
        </div>

        {/* User Info + Logout */}
        <div className="d-flex align-items-center gap-3">
          {state?.username && (
            <span className="d-none d-sm-inline text-light opacity-75 small">
              {state.username}
            </span>
          )}
          <button
            onClick={() => signOut()}
            className="btn btn-danger btn-sm shadow-sm"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
