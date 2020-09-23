import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import Campaign from '../models/Campaign';

interface Request {
  campaign_id: string;
  ong_id: string;
  avatarFilename: string;
}

class UpdateCampaignAvatarService {
  public async execute({
    campaign_id,
    ong_id,
    avatarFilename,
  }: Request): Promise<Campaign> {
    const campaignRepository = getRepository(Campaign);

    const campaign = await campaignRepository.findOne({
      where: { id: campaign_id },
      relations: ['ong', 'ongAnimal'],
    });

    if (!campaign) {
      throw new Error('Campaign not exists.');
    }

    if (campaign.ong.id !== ong_id) {
      throw new Error(
        'Only the owner of the campaign can change their avatar.',
      );
    } else {
      if (campaign.avatar) {
        // Se a campanha já tem um avatar, deletar
        const campaignAvatarFilePath = path.join(
          uploadConfig.directory,
          campaign.avatar,
        );
        const campaignAvatarFileExist = await fs.promises.stat(
          campaignAvatarFilePath,
        );

        if (campaignAvatarFileExist) {
          await fs.promises.unlink(campaignAvatarFilePath);
        }
      }

      campaign.avatar = avatarFilename;

      await campaignRepository.save(campaign);

      return campaign;
    }
  }
}

export default UpdateCampaignAvatarService;
