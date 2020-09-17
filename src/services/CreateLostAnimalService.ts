import { getRepository } from 'typeorm';

import LostAnimal from '../models/LostAnimal';
import User from '../models/User';

interface Request {
  owner_id: string;
  name: string;
  age: string;
  gender: string;
  size: string;
  species: string;
  breed: string;
  description: string;
}

class CreateLostAnimalService {
  public async execute({
    owner_id,
    name,
    age,
    gender,
    size,
    species,
    breed,
    description,
  }: Request): Promise<LostAnimal> {
    const lostAnimalRepository = getRepository(LostAnimal);
    const usersRepository = getRepository(User);

    const checkIfIsOwner = await usersRepository.findOne({
      where: { id: owner_id },
    });

    if (!checkIfIsOwner) {
      throw new Error('Owner not found.');
    }

    const animal = lostAnimalRepository.create({
      owner_id,
      name,
      age,
      gender,
      size,
      species,
      breed,
      description,
      found: false,
    });

    await lostAnimalRepository.save(animal);

    return animal;
  }
}

export default CreateLostAnimalService;
