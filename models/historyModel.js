const db = require('../config/db');

exports.getAll = async (email = '') => {
  let query = `
    SELECT h.*, m.title AS movie_title
    FROM watch_history h
    JOIN movies m ON h.movie_id = m.id
  `;
  const params = [];
  if (email) {
    query += ' WHERE h.guest_email = ?';
    params.push(email);
  }
  query += ' ORDER BY h.watched_on DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.create = async (data) => {
  const { guest_email, movie_id, watched_on, rating, review } = data;
  const [r] = await db.query(
    `INSERT INTO watch_history (guest_email, movie_id, watched_on, rating, review)
     VALUES (?, ?, ?, ?, ?)`,
    [guest_email, movie_id, watched_on, rating, review]
  );
  return r.insertId;
};

exports.remove = async (id) => {
  await db.query('DELETE FROM watch_history WHERE id = ?', [id]);
};