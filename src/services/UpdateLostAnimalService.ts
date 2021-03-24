import { getRepository } from 'typeorm';

import LostAnimal from '../models/LostAnimal';

interface Request {
  animal_id: string;
  owner_id: string;
  name?: string;
  age?: string;
  gender?: string;
  size?: string;
  species?: string;
  breed?: string;
  found?: boolean;
  description?: string;
}

class UpdateLostAnimalService {
  public async execute({
    animal_id,
    owner_id,
    name,
    age,
    gender,
    size,
    species,
    breed,
    found,
    description,
  }: Request): Promise<LostAnimal> {
    const lostAnimalsRepository = getRepository(LostAnimal);

    const checkAnimal = await lostAnimalsRepository.findOne({
      where: { id: animal_id },
      relations: ['owner'],
    });

    if (!checkAnimal) {
      throw new Error('Animal not found.');
    }

    if (checkAnimal.owner.id !== owner_id) {
      throw new Error('Only the owner can update this animal.');
    }

    if (name) checkAnimal.name = name;
    if (age) checkAnimal.age = age;
    if (gender) checkAnimal.gender = gender;
    if (size) checkAnimal.size = size;
    if (species) checkAnimal.species = species;
    if (breed) checkAnimal.breed = breed;
    if (found !== undefined) checkAnimal.found = found;
    if (description) checkAnimal.description = description;

    return lostAnimalsRepository.save(checkAnimal);
  }
}

export default UpdateLostAnimalService;
