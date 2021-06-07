import Sequelize, { Model } from 'sequelize';

class EventInvite extends Model {
  static init(sequelize) {
    super.init(
      {
        accepted: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default EventInvite;
