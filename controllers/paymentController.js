const Payment = require('../models/paymentModel');

exports.list = async (req, res) => {
  const list = await Payment.getAll();
  res.json(list);
};

exports.create = async (req, res) => {
  const { booking_id, amount, mode, status } = req.body;
  if (!booking_id || !amount) return res.status(400).json({ error: 'Missing required fields' });
  const result = await Payment.create({ booking_id, amount, mode: mode || 'card', status: status || 'pending' });
  res.status(201).json({ message: 'Payment recorded', ...result });
};

exports.updateStatus = async (req, res) => {
  const { status, mode } = req.body;
  await Payment.updateStatus(req.params.id, status, mode || 'card');
  res.json({ message: 'Payment status updated' });
};