import { getRepository } from 'typeorm';

import Campaign from '../models/Campaign';
import OngAnimal from '../models/OngAnimal';

interface Request {
  campaign_id: string;
  ong_id: string;
  animal_id?: string;
  target_value?: number;
  received_value?: number;
  title?: string;
  description?: string;
  activated?: boolean;
}

class UpdateCampaignService {
  public async execute({
    campaign_id,
    ong_id,
    animal_id,
    target_value,
    received_value,
    title,
    description,
    activated,
  }: Request): Promise<Campaign> {
    const campaignRepository = getRepository(Campaign);
    const ongAnimalRepository = getRepository(OngAnimal);

    const checkCampaign = await campaignRepository.findOne({
      where: { id: campaign_id },
      relations: ['ong', 'ongAnimal'],
    });

    if (!checkCampaign) {
      throw new Error('Campaign not found.');
    }

    if (checkCampaign.ong.id !== ong_id) {
      throw new Error('Only the owner can update this campaign.');
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
      if (animal_id) checkCampaign.ongAnimal = checkAnimal;
    }

    if (animal_id) checkCampaign.animal_id = animal_id;
    if (target_value) checkCampaign.target_value = target_value;
    if (received_value) checkCampaign.received_value = received_value;
    if (title) checkCampaign.title = title;
    if (activated !== undefined) checkCampaign.activated = activated;
    if (description) checkCampaign.description = description;

    return campaignRepository.save(checkCampaign);
  }
}

export default UpdateCampaignService;
