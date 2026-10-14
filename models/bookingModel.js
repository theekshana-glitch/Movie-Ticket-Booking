const db = require('../config/db');

exports.getAll = async (date = '') => {
  let query = `
    SELECT b.*, c.name AS customer_name, c.email AS customer_email,
           m.title AS movie_title,
           s.show_date, s.show_time, s.screen_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
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
  const { customer_id, show_id, seats_booked, total_amount } = data;
  const [r] = await db.query(
    `INSERT INTO bookings (customer_id, show_id, seats_booked, total_amount)
     VALUES (?, ?, ?, ?)`,
    [customer_id, show_id, seats_booked, total_amount]
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

// ============ REPORT ============
exports.getReport = async (fromDate, toDate) => {
  let query = `
    SELECT 
      b.id AS booking_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      m.title AS movie_title,
      s.screen_name,
      s.show_date,
      s.show_time,
      b.seats_booked,
      s.ticket_price,
      b.total_amount,
      b.status AS booking_status,
      p.status AS payment_status,
      p.mode AS payment_mode,
      p.transaction_ref,
      b.booking_date
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN shows s ON b.show_id = s.id
    JOIN movies m ON s.movie_id = m.id
    LEFT JOIN payments p ON p.booking_id = b.id
    WHERE 1=1
  `;
  const params = [];
  if (fromDate) {
    query += ' AND s.show_date >= ?';
    params.push(fromDate);
  }
  if (toDate) {
    query += ' AND s.show_date <= ?';
    params.push(toDate);
  }
  query += ' ORDER BY b.booking_date DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getReportSummary = async (fromDate, toDate) => {
  let query = `
    SELECT 
      COUNT(b.id) AS total_bookings,
      IFNULL(SUM(b.seats_booked),0) AS total_seats,
      IFNULL(SUM(b.total_amount),0) AS total_revenue,
      IFNULL(SUM(CASE WHEN b.status='cancelled' THEN 1 ELSE 0 END),0) AS cancelled_count
    FROM bookings b
    JOIN shows s ON b.show_id = s.id
    WHERE 1=1
  `;
  const params = [];
  if (fromDate) {
    query += ' AND s.show_date >= ?';
    params.push(fromDate);
  }
  if (toDate) {
    query += ' AND s.show_date <= ?';
    params.push(toDate);
  }
  const [rows] = await db.query(query, params);
  return rows[0];
};