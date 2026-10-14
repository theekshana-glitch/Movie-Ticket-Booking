const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');

exports.list = async (req, res) => {
  try {
    const bookings = await Booking.getAll(req.query.date || '');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const b = await Booking.getById(req.params.id);
    if (!b) return res.status(404).json({ error: 'Booking not found' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, show_id, seats_booked } = req.body;
    if (!customer_id || !show_id || !seats_booked) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const show = await Show.getById(show_id);
    if (!show) return res.status(404).json({ error: 'Show not found' });
    if (show.available_seats < seats_booked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }
    const total_amount = show.ticket_price * seats_booked;
    const id = await Booking.create({ customer_id, show_id, seats_booked, total_amount });
    res.status(201).json({ message: 'Booking created', id, total_amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await Booking.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Booking.remove(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.report = async (req, res) => {
  try {
    const { from, to } = req.query;
    const rows = await Booking.getReport(from, to);
    const summary = await Booking.getReportSummary(from, to);
    res.json({ summary, rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reportCSV = async (req, res) => {
  try {
    const { from, to } = req.query;
    const rows = await Booking.getReport(from, to);

    const header = 'Booking ID,Customer,Email,Phone,Movie,Screen,Show Date,Show Time,Seats,Ticket Price,Total Amount,Booking Status,Payment Status,Payment Mode,Txn Ref\n';

    let csv = header;
    rows.forEach(r => {
      const showDateStr = r.show_date ? r.show_date.toString().split('T')[0] : '';
      const line = [
        r.booking_id,
        `"${r.customer_name || ''}"`,
        r.customer_email || '',
        r.customer_phone || '',
        `"${r.movie_title || ''}"`,
        r.screen_name || '',
        showDateStr,
        r.show_time || '',
        r.seats_booked || 0,
        r.ticket_price || 0,
        r.total_amount || 0,
        r.booking_status || '',
        r.payment_status || 'N/A',
        r.payment_mode || 'N/A',
        r.transaction_ref || 'N/A'
      ].join(',');
      csv += line + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings-report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};