import { getRepository } from 'typeorm';

import OngAnimal from '../models/OngAnimal';
import User from '../models/User';

interface Request {
  ong_id: string;
  name: string;
  age: string;
  gender: string;
  size: string;
  species: string;
  breed: string;
  description: string;
}

class CreateOngAnimalService {
  public async execute({
    ong_id,
    name,
    age,
    gender,
    size,
    species,
    breed,
    description,
  }: Request): Promise<OngAnimal> {
    const ongAnimalRepository = getRepository(OngAnimal);
    const usersRepository = getRepository(User);

    const checkIfIsOng = await usersRepository.findOne({
      where: { id: ong_id },
    });

    if (!checkIfIsOng) {
      throw new Error('Ong not found.');
    }

    // se o usuario logado não é uma ong
    if (!checkIfIsOng.is_ong) {
      throw new Error('User is not a Ong.');
    }

    const animal = ongAnimalRepository.create({
      ong_id,
      name,
      age,
      gender,
      size,
      species,
      breed,
      description,
      adopted: false,
    });

    await ongAnimalRepository.save(animal);

    return animal;
  }
}

export default CreateOngAnimalService;
