import { Router } from 'express';

import multer from 'multer';
import { classToClass } from 'class-transformer';
import uploadConfig from '../config/upload';

import CreateLostAnimalService from '../services/CreateLostAnimalService';
import UpdateLostAnimalAvatarService from '../services/UpdateLostAnimalAvatarService';
import UpdateLostAnimalService from '../services/UpdateLostAnimalService';
import ShowLostAnimalsService from '../services/ShowLostAnimalsService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(uploadConfig);

const lostAnimalsRouter = Router();

lostAnimalsRouter.use(ensureAuthenticated);

// CADASTRA UM ANIMAL PERDIDO
lostAnimalsRouter.post('/', async (request, response) => {
  try {
    const owner_id = request.user.id;

    const {
      name,
      age,
      gender,
      size,
      species,
      breed,
      description,
    } = request.body;

    const createAddress = new CreateLostAnimalService();

    const animal = await createAddress.execute({
      owner_id,
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

// SALVA FOTO DO ANIMAL PERDIDO
lostAnimalsRouter.patch(
  '/avatar/:animal_id',
  upload.single('avatar'),
  async (request, response) => {
    try {
      const { animal_id } = request.params;
      const owner_id = request.user.id;

      const updateLostAnimalAvatar = new UpdateLostAnimalAvatarService();

      const animal = await updateLostAnimalAvatar.execute({
        animal_id,
        owner_id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(animal));
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

// UPDATE LOST ANIMAL
lostAnimalsRouter.put('/:animal_id', async (request, response) => {
  try {
    const { animal_id } = request.params;
    const owner_id = request.user.id;

    const {
      name,
      age,
      gender,
      size,
      species,
      breed,
      found,
      description,
    } = request.body;

    const updateLostAnimal = new UpdateLostAnimalService();

    const animal = await updateLostAnimal.execute({
      animal_id,
      owner_id,
      name,
      age,
      gender,
      size,
      species,
      breed,
      found,
      description,
    });

    return response.json(classToClass(animal));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// LISTA LOST ANIMALS (FILTROS)
lostAnimalsRouter.get('/', async (request, response) => {
  try {
    // const user_id = request.user.id; // id do user logado

    let id = '';
    let owner_id = '';
    let owner_name = '';
    let animal_name = '';
    let age = '';
    let gender = '';
    let size = '';
    let species = '';
    let breed = '';
    let found = null;

    if (request.query) {
      if (request.query.id) id = (request.query as any).id;
      if (request.query.owner_id) owner_id = (request.query as any).owner_id;
      if (request.query.owner_name)
        owner_name = (request.query as any).owner_name;
      if (request.query.animal_name)
        animal_name = (request.query as any).animal_name;
      if (request.query.age) age = (request.query as any).age;
      if (request.query.gender) gender = (request.query as any).gender;
      if (request.query.size) size = (request.query as any).size;
      if (request.query.species) species = (request.query as any).species;
      if (request.query.breed) breed = (request.query as any).breed;
      if (request.query.found) found = (request.query as any).found;
    }

    const showAnimals = new ShowLostAnimalsService();

    const animals = await showAnimals.execute({
      id,
      owner_id,
      owner_name,
      animal_name,
      age,
      gender,
      size,
      species,
      breed,
      found,
    });

    return response.json(classToClass(animals));
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default lostAnimalsRouter;
