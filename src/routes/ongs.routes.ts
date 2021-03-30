import { Router } from 'express';

import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/upload';

import ShowOngsService from '../services/ShowOngsService';
import CreateOngAnimalService from '../services/CreateOngAnimalService';
import UpdateOngAnimalAvatarService from '../services/UpdateOngAnimalAvatarService';
import UpdateOngAnimalService from '../services/UpdateOngAnimalService';
import ShowOngAnimalsService from '../services/ShowOngAnimalsService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);

const ongsRouter = Router();

ongsRouter.use(ensureAuthenticated);

// LISTA ONGS (FILTRO CIDADE OU UF)
ongsRouter.get('/', async (request, response) => {
  try {
    // const user_id = request.user.id;
    let city = '';
    let uf = '';
    let name = '';
    if (request.query) {
      if (request.query.city) city = (request.query as any).city;
      if (request.query.uf) uf = (request.query as any).uf;
      if (request.query.name) name = (request.query as any).name;
    }

    const showOngs = new ShowOngsService();

    const ongs = await showOngs.execute({ city, uf, name });
    // const ongs = await showOngs.execute({ user_id, city, uf, name });

    return response.json(classToClass(ongs));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// CRIA UM ANIMAL
ongsRouter.post('/animals', async (request, response) => {
  try {
    const ong_id = request.user.id;

    const {
      name,
      age,
      gender,
      size,
      species,
      breed,
      description,
    } = request.body;

    const createAddress = new CreateOngAnimalService();

    const animal = await createAddress.execute({
      ong_id,
      name,
      age,
      gender,
      size,
      species,
      breed,
      description,
    });

    return response.json(classToClass(animal));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// SALVA FOTO ANIMAL
ongsRouter.patch(
  '/animals/avatar/:animal_id',
  upload.single('avatar'),
  async (request, response) => {
    try {
      const { animal_id } = request.params;
      const ong_id = request.user.id;

      const updateOngAnimalAvatar = new UpdateOngAnimalAvatarService();

      const animal = await updateOngAnimalAvatar.execute({
        animal_id,
        ong_id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(animal));
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

// UPDATE ANIMAL
ongsRouter.put('/animals/:animal_id', async (request, response) => {
  try {
    const { animal_id } = request.params;
    const ong_id = request.user.id;

    const {
      name,
      age,
      gender,
      size,
      species,
      breed,
      adopted,
      description,
    } = request.body;

    const updateOngAnimal = new UpdateOngAnimalService();

    const animal = await updateOngAnimal.execute({
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
    });

    return response.json(classToClass(animal));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// LISTA ANIMAIS DA ONG (FILTROS)
ongsRouter.get('/animals', async (request, response) => {
  try {
    // const user_id = request.user.id; // id do user logado

    let id = '';
    let ong_id = '';
    let ong_name = '';
    let animal_name = '';
    let age = '';
    let gender = '';
    let size = '';
    let species = '';
    let breed = '';
    let adopted = null;

    if (request.query) {
      if (request.query.id) id = (request.query as any).id;
      if (request.query.ong_id) ong_id = (request.query as any).ong_id;
      if (request.query.ong_name) ong_name = (request.query as any).ong_name;
      if (request.query.animal_name)
        animal_name = (request.query as any).animal_name;
      if (request.query.age) age = (request.query as any).age;
      if (request.query.gender) gender = (request.query as any).gender;
      if (request.query.size) size = (request.query as any).size;
      if (request.query.species) species = (request.query as any).species;
      if (request.query.breed) breed = (request.query as any).breed;
      if (request.query.adopted) adopted = (request.query as any).adopted;
    }

    const showAnimals = new ShowOngAnimalsService();

    const animals = await showAnimals.execute({
      id,
      ong_id,
      ong_name,
      animal_name,
      age,
      gender,
      size,
      species,
      breed,
      adopted,
    });

    return response.json(classToClass(animals));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default ongsRouter;
