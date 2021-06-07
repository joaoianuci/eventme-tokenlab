import { parseISO, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Event from '../models/Event';

class CreateEvent {
  async run({ user_id, eventData, res }) {
    const hourStart = parseISO(eventData.start);
    const hourEnd = parseISO(eventData.end);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const checkAvailability = await Event.findOne({
      where: {
        user_id,
        canceled_at: null,
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
    const event = await Event.create({ ...eventData, user_id });

    return event;
  }
}
export default new CreateEvent();
