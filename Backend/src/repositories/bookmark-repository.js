const CrudRepository = require('./crud-repository');
const { Bookmark } = require('../models');

class BookmarkRepository extends CrudRepository {
  constructor() {
    super(Bookmark);
  }

  async search({ userId, q, tags }) {
    const filter = { userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } },
      ];
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    return await this.model.find(filter);
  }

  async getByIdAndUser(id, userId) {
    return await this.model.findOne({ _id: id, userId });
  }

  async updateByIdAndUser(id, data, userId) {
    return await this.model.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }

  async deleteByIdAndUser(id, userId) {
    return await this.model.findOneAndDelete({ _id: id, userId });
  }

  async toggleFavorite(id, userId) {
    const bookmark = await this.getByIdAndUser(id, userId);
    if (!bookmark) throw new Error('Bookmark not found');
    bookmark.favorite = !bookmark.favorite;
    await bookmark.save();
    return bookmark;
  }
}

module.exports = new BookmarkRepository(); 