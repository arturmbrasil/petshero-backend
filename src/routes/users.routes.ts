import { Router } from 'express';

import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import CreateAddressService from '../services/CreateAddressService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password, whatsapp, pix, is_ong } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
      whatsapp,
      pix,
      is_ong,
    });

    return response.json(classToClass(user));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();

      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(user));
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

usersRouter.post('/address', ensureAuthenticated, async (request, response) => {
  try {
    const user_id = request.user.id;

    const { street, number, neighborhood, city, uf, cep } = request.body;

    const createAddress = new CreateAddressService();

    const user = await createAddress.execute({
      user_id,
      street,
      number,
      neighborhood,
      city,
      uf,
      cep,
    });

    return response.json(classToClass(user));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
