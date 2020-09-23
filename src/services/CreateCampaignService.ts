import { getRepository } from 'typeorm';

import Campaign from '../models/Campaign';
import OngAnimal from '../models/OngAnimal';
import User from '../models/User';

interface Request {
  ong_id: string;
  animal_id?: string;
  target_value: number;
  received_value: number;
  title: string;
  description?: string;
}

class CreateCampaignService {
  public async execute({
    ong_id,
    animal_id,
    target_value,
    received_value,
    title,
    description,
  }: Request): Promise<Campaign> {
    const ongAnimalRepository = getRepository(OngAnimal);
    const usersRepository = getRepository(User);
    const campaignRepository = getRepository(Campaign);

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

    // verifica se o animal informado pertence a ong logada
    if (animal_id) {
      const checkAnimal = await ongAnimalRepository.findOne({
        where: { id: animal_id },
      });

      if (!checkAnimal) {
        throw new Error('Animal not found.');
      }

      if (checkAnimal?.ong_id !== ong_id) {
        throw new Error('Ong is not owner of the animal.');
      }
    }

    const campaign = campaignRepository.create({
      ong_id,
      animal_id,
      target_value,
      received_value,
      title,
      description,
      activated: true,
    });

    await campaignRepository.save(campaign);

    return campaign;
  }
}

export default CreateCampaignService;
