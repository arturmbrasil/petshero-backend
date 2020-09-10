import { getRepository, Not } from 'typeorm';

import User from '../models/User';

interface Request {
  user_id: string;
  city?: string | null;
  uf?: string | null;
}

class ShowOngsService {
  public async execute({
    user_id,
    city = null,
    uf = null,
  }: Request): Promise<User[]> {
    const usersRepository = getRepository(User);

    let ongs = null;

    if (city) {
      ongs = await usersRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.address', 'address')
        .where('address.id = users.address_id')
        .andWhere(`users.id <> :user_id`, { user_id })
        .andWhere(`address.city ILIKE :city`, { city: `%${city}%` })
        .getMany();
    } else if (uf) {
      ongs = await usersRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.address', 'address')
        .where('address.id = users.address_id')
        .andWhere(`users.id <> :user_id`, { user_id })
        .andWhere(`address.uf ILIKE :uf`, { uf: `%${uf}%` })
        .getMany();
    } else {
      ongs = await usersRepository.find({
        relations: ['address'],
        where: { id: Not(user_id), is_ong: true },
      });
    }

    if (!ongs) {
      throw new Error('No ong was found.');
    }

    return ongs;
  }
}

export default ShowOngsService;
