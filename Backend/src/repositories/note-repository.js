const CrudRepository = require('./crud-repository');
const { Note } = require('../models');

class NoteRepository extends CrudRepository {
  constructor() {
    super(Note);
  }

  async search({ userId, q, tags }) {
    const filter = { userId };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
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
    const note = await this.getByIdAndUser(id, userId);
    if (!note) throw new Error('Note not found');
    note.favorite = !note.favorite;
    await note.save();
    return note;
  }
}

module.exports = new NoteRepository(); 