const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM movies ORDER BY id DESC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { title, genre, language, duration_minutes, rating, release_date, description, poster_url } = data;
  const [r] = await db.query(
    `INSERT INTO movies (title, genre, language, duration_minutes, rating, release_date, description, poster_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, genre, language, duration_minutes, rating, release_date, description, poster_url]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { title, genre, language, duration_minutes, rating, release_date, description, poster_url } = data;
  await db.query(
    `UPDATE movies SET title=?, genre=?, language=?, duration_minutes=?, rating=?, release_date=?, description=?, poster_url=? WHERE id=?`,
    [title, genre, language, duration_minutes, rating, release_date, description, poster_url, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM movies WHERE id = ?', [id]);
};