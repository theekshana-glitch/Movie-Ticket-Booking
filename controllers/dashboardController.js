const db = require('../config/db');

exports.summary = async (req, res) => {
  try {
    const [[{ total_movies }]] = await db.query('SELECT COUNT(*) AS total_movies FROM movies');
    const [[{ total_shows }]] = await db.query('SELECT COUNT(*) AS total_shows FROM shows');
    const [[{ todays_bookings }]] = await db.query(
      `SELECT COUNT(*) AS todays_bookings FROM bookings b
       JOIN shows s ON b.show_id = s.id WHERE s.show_date = CURDATE()`
    );
    const [[{ total_revenue }]] = await db.query(
      `SELECT IFNULL(SUM(amount),0) AS total_revenue FROM payments WHERE status='paid'`
    );
    const [[{ pending_payments }]] = await db.query(
      `SELECT COUNT(*) AS pending_payments FROM payments WHERE status='pending'`
    );
    res.json({
      total_movies,
      total_shows,
      todays_bookings,
      total_revenue,
      pending_payments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.report = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.title, COUNT(b.id) AS bookings, IFNULL(SUM(b.total_amount),0) AS revenue
      FROM movies m
      LEFT JOIN shows s ON s.movie_id = m.id
      LEFT JOIN bookings b ON b.show_id = s.id
      GROUP BY m.id
      ORDER BY revenue DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};