import { Router } from 'express';

import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import profileRouter from './profile.routes';
import ongsRouter from './ongs.routes';
import lostAnimalsRouter from './lost-animals.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/ongs', ongsRouter);
routes.use('/lost-animals', lostAnimalsRouter);

export default routes;
