import * as Yup from 'yup';

import User from '../models/User';
import generateToken from '../utils/generateToken';

class AuthenticateController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
        .max(35),
    });

    const { password, email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email } });
    }

    const user = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).send({ error: 'Invalid password' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: generateToken({ id: user.id }),
    });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
    });

    if (
      !(await schema.isValid({
        user_id: req.userId,
      }))
    ) {
      return res.status(400).json({ where: { user_id: req.userId } });
    }
    const user = await User.findByPk(req.userId);

    return res.json(user.mainData(user));
  }
}

export default new AuthenticateController();
