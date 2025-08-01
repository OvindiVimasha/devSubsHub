import React from 'react';
import Navbar from './Navbar';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionList from './SubscriptionList';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - Add Subscription */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <SubscriptionForm />
                    </div>
                </div>

                {/* Right Column - Summary + List */}
                <div className="lg:col-span-2 space-y-6">
                    <SubscriptionList />
                </div>
            </main>
        </div>
    );
}
