import * as Yup from 'yup';
import Event from '../models/Event';
import User from '../models/User';

class InviteController {
  async index(req, res) {
    const schema = Yup.object().shape({
      userId: Yup.number().required(),
    });

    if (!(await schema.isValid(req))) {
      return res
        .status(400)
        .json({ where: { description: req.body.description } });
    }
    const user = await User.findByPk(req.userId);
    const invites = await user.getInvites({
      through: {
        where: {
          accepted: null,
        },
      },
    });

    return res.json(invites);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      event_id: Yup.number().required(),
      invited_email: Yup.string().required(),
    });
    if (
      !(await schema.isValid({
        user_id: req.userId,
        event_id: req.params.event_id,
        invited_email: req.body.invited_email,
      }))
    ) {
      return res.status(400).json({ error: 'The identifiers not is valid' });
    }
    const guest = await User.findOne({
      where: { email: req.body.invited_email },
    });
    if (!guest) {
      return res.status(404).json({ error: 'Invited user not was found' });
    }
    const event = await Event.findOne({
      where: { id: req.params.event_id, user_id: req.userId },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not was found' });
    }
    const options = {
      through: {
        where: {
          user_id: guest.id,
        },
      },
    };
    const invite = await event.getGuests(options);

    if (invite.length > 0) {
      return res.status(400).json({ error: 'User already invited' });
    }

    await event.addGuest(guest);
    guest.password_hash = undefined;
    return res.json(guest);
  }
}

export default new InviteController();
