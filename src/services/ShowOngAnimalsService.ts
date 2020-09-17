import { getRepository } from 'typeorm';

import OngAnimal from '../models/OngAnimal';

interface Request {
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
      });
    } else if (ong_name) {
      animals = await ongAnimalsRepository
        .createQueryBuilder('ong_animals')
        .innerJoinAndSelect('ong_animals.ong', 'ong')
        .where('ong.id = ong_animals.ong_id')
        .andWhere(`ong_animals.name ILIKE :ong_name`, {
          ong_name: `%${ong_name}%`,
        })
        .getMany();
    } else if (animal_name) {
      animals = await ongAnimalsRepository
        .createQueryBuilder('ong_animals')
        .innerJoinAndSelect('ong_animals.ong', 'ong')
        .where('ong.id = ong_animals.ong_id')
        .andWhere(`ong_animals.name ILIKE :animal_name`, {
          animal_name: `%${animal_name}%`,
        })
        .getMany();
    } else if (age) {
      animals = await ongAnimalsRepository.find({
        where: { age },
        relations: ['ong'],
      });
    } else if (gender) {
      animals = await ongAnimalsRepository.find({
        where: { gender },
        relations: ['ong'],
      });
    } else if (size) {
      animals = await ongAnimalsRepository.find({
        where: { size },
        relations: ['ong'],
      });
    } else if (species) {
      animals = await ongAnimalsRepository.find({
        where: { species },
        relations: ['ong'],
      });
    } else if (breed) {
      animals = await ongAnimalsRepository.find({
        where: { breed },
        relations: ['ong'],
      });
    } else if (adopted) {
      animals = await ongAnimalsRepository.find({
        where: { adopted },
        relations: ['ong'],
      });
    } else {
      animals = await ongAnimalsRepository.find({
        relations: ['ong'],
      });
    }

    if (!animals) {
      throw new Error('No animal was found.');
    }

    return animals;
  }
}

export default ShowOngAnimalsService;
