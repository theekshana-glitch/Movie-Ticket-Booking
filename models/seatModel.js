const db = require('../config/db');

exports.getAll = async (date = '') => {
  let query = `
    SELECT s.id, s.screen_name, s.show_date, s.show_time,
           s.ticket_price, s.total_seats, s.available_seats,
           (s.total_seats - s.available_seats) AS booked_seats,
           m.title AS movie_title, m.genre
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

exports.getByShowId = async (showId) => {
  const [rows] = await db.query(
    `SELECT s.id, s.screen_name, s.show_date, s.show_time,
            s.ticket_price, s.total_seats, s.available_seats,
            (s.total_seats - s.available_seats) AS booked_seats,
            m.title AS movie_title, m.genre
     FROM shows s
     JOIN movies m ON s.movie_id = m.id
     WHERE s.id = ?`,
    [showId]
  );
  return rows[0];
};