import * as Yup from 'yup';
import Event from '../models/Event';
import User from '../models/User';

class SchedulleController {
  async index(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
    });

    if (
      !(await schema.isValid({
        user_id: req.userId,
      }))
    ) {
      return res
        .status(400)
        .json({ error: 'The user identifier not is valid' });
    }
    const user = await User.findByPk(req.userId);
    const events = await Event.findAll({
      where: { user_id: req.userId, canceled_at: null },
    });
    const options = {
      where: {
        canceled_at: null,
      },
      through: {
        where: {
          accepted: true,
        },
      },
    };
    const invites = await user.getInvites(options);

    return res.json({ events, invites });
  }
}

export default new SchedulleController();
