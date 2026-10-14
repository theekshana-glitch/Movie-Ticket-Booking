const Show = require('../models/showModel');

exports.list = async (req, res) => {
  const shows = await Show.getAll(req.query.date || '');
  res.json(shows);
};

exports.get = async (req, res) => {
  const show = await Show.getById(req.params.id);
  if (!show) return res.status(404).json({ error: 'Show not found' });
  res.json(show);
};

exports.create = async (req, res) => {
  const { movie_id, screen_name, show_date, show_time, ticket_price } = req.body;
  if (!movie_id || !screen_name || !show_date || !show_time || !ticket_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = await Show.create(req.body);
  res.status(201).json({ message: 'Show created', id });
};

exports.update = async (req, res) => {
  await Show.update(req.params.id, req.body);
  res.json({ message: 'Show updated' });
};

exports.remove = async (req, res) => {
  await Show.remove(req.params.id);
  res.json({ message: 'Show deleted' });
};