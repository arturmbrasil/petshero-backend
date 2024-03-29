import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  pix: string;
  is_ong: boolean;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    whatsapp,
    pix,
    is_ong,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
      whatsapp,
      pix,
      is_ong,
      avatar: 'default.jpeg',
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
