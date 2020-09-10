import { Router } from 'express';
import { classToClass } from 'class-transformer';

import ShowOngsService from '../services/ShowOngsService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const ongsRouter = Router();

ongsRouter.use(ensureAuthenticated);

ongsRouter.get('/', async (request, response) => {
  try {
    const user_id = request.user.id;
    let city = '';
    let uf = '';
    if (request.query) {
      if (request.query.city) city = (request.query as any).city;
      if (request.query.uf) uf = (request.query as any).uf;
    }

    const showOngs = new ShowOngsService();

    const ongs = await showOngs.execute({ user_id, city, uf });

    return response.json(classToClass(ongs));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default ongsRouter;
