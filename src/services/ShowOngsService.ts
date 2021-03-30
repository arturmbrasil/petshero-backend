import { getRepository, Not } from 'typeorm';

import User from '../models/User';

interface Request {
  // user_id: string;
  city?: string | null;
  uf?: string | null;
  name?: string | null;
}

class ShowOngsService {
  public async execute({
    // user_id,
    city = null,
    uf = null,
    name = null,
  }: Request): Promise<User[]> {
    const usersRepository = getRepository(User);

    let ongs = null;

    if (city) {
      ongs = await usersRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.address', 'address')
        .where('address.id = users.address_id')
        // .andWhere(`users.id <> :user_id`, { user_id })
        .andWhere(`address.city ILIKE :city`, { city: `%${city}%` })
        .orderBy(`users.updated_at`, `DESC`)
        .getMany();
    } else if (uf) {
      ongs = await usersRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.address', 'address')
        .where('address.id = users.address_id')
        // .andWhere(`users.id <> :user_id`, { user_id })
        .andWhere(`address.uf ILIKE :uf`, { uf: `%${uf}%` })
        .orderBy(`users.updated_at`, `DESC`)
        .getMany();
    } else if (name) {
      ongs = await usersRepository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.address', 'address')
        .where('address.id = users.address_id')
        // .andWhere(`users.id <> :user_id`, { user_id })
        .andWhere(`users.name ILIKE :name`, { name: `%${name}%` })
        .orderBy(`users.updated_at`, `DESC`)
        .getMany();
    } else {
      ongs = await usersRepository.find({
        relations: ['address'],
        where: { is_ong: true },
        // where: { id: Not(user_id), is_ong: true },
        order: { updated_at: 'DESC' },
      });
    }

    if (!ongs) {
      throw new Error('No ong was found.');
    }

    return ongs;
  }
}

export default ShowOngsService;
