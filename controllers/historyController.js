const History = require('../models/historyModel');

exports.list = async (req, res) => {
  const list = await History.getAll(req.query.email || '');
  res.json(list);
};

exports.create = async (req, res) => {
  const { guest_email, movie_id, watched_on } = req.body;
  if (!guest_email || !movie_id || !watched_on) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = await History.create(req.body);
  res.status(201).json({ message: 'History added', id });
};

exports.remove = async (req, res) => {
  await History.remove(req.params.id);
  res.json({ message: 'History deleted' });
};