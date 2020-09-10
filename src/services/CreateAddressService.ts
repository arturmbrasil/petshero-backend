import { getRepository } from 'typeorm';

import Address from '../models/Address';
import User from '../models/User';

interface Request {
  user_id: string;
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  uf: string;
  cep: string;
}

class CreateAddressService {
  public async execute({
    user_id,
    street,
    number,
    neighborhood,
    city,
    uf,
    cep,
  }: Request): Promise<Address> {
    const addressesRepository = getRepository(Address);
    const usersRepository = getRepository(User);

    const checkUserAddress = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!checkUserAddress) {
      throw new Error('User not found.');
    }

    // se user ainda nao tem endereco
    if (!checkUserAddress.address_id) {
      const address = addressesRepository.create({
        street,
        number,
        neighborhood,
        city,
        uf,
        cep,
      });

      await addressesRepository.save(address);

      checkUserAddress.address_id = address.id;

      delete checkUserAddress.address;

      await usersRepository.save(checkUserAddress);

      return address;
    }

    // se ja tem endereco da um update
    const userAddress = await addressesRepository.findOne(
      checkUserAddress?.address_id,
    );

    if (!userAddress) {
      throw new Error('User address do not exist.');
    }

    userAddress.street = street;
    userAddress.number = number;
    userAddress.neighborhood = neighborhood;
    userAddress.city = city;
    userAddress.uf = uf;
    userAddress.cep = cep;

    await addressesRepository.save(userAddress);

    checkUserAddress.address_id = userAddress.id;

    await usersRepository.save(checkUserAddress);

    return userAddress;
  }
}

export default CreateAddressService;
