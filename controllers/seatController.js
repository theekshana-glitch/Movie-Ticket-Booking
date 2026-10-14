const Seat = require('../models/seatModel');

exports.list = async (req, res) => {
  try {
    const seats = await Seat.getAll(req.query.date || '');
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const seat = await Seat.getByShowId(req.params.showId);
    if (!seat) return res.status(404).json({ error: 'Show not found' });
    res.json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};