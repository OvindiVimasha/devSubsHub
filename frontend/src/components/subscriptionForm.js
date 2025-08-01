import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubscriptionForm({ userId, subscription, onFormSubmit }) {
  const [form, setForm] = useState({
    serviceName: "",
    plan: "",
    monthlyCost: "",
    billingFrequency: "Monthly",
    billingDate: "",
    apiKey: "",
    notes: "",
    status: "active",
  });

  const { state } = useAuthContext();

  useEffect(() => {
    if (subscription) {
      setForm({
        ...subscription,
        billingDate: subscription.billingDate
          ? new Date(subscription.billingDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [subscription]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, userEmail: userId };

    try {
      if (subscription) {
        await axios.put(`http://localhost:5000/api/subscriptions/${subscription._id}`, payload);
        toast.success("Subscription updated!", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
      } else {
        await axios.post("http://localhost:5000/api/subscriptions", payload);
        toast.success("Subscription added!", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
      }
      if (onFormSubmit) setTimeout(onFormSubmit, 1200);
    } catch (error) {
      console.error("Failed to save subscription:", error);
      toast.error("Failed to save subscription.", { position: "top-right", autoClose: 1800, transition: Slide, style: { fontSize: '1.1rem', fontWeight: '500', borderRadius: '0.75rem' } });
    }
  };

  // Glassmorphism style for inputs
  const glassInputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    backdropFilter: "blur(8px)",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
  };

  // Glassmorphism style for select with arrow
  const glassSelectStyle = {
    ...glassInputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage:
      'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'12\' viewBox=\'0 0 24 24\' width=\'12\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "1rem",
  };

  return (
    <div
      className="container-fluid px-0"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)",
        paddingTop: "50px",
      }}
    >
      <ToastContainer theme="colored" position="top-right" autoClose={1800} hideProgressBar={true} transition={Slide} style={{fontSize: '1rem'}} />
    
      <style>{`
        html, body, .container-fluid, .row, .col, .col-md-6, .col-lg-4, .form-control, .form-select, .btn, .table, .card, .shadow-lg, .shadow-sm, .navbar, .nav-link, .dropdown-menu, .dropdown-item {
          font-size: 0.92rem !important;
          background: rgba(30,41,59,0.10) !important;
          color: #fff !important;
        }
        .navbar, .nav-link, .dropdown-menu, .dropdown-item {
          background: rgba(30,41,59,0.25) !important;
          color: #fff !important;
        }
        .table-dark {
          background: rgba(30,41,59,0.32) !important;
        }
        .card, .shadow-lg, .shadow-sm {
          background: rgba(30,41,59,0.15) !important;
        }
        .form-control, .form-select {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
        }
        .btn {
          background: linear-gradient(90deg, #3b82f6, #2563eb) !important;
          color: #fff !important;
        }
        .btn-outline-light, .btn-outline-danger {
          background: transparent !important;
          color: #fff !important;
          border: 1px solid #fff !important;
        }
        .badge {
          font-size: 0.85rem !important;
        }
        select option {
          background-color: #1e293b !important;
          color: #fff !important;
        }
      `}</style>

      <div className="row justify-content-center g-0">
        <div className="col-lg-6 col-md-8 col-11">
          <div
            className="p-4 rounded shadow-lg"
            style={{ background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(10px)" }}
          >
            <div className="text-center mb-4">
              <h4 className="mb-4 fw-semibold">
                {subscription ? "Edit Subscription" : "Add New Subscription"}
              </h4>
              <p style={{ color: "#cbd5e1" }}>
                {subscription
                  ? "Update the details of your service."
                  : "Track your services, costs, and billing with ease."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-white">Service Name</label>
                <input
                  name="serviceName"
                  value={form.serviceName}
                  onChange={handleChange}
                  style={glassInputStyle}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Plan</label>
                <input
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  style={glassInputStyle}
                  className="form-control"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white">Monthly Cost</label>
                  <input
                    type="number"
                    name="monthlyCost"
                    value={form.monthlyCost}
                    onChange={handleChange}
                    style={glassInputStyle}
                    className="form-control"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white">Billing Frequency</label>
                  <select
                    name="billingFrequency"
                    value={form.billingFrequency}
                    onChange={handleChange}
                    style={glassSelectStyle}
                    className="form-select"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white">Next Billing Date</label>
                  <input
                    type="date"
                    name="billingDate"
                    value={form.billingDate}
                    onChange={handleChange}
                    style={glassInputStyle}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    style={glassSelectStyle}
                    className="form-select"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white">API Key (optional)</label>
                <input
                  name="apiKey"
                  value={form.apiKey}
                  onChange={handleChange}
                  style={glassInputStyle}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Notes (optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  style={{ ...glassInputStyle, height: "100px" }}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg w-100 text-white fw-bold"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 20px",
                  boxShadow: "0 4px 15px rgba(37,99,235,0.4)",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {subscription ? "Update Subscription" : "Add Subscription"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
