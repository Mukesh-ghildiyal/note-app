const CrudRepository = require('./crud-repository');
const { User } = require('../models');

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }
}

module.exports = new UserRepository(); 