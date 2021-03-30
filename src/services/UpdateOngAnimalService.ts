import { getRepository } from 'typeorm';

import OngAnimal from '../models/OngAnimal';

interface Request {
  animal_id: string;
  ong_id: string;
  name?: string;
  age?: string;
  gender?: string;
  size?: string;
  species?: string;
  breed?: string;
  adopted?: boolean;
  description?: string;
}

class UpdateOngAnimalService {
  public async execute({
    animal_id,
    ong_id,
    name,
    age,
    gender,
    size,
    species,
    breed,
    adopted,
    description,
  }: Request): Promise<OngAnimal> {
    const ongAnimalsRepository = getRepository(OngAnimal);

    const checkAnimal = await ongAnimalsRepository.findOne({
      where: { id: animal_id },
      relations: ['ong'],
    });

    if (!checkAnimal) {
      throw new Error('Animal not found.');
    }

    if (checkAnimal.ong.id !== ong_id) {
      throw new Error('Only the owner can update this animal.');
    }

    if (name) checkAnimal.name = name;
    if (age) checkAnimal.age = age;
    if (gender) checkAnimal.gender = gender;
    if (size) checkAnimal.size = size;
    if (species) checkAnimal.species = species;
    if (breed) checkAnimal.breed = breed;
    if (adopted !== undefined) checkAnimal.adopted = adopted;
    if (description) checkAnimal.description = description;

    return ongAnimalsRepository.save(checkAnimal);
  }
}

export default UpdateOngAnimalService;
