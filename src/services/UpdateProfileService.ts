import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
  whatsapp: string;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
    whatsapp,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUser = await usersRepository.findOne(user_id);

    if (!checkUser) {
      throw new Error('User not found.');
    }

    const userWithUpdatedEmail = await usersRepository.findOne({
      where: { email },
    });

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new Error('Email already in use.');
    }

    checkUser.name = name;
    checkUser.email = email;
    checkUser.whatsapp = whatsapp;

    if (password && !old_password) {
      throw new Error(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, checkUser.password);

      if (!checkOldPassword) {
        throw new Error('Old password does not match.');
      }

      checkUser.password = await hash(password, 8);
    }

    return usersRepository.save(checkUser);
  }
}

export default UpdateProfileService;
