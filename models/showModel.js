const db = require('../config/db');

exports.getAll = async (date = '') => {
  let query = `
    SELECT s.*, m.title AS movie_title, m.genre
    FROM shows s
    JOIN movies m ON s.movie_id = m.id
  `;
  const params = [];
  if (date) {
    query += ' WHERE s.show_date = ?';
    params.push(date);
  }
  query += ' ORDER BY s.show_date DESC, s.show_time ASC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM shows WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { movie_id, screen_name, show_date, show_time, ticket_price, total_seats } = data;
  const [r] = await db.query(
    `INSERT INTO shows (movie_id, screen_name, show_date, show_time, ticket_price, total_seats, available_seats)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [movie_id, screen_name, show_date, show_time, ticket_price, total_seats, total_seats]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { movie_id, screen_name, show_date, show_time, ticket_price, total_seats } = data;
  await db.query(
    `UPDATE shows SET movie_id=?, screen_name=?, show_date=?, show_time=?, ticket_price=?, total_seats=? WHERE id=?`,
    [movie_id, screen_name, show_date, show_time, ticket_price, total_seats, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM shows WHERE id = ?', [id]);
};