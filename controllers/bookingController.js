const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');

exports.list = async (req, res) => {
  const bookings = await Booking.getAll(req.query.date || '');
  res.json(bookings);
};

exports.get = async (req, res) => {
  const b = await Booking.getById(req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(b);
};

exports.create = async (req, res) => {
  const { guest_name, guest_email, guest_phone, show_id, seats_booked } = req.body;
  if (!guest_name || !guest_email || !show_id || !seats_booked) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const show = await Show.getById(show_id);
  if (!show) return res.status(404).json({ error: 'Show not found' });
  if (show.available_seats < seats_booked) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }
  const total_amount = show.ticket_price * seats_booked;
  const id = await Booking.create({
    guest_name, guest_email, guest_phone, show_id, seats_booked, total_amount
  });
  res.status(201).json({ message: 'Booking successful', id, total_amount });
};

exports.updateStatus = async (req, res) => {
  await Booking.updateStatus(req.params.id, req.body.status);
  res.json({ message: 'Booking status updated' });
};

exports.remove = async (req, res) => {
  await Booking.remove(req.params.id);
  res.json({ message: 'Booking deleted' });
};