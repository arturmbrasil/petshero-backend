import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import LostAnimal from '../models/LostAnimal';

interface Request {
  animal_id: string;
  owner_id: string;
  avatarFilename: string;
}

class UpdateLostAnimalAvatarService {
  public async execute({
    animal_id,
    owner_id,
    avatarFilename,
  }: Request): Promise<LostAnimal> {
    const lostAnimalsRepository = getRepository(LostAnimal);

    const animal = await lostAnimalsRepository.findOne({
      where: { id: animal_id },
      relations: ['owner'],
    });

    if (!animal) {
      throw new Error('Animal not exists.');
    }

    if (animal.owner.id !== owner_id) {
      throw new Error('Only the owner of the animal can change their avatar.');
    } else {
      if (animal.avatar) {
        // Se o animal já tem um avatar, deletar
        const animalAvatarFilePath = path.join(
          uploadConfig.directory,
          animal.avatar,
        );
        const animalAvatarFileExist = await fs.promises.stat(
          animalAvatarFilePath,
        );

        if (animalAvatarFileExist) {
          await fs.promises.unlink(animalAvatarFilePath);
        }
      }

      animal.avatar = avatarFilename;

      await lostAnimalsRepository.save(animal);

      return animal;
    }
  }
}

export default UpdateLostAnimalAvatarService;
