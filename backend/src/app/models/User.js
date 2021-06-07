import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import EventInvite from './EventInvite';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Event, { foreignKey: 'user_id', as: 'events' });
    this.belongsToMany(models.Event, {
      through: EventInvite,
      as: 'invites',
    });
  }

  async checkPassword(password) {
    const check = await bcrypt.compare(password, this.password_hash);
    return check;
  }

  mainData(user) {
    user.password = undefined;
    user.password_hash = undefined;

    return user;
  }
}

export default User;
