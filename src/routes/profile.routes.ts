import { Router } from 'express';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '../services/UpdateProfileService';
import ShowProfileService from '../services/ShowProfileService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', async (request, response) => {
  try {
    const user_id = request.user.id;
    const { name, email, old_password, password, whatsapp, pix } = request.body;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
      whatsapp,
      pix,
    });

    return response.json(classToClass(user));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

profileRouter.get('/', async (request, response) => {
  try {
    const user_id = request.user.id;

    const showProfile = new ShowProfileService();

    const user = await showProfile.execute({ user_id });

    return response.json(classToClass(user));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default profileRouter;
