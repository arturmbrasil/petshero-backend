import { getRepository } from 'typeorm';

import OngAnimal from '../models/OngAnimal';

interface Request {
  id?: string | null;
  ong_id?: string | null;
  ong_name?: string | null;
  animal_name?: string | null;
  age?: string | null;
  gender?: string | null;
  size?: string | null;
  species?: string | null;
  breed?: string | null;
  adopted?: boolean | null;
}

class ShowOngAnimalsService {
  public async execute({
    id,
    ong_id,
    ong_name,
    animal_name,
    age,
    gender,
    size,
    species,
    breed,
    adopted,
  }: Request): Promise<OngAnimal[]> {
    const ongAnimalsRepository = getRepository(OngAnimal);

    let animals = null;

    if (ong_id) {
      animals = await ongAnimalsRepository.find({
        where: { ong_id },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (ong_name) {
      animals = await ongAnimalsRepository
        .createQueryBuilder('ong_animals')
        .innerJoinAndSelect('ong_animals.ong', 'ong')
        .where('ong.id = ong_animals.ong_id')
        .andWhere(`ong_animals.name ILIKE :ong_name`, {
          ong_name: `%${ong_name}%`,
        })
        .orderBy(`updated_at`, `DESC`)
        .getMany();
    } else if (animal_name) {
      animals = await ongAnimalsRepository
        .createQueryBuilder('ong_animals')
        .innerJoinAndSelect('ong_animals.ong', 'ong')
        .where('ong.id = ong_animals.ong_id')
        .andWhere(`ong_animals.name ILIKE :animal_name`, {
          animal_name: `%${animal_name}%`,
        })
        .orderBy(`updated_at`, `DESC`)
        .getMany();
    } else if (id) {
      animals = await ongAnimalsRepository.find({
        where: { id },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (age) {
      animals = await ongAnimalsRepository.find({
        where: { age },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (gender) {
      animals = await ongAnimalsRepository.find({
        where: { gender },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (size) {
      animals = await ongAnimalsRepository.find({
        where: { size },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (species) {
      animals = await ongAnimalsRepository.find({
        where: { species },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (breed) {
      animals = await ongAnimalsRepository.find({
        where: { breed },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else if (adopted) {
      animals = await ongAnimalsRepository.find({
        where: { adopted },
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    } else {
      animals = await ongAnimalsRepository.find({
        relations: ['ong'],
        order: { updated_at: 'DESC' },
      });
    }

    if (!animals) {
      throw new Error('No animal was found.');
    }

    return animals;
  }
}

export default ShowOngAnimalsService;
