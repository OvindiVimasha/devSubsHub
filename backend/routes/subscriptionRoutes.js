const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscription');
const PDFDocument = require('pdfkit');

// CREATE
router.post('/', async (req, res) => {
    try {
        const sub = new Subscription(req.body);
        await sub.save();
        res.json(sub);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ
router.get('/:email', async (req, res) => {
    try {
        const subs = await Subscription.find({ userEmail: req.params.email });
        res.json(subs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Subscription.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/export/pdf/:email', async (req, res) => {
    try {
        const subs = await Subscription.find({ userEmail: req.params.email });

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=subscriptions.pdf');
        doc.pipe(res);

        doc.fontSize(20).text("Developer Subscriptions Report", { align: 'center' }).moveDown();

        subs.forEach(sub => {
            doc.fontSize(12).text(`Service: ${sub.serviceName}`);
            doc.text(`Plan: ${sub.plan}`);
            doc.text(`Cost: $${sub.monthlyCost}`);
            doc.text(`Billing: ${sub.billingFrequency}`);
            doc.text(`Next Billing: ${new Date(sub.billingDate).toDateString()}`);
            doc.text(`Status: ${sub.status}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
