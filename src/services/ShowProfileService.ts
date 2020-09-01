import { getRepository } from 'typeorm';

import User from '../models/User';

interface Request {
  user_id: string;
}

class ShowProfileService {
  public async execute({ user_id }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }
}

export default ShowProfileService;
