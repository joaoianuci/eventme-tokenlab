import * as Yup from 'yup';
import CancelEvent from '../services/CancelEvent';
import CreateEvent from '../services/CreateEvent';
import EditEvent from '../services/EditEvent';

class EventController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      start: Yup.date().required(),
      end: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ where: { description: req.body.description } });
    }
    const { start, end, description, name } = req.body;

    const event = await CreateEvent.run({
      user_id: req.userId,
      eventData: {
        name,
        description,
        start,
        end,
      },
      res,
    });

    return res.json(event);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      event_id: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string().required(),
      start: Yup.date().required(),
      end: Yup.date().required(),
    });

    const { event_id } = req.params;
    const { name, description, start, end } = req.body;

    if (
      !(await schema.isValid({
        user_id: req.userId,
        event_id,
        name,
        description,
        start,
        end,
      }))
    ) {
      return res
        .status(400)
        .json({ error: 'The user identifier not is valid' });
    }

    const event = await EditEvent.run({
      user_id: req.userId,
      event_id,
      eventData: { name, description, start, end },
      res,
    });
    return res.json(event);
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      event_id: Yup.number().required(),
    });

    const { event_id } = req.params;
    if (
      !(await schema.isValid({
        user_id: req.userId,
        event_id,
      }))
    ) {
      return res
        .status(400)
        .json({ error: 'The user identifier not is valid' });
    }
    const event = await CancelEvent.run({
      event_id,
      user_id: req.userId,
      res,
    });
    return res.json(event);
  }
}

export default new EventController();
