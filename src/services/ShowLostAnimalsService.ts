import { getRepository } from 'typeorm';

import LostAnimal from '../models/LostAnimal';

interface Request {
  owner_id?: string | null;
  owner_name?: string | null;
  animal_name?: string | null;
  age?: string | null;
  gender?: string | null;
  size?: string | null;
  species?: string | null;
  breed?: string | null;
  found?: boolean | null;
}

class ShowLostAnimalsService {
  public async execute({
    owner_id,
    owner_name,
    animal_name,
    age,
    gender,
    size,
    species,
    breed,
    found,
  }: Request): Promise<LostAnimal[]> {
    const lostAnimalsRepository = getRepository(LostAnimal);

    let animals = null;

    if (owner_id) {
      animals = await lostAnimalsRepository.find({
        where: { owner_id },
        relations: ['owner'],
      });
    } else if (owner_name) {
      animals = await lostAnimalsRepository
        .createQueryBuilder('lost_animals')
        .innerJoinAndSelect('lost_animals.owner', 'owner')
        .where('ong.id = lost_animals.owner_id')
        .andWhere(`lost_animals.name ILIKE :owner_name`, {
          owner_name: `%${owner_name}%`,
        })
        .getMany();
    } else if (animal_name) {
      animals = await lostAnimalsRepository
        .createQueryBuilder('lost_animals')
        .innerJoinAndSelect('lost_animals.owner', 'owner')
        .where('ong.id = lost_animals.owner_id')
        .andWhere(`lost_animals.name ILIKE :animal_name`, {
          animal_name: `%${animal_name}%`,
        })
        .getMany();
    } else if (age) {
      animals = await lostAnimalsRepository.find({
        where: { age },
        relations: ['owner'],
      });
    } else if (gender) {
      animals = await lostAnimalsRepository.find({
        where: { gender },
        relations: ['owner'],
      });
    } else if (size) {
      animals = await lostAnimalsRepository.find({
        where: { size },
        relations: ['owner'],
      });
    } else if (species) {
      animals = await lostAnimalsRepository.find({
        where: { species },
        relations: ['owner'],
      });
    } else if (breed) {
      animals = await lostAnimalsRepository.find({
        where: { breed },
        relations: ['owner'],
      });
    } else if (found) {
      animals = await lostAnimalsRepository.find({
        where: { found },
        relations: ['owner'],
      });
    } else {
      animals = await lostAnimalsRepository.find({
        relations: ['owner'],
      });
    }

    if (!animals) {
      throw new Error('No animal was found.');
    }

    return animals;
  }
}

export default ShowLostAnimalsService;
