import React, { useEffect, useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import './App.css';
import Login from './components/login';
import SubscriptionForm from './components/subscriptionForm';
import SubscriptionList from './components/subscriptionList';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import SummaryDashboard from './components/summaryDashboard';
import axios from 'axios';

function AppContent() {
    const { state, signIn, signOut } = useAuthContext();
    const [tab, setTab] = useState('overview');
    const [editingSubscription, setEditingSubscription] = useState(null);

    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setTab('add');
    };

    const handleFormAction = () => {
        setEditingSubscription(null);
        setTab('subscriptions');
    };

    if (!state.isAuthenticated) {
        return <Login />;
    }
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            fontFamily: 'Inter, sans-serif',
            color: '#fff',
        }}>
            
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
            `}</style>
            <HeaderBar user={state.username} onAdd={() => setTab('add')} onLogout={signOut} />
            <TabBar tab={tab} setTab={setTab} />
            <main style={{ maxWidth: '100%', margin: 0, padding: '24px' }}>
                {tab === 'overview' && <SummaryDashboardWrapper onEdit={handleEdit} />}
                {tab === 'add' && <SubscriptionFormWrapper subscription={editingSubscription} onFormSubmit={handleFormAction} />}
                {tab === 'subscriptions' && <SubscriptionList onEdit={handleEdit} />}
                {tab === 'alerts' && <AlertsPlaceholder />}
            </main>
        </div>
    );
}

function HeaderBar({ user, onAdd, onLogout }) {
    return (
        <header className="p-3 d-flex align-items-center justify-content-between w-100" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="d-flex flex-column ms-3">
                <span className="fw-bold fs-2 text-white">DevSubsHub</span>
                <span className="text-white-50" style={{fontSize: 13}}>Welcome back, {user}</span>
            </div>
            <div className="d-flex align-items-center gap-3 me-3">
                <button onClick={onAdd} className="btn btn-primary fw-semibold">
                    <i className="bi bi-plus-lg me-2"></i>Add Subscription
                </button>
                <button onClick={onLogout} className="btn btn-outline-light">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
            </div>
        </header>
    );
}

function TabBar({ tab, setTab }) {
    return (
        <nav className="nav justify-content-center px-4 py-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <TabButton name="overview" currentTab={tab} setTab={setTab} label="Overview" icon="bi-grid-1x2-fill" />
            <TabButton name="add" currentTab={tab} setTab={setTab} label="Add New" icon="bi-plus-circle-fill" />
            <TabButton name="subscriptions" currentTab={tab} setTab={setTab} label="All Subscriptions" icon="bi-collection-fill" />
        </nav>
    );
}
function TabButton({ name, currentTab, setTab, label, icon }) {
    const isActive = name === currentTab;
    const [isHovered, setIsHovered] = React.useState(false);

    const style = {
        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
        background: isActive ? 'rgba(59, 130, 246, 0.3)' : (isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent'),
        border: 'none',
        borderRadius: '0.5rem',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease-in-out',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    return (
        <button
            className="nav-link me-2"
            onClick={() => setTab(name)}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <i className={`bi ${icon}`}></i>
            <span>{label}</span>
        </button>
    );
}
function AlertsPlaceholder() {
    return <div className="text-center text-muted mt-5">No alerts yet.</div>;
}

function SummaryDashboardWrapper({ onEdit }) {
    const { state } = useAuthContext();
    const [subs, setSubs] = useState([]);
    useEffect(() => {
        if (state.username) {
            axios.get(`http://localhost:5000/api/subscriptions/${state.username}`)
                .then(res => setSubs(res.data))
                .catch(() => setSubs([]));
        }
    }, [state.username]);
    return <SummaryDashboard subs={subs} onEdit={onEdit} />;
}

function SubscriptionFormWrapper({ subscription, onFormSubmit }) {
    const { state } = useAuthContext();
    return <SubscriptionForm userId={state.username} subscription={subscription} onFormSubmit={onFormSubmit} />;
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
