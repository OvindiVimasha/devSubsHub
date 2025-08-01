import React from "react";

export default function SummaryDashboard({ subs }) {
  const totalMonthly = subs.reduce(
    (sum, s) => sum + (s.billingFrequency === "Monthly" ? s.monthlyCost : s.monthlyCost / 12),
    0
  );
  const totalYearly = subs.reduce(
    (sum, s) => sum + (s.billingFrequency === "Yearly" ? s.monthlyCost : s.monthlyCost * 12),
    0
  );
  const activeCount = subs.filter((s) => s.status === "active").length;
  const pausedCount = subs.filter((s) => s.status === "paused").length;

  const today = new Date();
  const upcoming = subs.filter((s) => {
    if (!s.billingDate) return false;
    const billing = new Date(s.billingDate);
    const diff = (billing - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });


  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "1rem",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 4px 12px rgba(59,130,246,0.2)"
  };

  return (
    <div
      className="p-4 rounded shadow-lg mb-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.05)",
        color: "#f3f4f6"
      }}
    >
      <h4 className="mb-4 fw-semibold" style={{ color: "#fff" }}>Summary</h4>
      <div className="row text-center g-3">
        <div className="col-6 col-md-3">
          <div className="p-3 d-flex flex-column align-items-center" style={glassCardStyle}>
            <i className="bi bi-cash-stack mb-1" style={{ fontSize: '1.2rem' }}></i>
            <p className="small mb-1">Monthly Spending</p>
            <p className="h4 fw-bold">${totalMonthly.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 d-flex flex-column align-items-center" style={glassCardStyle}>
            <i className="bi bi-calendar2-week mb-1" style={{ fontSize: '1.2rem' }}></i>
            <p className="small mb-1">Yearly Spending</p>
            <p className="h4 fw-bold">${totalYearly.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 d-flex flex-column align-items-center" style={glassCardStyle}>
            <i className="bi bi-check-circle mb-1" style={{ fontSize: '1.2rem' }}></i>
            <p className="small mb-1">Active</p>
            <p className="h4 fw-bold">{activeCount}</p>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 d-flex flex-column align-items-center" style={glassCardStyle}>
            <i className="bi bi-pause-circle mb-1" style={{ fontSize: '1.2rem' }}></i>
            <p className="small mb-1">Paused</p>
            <p className="h4 fw-bold">{pausedCount}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Billing Alerts */}
      {upcoming.length > 0 && (
        <div className="mt-4">
          <div className="p-3 rounded shadow-lg"
            style={{
              ...glassCardStyle,
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.4)",
              boxShadow: "0 8px 32px rgba(251,191,36,0.2)"
            }}>
            <h5 className="fw-bold mb-3" style={{ color: '#fbbf24' }}>Upcoming Billing Alerts</h5>
            <ul className="list-unstyled mb-0">
              {upcoming.map((s) => (
                <li key={s._id || s.serviceName} className="mb-2">
                  <span className="fw-semibold">{s.serviceName}</span> - 
                  <span style={{ color: '#3b82f6' }}> {s.plan}</span> | 
                  <span style={{ color: '#fbbf24' }}> Next Billing: {s.billingDate ? new Date(s.billingDate).toLocaleDateString() : "N/A"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* All Subscriptions */}
      <div className="mt-4">
        <h4 className="mb-4 fw-semibold" style={{ color: '#fff' }}>All Subscriptions</h4>
        {subs.length === 0 ? (
          <p className="text-muted">No subscriptions found.</p>
        ) : (
          <div className="row g-4">
            {subs.map((s) => (
              <div className="col-md-6 col-lg-4" key={s._id || s.serviceName}>
                <div className="p-4 d-flex flex-column justify-content-between" style={glassCardStyle}>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-box-seam me-2" style={{ color: '#3b82f6' }}></i>
                    <span className="fw-bold">{s.serviceName}</span>
                    <span className="badge bg-primary ms-auto">{s.plan}</span>
                  </div>
                  <div className="mb-2 d-flex flex-wrap gap-2">
                    <span><i className="bi bi-currency-dollar me-1"></i>{s.monthlyCost}/mo</span>
                    <span><i className="bi bi-calendar me-1"></i>{s.billingFrequency}</span>
                    <span><i className="bi bi-clock me-1"></i>{s.billingDate ? new Date(s.billingDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="mb-2">
                    <span className={`badge ${s.status === 'active' ? 'bg-success' : 'bg-warning'} me-2`}>{s.status}</span>
                    {s.apiKey && <span className="badge bg-info me-2">API Key</span>}
                  </div>
                  {s.notes && <div className="mt-2 text-muted"><i className="bi bi-chat-left-text me-1"></i>{s.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
