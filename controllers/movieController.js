const Movie = require('../models/movieModel');

exports.list = async (req, res) => {
  const movies = await Movie.getAll();
  res.json(movies);
};

exports.get = async (req, res) => {
  const movie = await Movie.getById(req.params.id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });
  res.json(movie);
};

exports.create = async (req, res) => {
  const { title, genre, language, duration_minutes } = req.body;
  if (!title || !genre || !language || !duration_minutes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const id = await Movie.create(req.body);
  res.status(201).json({ message: 'Movie created', id });
};

exports.update = async (req, res) => {
  await Movie.update(req.params.id, req.body);
  res.json({ message: 'Movie updated' });
};

exports.remove = async (req, res) => {
  await Movie.remove(req.params.id);
  res.json({ message: 'Movie deleted' });
};