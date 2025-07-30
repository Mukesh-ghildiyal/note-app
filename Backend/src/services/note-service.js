const { NoteRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const create = async (data) => {
  return await NoteRepository.create(data);
};

const getAll = async ({ userId, q, tags }) => {
  return await NoteRepository.search({ userId, q, tags });
};

const get = async (id, userId) => {
  const note = await NoteRepository.getByIdAndUser(id, userId);
  if (!note) throw new AppError('Note not found', 404);
  return note;
};

const update = async (id, data, userId) => {
  return await NoteRepository.updateByIdAndUser(id, data, userId);
};

const destroy = async (id, userId) => {
  return await NoteRepository.deleteByIdAndUser(id, userId);
};

const toggleFavorite = async (id, userId) => {
  return await NoteRepository.toggleFavorite(id, userId);
};

module.exports = { create, getAll, get, update, destroy, toggleFavorite }; 