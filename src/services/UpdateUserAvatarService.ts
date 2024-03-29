import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id: user_id },
      relations: ['address'],
    });

    if (!user) {
      throw new Error('Only authenticated users can change avatar.');
    }

    if (user.avatar && user.avatar !== 'default.jpeg') {
      // Se o user já tem um avatar, deletar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
