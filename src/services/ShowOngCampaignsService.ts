import { getRepository } from 'typeorm';

import Campaign from '../models/Campaign';

interface Request {
  ong_id?: string | null;
  animal_id?: string | null;
  ong_name?: string | null;
  animal_name?: string | null;
  title?: string | null;
}

class ShowOngCampaignsService {
  public async execute({
    ong_id,
    animal_id,
    ong_name,
    animal_name,
    title,
  }: Request): Promise<Campaign[]> {
    const campaignRepository = getRepository(Campaign);

    let campaigns = null;

    if (ong_id) {
      campaigns = await campaignRepository.find({
        where: { ong_id },
        relations: ['ong', 'ongAnimal'],
        order: { updated_at: 'DESC' },
      });
    } else if (animal_id) {
      campaigns = await campaignRepository.find({
        where: { animal_id },
        relations: ['ong', 'ongAnimal'],
        order: { updated_at: 'DESC' },
      });
    } else if (ong_name) {
      campaigns = await campaignRepository
        .createQueryBuilder('campaigns')
        .innerJoinAndSelect('campaigns.ong', 'ong')
        .innerJoinAndSelect('campaigns.ongAnimal', 'ongAnimal')
        .where('ong.id = campaigns.ong_id')
        .andWhere(`ong.name ILIKE :ong_name`, {
          ong_name: `%${ong_name}%`,
        })
        .orderBy(`updated_at`, `DESC`)
        .getMany();
    } else if (animal_name) {
      campaigns = await campaignRepository
        .createQueryBuilder('campaigns')
        .innerJoinAndSelect('campaigns.ongAnimal', 'ongAnimal')
        .innerJoinAndSelect('campaigns.ong', 'ong')
        .where('ongAnimal.id = campaigns.animal_id')
        .andWhere(`ongAnimal.name ILIKE :animal_name`, {
          animal_name: `%${animal_name}%`,
        })
        .orderBy(`updated_at`, `DESC`)
        .getMany();
    } else if (title) {
      campaigns = await campaignRepository
        .createQueryBuilder('campaigns')
        .innerJoinAndSelect('campaigns.ongAnimal', 'ongAnimal')
        .innerJoinAndSelect('campaigns.ong', 'ong')
        .andWhere(`title ILIKE :title`, {
          title: `%${title}%`,
        })
        .orderBy(`updated_at`, `DESC`)
        .getMany();
    } else {
      campaigns = await campaignRepository.find({
        relations: ['ong', 'ongAnimal'],
        order: { updated_at: 'DESC' },
      });
    }

    if (!campaigns) {
      throw new Error('No campaign was found.');
    }

    return campaigns;
  }
}

export default ShowOngCampaignsService;
