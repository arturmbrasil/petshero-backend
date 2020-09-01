import { Router } from 'express';

import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import profileRouter from './profile.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);

export default routes;
