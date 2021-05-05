import { Router } from 'express';

import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/upload';

import CreateCampaignService from '../services/CreateCampaignService';
import UpdateCampaignAvatarService from '../services/UpdateCampaignAvatarService';
import UpdateCampaignService from '../services/UpdateCampaignService';
import ShowOngCampaignsService from '../services/ShowOngCampaignsService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);

const campaignsRouter = Router();

campaignsRouter.use(ensureAuthenticated);

// CRIA UMA CAMPANHA
campaignsRouter.post('/', async (request, response) => {
  try {
    const ong_id = request.user.id;

    const {
      animal_id,
      target_value,
      received_value,
      title,
      description,
    } = request.body;

    const createCampaign = new CreateCampaignService();

    const campaign = await createCampaign.execute({
      ong_id,
      animal_id,
      target_value,
      received_value,
      title,
      description,
    });

    return response.json(classToClass(campaign));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// SALVA FOTO DA CAMPANHA
campaignsRouter.patch(
  '/avatar/:campaign_id',
  upload.single('avatar'),
  async (request, response) => {
    try {
      const { campaign_id } = request.params;
      const ong_id = request.user.id;

      const updateCampaignAvatar = new UpdateCampaignAvatarService();

      const campaign = await updateCampaignAvatar.execute({
        campaign_id,
        ong_id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(campaign));
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

// UPDATE CAMPANHA
campaignsRouter.put('/:campaign_id', async (request, response) => {
  try {
    const { campaign_id } = request.params;
    const ong_id = request.user.id;

    const {
      animal_id,
      target_value,
      received_value,
      title,
      description,
      activated,
    } = request.body;

    const updateCampaign = new UpdateCampaignService();

    const campaign = await updateCampaign.execute({
      campaign_id,
      ong_id,
      animal_id,
      target_value,
      received_value,
      title,
      description,
      activated,
    });

    return response.json(classToClass(campaign));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// LISTA CAMAPANHA (FILTROS)
campaignsRouter.get('/', async (request, response) => {
  try {
    // const user_id = request.user.id; // id do user logado

    let id = '';
    let ong_id = '';
    let animal_id = '';
    let ong_name = '';
    let animal_name = '';
    let title = '';
    let activated = '';

    if (request.query) {
      if (request.query.id) id = (request.query as any).id;
      if (request.query.ong_id) ong_id = (request.query as any).ong_id;
      if (request.query.animal_id) animal_id = (request.query as any).animal_id;
      if (request.query.ong_name) ong_name = (request.query as any).ong_name;
      if (request.query.animal_name)
        animal_name = (request.query as any).animal_name;
      if (request.query.title) title = (request.query as any).title;
      if (request.query.activated) activated = (request.query as any).activated;
    }

    const showCampaigns = new ShowOngCampaignsService();

    const campaigns = await showCampaigns.execute({
      id,
      ong_id,
      animal_id,
      ong_name,
      animal_name,
      title,
      activated,
    });

    return response.json(classToClass(campaigns));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default campaignsRouter;
