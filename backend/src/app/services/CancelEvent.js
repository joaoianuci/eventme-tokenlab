import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import Event from '../models/Event';

class CancelEvent {
  async run({ user_id, event_id, res }) {
    const event = await Event.findOne({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email'],
        },
      ],
      where: {
        id: event_id,
        user_id,
        canceled_at: null,
      },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not was founded.' });
    }
    if (user_id !== event.user_id) {
      res
        .status(400)
        .json({ error: 'User identifier not equal with event user.' });
    }
    const dateWithSub = subHours(event.date, 3);

    if (isBefore(dateWithSub, new Date())) {
      res.status(400).json({
        error: 'You can only cancel events 3 hours in advance.',
      });
    }

    event.canceled_at = new Date();

    await event.save();

    return event;
  }
}
export default new CancelEvent();
