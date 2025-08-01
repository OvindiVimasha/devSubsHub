import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { saveAs } from "file-saver";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubscriptionList({ onEdit }) {
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { state } = useAuthContext();
  const [confirmId, setConfirmId] = useState(null);


  const glassDark = {
    background: "rgba(30, 41, 59, 0.25)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff"
  };

  useEffect(() => {
    if (state.username) {
      axios
        .get(`http://localhost:5000/api/subscriptions/${state.username}`)
        .then((res) => setSubs(res.data))
        .catch((err) => console.error("Error fetching subscriptions:", err));
    }
  }, [state.username]);

  const downloadPDF = () => {
    fetch(`http://localhost:5000/api/subscriptions/export/pdf/${state.username}`)
      .then((res) => res.blob())
      .then((blob) => {
        saveAs(blob, "subscriptions.pdf");
        toast.success("PDF exported!", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
      })
        .catch(() => toast.error("Export failed.", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } }));
  };

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const filteredSubs = subs
    .filter((sub) => (filter ? sub.plan === filter : true))
    .sort((a, b) => {
      if (sortBy === "cost") return a.monthlyCost - b.monthlyCost;
      if (sortBy === "plan") return a.plan.localeCompare(b.plan);
      return 0;
    });

  return (
    <div className="container-fluid p-0">
      <ToastContainer theme="colored" position="top-right" autoClose={1800} hideProgressBar={true} transition={Slide} style={{fontSize: '1rem'}} />
    
      {confirmId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'rgba(30,41,59,0.95)', color: '#fff', borderRadius: '1rem', padding: '2rem 2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textAlign: 'center', minWidth: '320px'
          }}>
            <div style={{fontSize: '1.25rem', marginBottom: '1rem'}}>
              <span role="img" aria-label="delete">🗑️</span> Delete this subscription?
            </div>
            <div style={{marginBottom: '1.5rem', color: '#cbd5e1', fontSize: '1rem'}}>This action cannot be undone.</div>
            <button
              style={{background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.5rem', marginRight: '1rem', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(239,68,68,0.15)'}}
              onClick={() => {
                axios.delete(`http://localhost:5000/api/subscriptions/${confirmId}`)
                  .then(() => {
                    setSubs(subs.filter(sub => sub._id !== confirmId));
                    toast.success("Subscription deleted!", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
                  })
                  .catch(err => {
                    console.error("Error deleting subscription:", err);
                    toast.error("Delete failed.", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
                  });
                setConfirmId(null);
              }}
            >Delete</button>
            <button
              style={{background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.5rem', fontWeight: 'bold'}}
              onClick={() => setConfirmId(null)}
            >Cancel</button>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-white">All Subscriptions</h2>
        <button onClick={downloadPDF} className="btn btn-outline-light">
          <i className="bi bi-download me-2"></i>Export as PDF
        </button>
      </div>

      <div
        className="p-4 rounded shadow-lg mt-3"
        style={{
          ...glassDark,
          background: "rgba(30, 41, 59, 0.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 4px 12px rgba(59,130,246,0.2)"
        }}
      >
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="form-select"
            style={{ ...glassDark, maxWidth: "200px"}}
          >
            <option value="">All Plans</option>
            <option value="Free" color="#000">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
            className="form-select"
            style={{ ...glassDark, maxWidth: "200px" }}
          >
            <option value="">Sort By</option>
            <option value="cost">Cost</option>
            <option value="plan">Plan</option>
          </select>
        </div>

      
        {filteredSubs.length === 0 ? (
          <div className="text-center p-5">
            <i className="bi bi-cloud-slash display-1 text-white-50"></i>
            <h3 className="mt-4 text-white">No Subscriptions Found</h3>
            <p className="text-white-75">Your filtered search did not return any results.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table
              className="table table-hover align-middle rounded"
              style={{
                ...glassDark,
                backgroundColor: "transparent",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)"
              }}
            >
              <thead
                style={{
                  backgroundColor: "transparent", 
                  backdropFilter: "blur(12px)",
                  color: "#fff", 
                  fontSize: "0.92rem"
                }}
              >
                <tr>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Service</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Plan</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Cost</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Billing</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Next Bill</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Status</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>API Key</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Notes</th>
                  <th style={{backgroundColor: "transparent", color: "#fff"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((sub) => (
                  <tr
                    key={sub._id}
                    style={{
                      verticalAlign: "middle",
                      backgroundColor: "transparent",
                      color: "#fff"
                    }}
                  >
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      <i className="bi bi-box-seam me-2 " style={{ color: "#3b82f6" }}></i>
                      {sub.serviceName}
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      <span className="badge bg-primary" style={{color: '#fff'}}>{sub.plan}</span>
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      <span className="fw-semibold">${sub.monthlyCost}/mo</span>
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>{sub.billingFrequency}</td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      {sub.billingDate ? new Date(sub.billingDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      <span className={`badge ${sub.status === "active" ? "bg-success" : "bg-warning"}`} style={{color: '#fff'}}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      {sub.apiKey ? <span className="badge bg-info" style={{color: '#fff'}}>API Key</span> : "-"}
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      {sub.notes ? (
                        <span className="text-muted">
                          <i className="bi bi-chat-left-text me-1" style={{color: '#fff'}}></i>
                          {sub.notes}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ backgroundColor: "transparent", color: "#fff" }}>
                      <button
                        onClick={() => onEdit(sub)}
                        className="btn btn-sm btn-outline-light me-2"
                        title="Edit"
                        style={{color: '#fff', borderColor: '#fff'}}
                      >
                        <FaEdit color="#fff" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        style={{color: '#fff', borderColor: '#fff'}}
                      >
                        <FaTrash color="#fff" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
