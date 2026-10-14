const db = require('../config/db');

exports.getAll = async (date = '') => {
  let query = `
    SELECT b.*, m.title AS movie_title,
           s.show_date, s.show_time, s.screen_name
    FROM bookings b
    JOIN shows s ON b.show_id = s.id
    JOIN movies m ON s.movie_id = m.id
  `;
  const params = [];
  if (date) {
    query += ' WHERE s.show_date = ?';
    params.push(date);
  }
  query += ' ORDER BY b.booking_date DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { guest_name, guest_email, guest_phone, show_id, seats_booked, total_amount } = data;
  const [r] = await db.query(
    `INSERT INTO bookings (guest_name, guest_email, guest_phone, show_id, seats_booked, total_amount)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [guest_name, guest_email, guest_phone, show_id, seats_booked, total_amount]
  );
  await db.query(
    'UPDATE shows SET available_seats = available_seats - ? WHERE id = ?',
    [seats_booked, show_id]
  );
  return r.insertId;
};

exports.updateStatus = async (id, status) => {
  await db.query('UPDATE bookings SET status=? WHERE id=?', [status, id]);
};

exports.remove = async (id) => {
  await db.query('DELETE FROM bookings WHERE id = ?', [id]);
};