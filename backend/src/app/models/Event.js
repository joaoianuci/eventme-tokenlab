import Sequelize, { Model } from 'sequelize';
import EventInvite from './EventInvite';

class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        start: Sequelize.DATE,
        end: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
    this.belongsToMany(models.User, {
      through: EventInvite,
      as: 'guests',
    });
  }
}

export default Event;
