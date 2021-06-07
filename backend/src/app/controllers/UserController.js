import * as Yup from 'yup';
import PasswordValidator from 'password-validator';
import User from '../models/User';
import generateToken from '../utils/generateToken';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    const passwordSchema = new PasswordValidator();

    passwordSchema
      .is()
      .min(6)
      .is()
      .max(20)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!passwordSchema.validate(req.body.password)) {
      return res
        .status(400)
        .json({ error: 'Password is not satisfacting the requirements' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create(req.body);
    user.mainData(user);
    return res.json({ user, token: generateToken({ id: user.id }) });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });
    const passwordSchema = new PasswordValidator();

    passwordSchema
      .is()
      .min(6)
      .is()
      .max(20)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces()
      .has()
      .symbols();

    if (!passwordSchema.validate(req.body.password)) {
      return res
        .status(400)
        .json({ error: 'Password is not satisfacting the requirements' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ where: { email: req.body.email } });
    }
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'User not exists' });
    }
    await user.update(req.body);
    await user.update();

    return res.json(user.mainData(user));
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      userId: Yup.number().required(),
    });

    if (!(await schema.isValid(req))) {
      return res
        .status(400)
        .json({ where: { description: req.body.description } });
    }
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not exists' });
    }
    await user.destroy();
    return res.json();
  }
}

export default new UserController();
