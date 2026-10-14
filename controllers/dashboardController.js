const db = require('../config/db');

exports.summary = async (req, res) => {
  try {
    const result = {};

    const [r1] = await db.query('SELECT COUNT(*) AS c FROM customers');
    result.total_customers = r1[0].c;

    const [r2] = await db.query('SELECT COUNT(*) AS c FROM movies');
    result.total_movies = r2[0].c;

    const [r3] = await db.query('SELECT COUNT(*) AS c FROM shows');
    result.total_shows = r3[0].c;

    const [r4] = await db.query(
      'SELECT COUNT(*) AS c FROM bookings b JOIN shows s ON b.show_id = s.id WHERE s.show_date = CURDATE()'
    );
    result.todays_bookings = r4[0].c;

    const [r5] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS c FROM payments WHERE status='paid'"
    );
    result.total_revenue = r5[0].c;

    const [r6] = await db.query(
      "SELECT COUNT(*) AS c FROM payments WHERE status='pending'"
    );
    result.pending_payments = r6[0].c;

    res.json(result);
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.report = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT m.title, COUNT(b.id) AS bookings, IFNULL(SUM(b.total_amount),0) AS revenue " +
      "FROM movies m " +
      "LEFT JOIN shows s ON s.movie_id = m.id " +
      "LEFT JOIN bookings b ON b.show_id = s.id " +
      "GROUP BY m.id " +
      "ORDER BY revenue DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Dashboard report error:', err);
    res.status(500).json({ error: err.message });
  }
};