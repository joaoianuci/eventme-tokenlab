import { Router } from 'express';
import ExpressBrute from 'express-brute';
import AuthenticateController from './app/controllers/AuthenticateController';
import EventController from './app/controllers/EventController';
import InviteController from './app/controllers/InviteController';
import RSVPController from './app/controllers/RSVPController';
import ScheduleController from './app/controllers/ScheduleController';
import UserController from './app/controllers/UserController';
import auth from './middlewares/auth';

const routes = new Router();
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store);

routes.post('/users', UserController.store);
routes.post('/users/auth', bruteForce.prevent, AuthenticateController.store);

routes.use(auth);
// Routes with auth
routes.get('/users/auth/token', AuthenticateController.show);
routes.delete('/users', UserController.destroy);
routes.put('/users', UserController.update);

routes.post('/events', EventController.store);
routes.delete('/events/:event_id', EventController.destroy);
routes.put('/events/:event_id', EventController.update);
routes.get('/schedule', ScheduleController.index);

routes.post('/invites/:event_id', InviteController.store);
routes.get('/invites', InviteController.index);

routes.post('/rsvp/:event_id', RSVPController.store);

export default routes;
