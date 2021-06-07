import * as Yup from 'yup';
import Event from '../models/Event';
import EventInvite from '../models/EventInvite';
import User from '../models/User';

class RSVPController {
  async store(req, res) {
    const schema = Yup.object().shape({
      userId: Yup.number().required(),
      event_id: Yup.number().required(),
      choice: Yup.boolean().required(),
    });

    if (
      !(await schema.isValid({
        userId: req.userId,
        event_id: req.params.event_id,
        choice: req.body.choice,
      }))
    ) {
      return res
        .status(400)
        .json({ where: { description: req.body.description } });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User was not found' });
    }

    const event = await Event.findByPk(req.params.event_id);

    if (!event) {
      return res.status(404).json({ error: 'Event was not found' });
    }

    const { choice } = req.body;

    const invite = await EventInvite.findOne({
      where: {
        user_id: user.id,
        event_id: event.id,
      },
    });
    if (invite.accepted !== null) {
      return res
        .status(400)
        .json({ error: 'That invite has already been responded' });
    }
    await invite.update({ accepted: choice });
    await invite.save();

    return res.json(invite);
  }
}

export default new RSVPController();
