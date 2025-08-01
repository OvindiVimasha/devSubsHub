const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, 
    serviceName: String,
    plan: String,
    monthlyCost: Number,
    billingFrequency: String,
    billingDate: Date,
    apiKey: String,
    notes: String,
    status: { type: String, default: "active" }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
