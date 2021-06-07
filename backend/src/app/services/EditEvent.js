import { isBefore, parseISO, subHours } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Event from '../models/Event';

class EditEvent {
  async run({ user_id, event_id, eventData, res }) {
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
    const hourStart = parseISO(eventData.start);
    const hourEnd = parseISO(eventData.end);

    const checkAvailability = await Event.findOne({
      where: {
        user_id,
        canceled_at: null,
        [Op.not]: [
          {
            id: event_id,
          },
        ],
        [Op.or]: [
          {
            start: {
              [Op.between]: [hourStart, hourEnd],
            },
          },
          {
            end: {
              [Op.between]: [hourStart, hourEnd],
            },
          },
        ],
      },
    });
    if (checkAvailability) {
      return res.status(400).json({ error: 'Event date is not available' });
    }
    const dateWithSub = subHours(event.date, 3);

    if (isBefore(dateWithSub, new Date())) {
      res.status(400).json({
        error: 'You can only edit events 3 hours in advance.',
      });
    }

    await event.update(eventData);
    await event.save();

    return event;
  }
}
export default new EditEvent();
