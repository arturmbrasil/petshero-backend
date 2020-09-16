import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import OngAnimal from '../models/OngAnimal';

interface Request {
  animal_id: string;
  ong_id: string;
  avatarFilename: string;
}

class UpdateOngAnimalAvatarService {
  public async execute({
    animal_id,
    ong_id,
    avatarFilename,
  }: Request): Promise<OngAnimal> {
    const ongAnimalsRepository = getRepository(OngAnimal);

    const animal = await ongAnimalsRepository.findOne({
      where: { id: animal_id },
      relations: ['ong'],
    });

    if (!animal) {
      throw new Error('Animal not exists.');
    }

    if (animal.ong.id !== ong_id) {
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

      await ongAnimalsRepository.save(animal);

      return animal;
    }
  }
}

export default UpdateOngAnimalAvatarService;
