const { BookmarkRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const fetch = require('node-fetch');

const fetchTitle = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : url;
  } catch {
    return url;
  }
};

const create = async (data) => {
  if (!data.title) {
    data.title = await fetchTitle(data.url);
  }
  return await BookmarkRepository.create(data);
};

const getAll = async ({ userId, q, tags }) => {
  return await BookmarkRepository.search({ userId, q, tags });
};

const get = async (id, userId) => {
  const bookmark = await BookmarkRepository.getByIdAndUser(id, userId);
  if (!bookmark) throw new AppError('Bookmark not found', 404);
  return bookmark;
};

const update = async (id, data, userId) => {
  return await BookmarkRepository.updateByIdAndUser(id, data, userId);
};

const destroy = async (id, userId) => {
  return await BookmarkRepository.deleteByIdAndUser(id, userId);
};

const toggleFavorite = async (id, userId) => {
  return await BookmarkRepository.toggleFavorite(id, userId);
};

module.exports = { create, getAll, get, update, destroy, toggleFavorite }; 