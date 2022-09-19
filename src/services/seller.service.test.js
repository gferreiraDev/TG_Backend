const service = require('./seller.service');
const mongoose = require('../db');

const mocks = {
  customer: {
    profile: 'Consumidor',
    name: 'User Test',
    email: 'usertest@mail.com',
    phone: '(11) 99999-8888',
    cpf: '010.020.030-40',
    address: {
      title: 'Casa',
      streetName: 'Rua Teste',
      number: '123A',
      complement: '-',
      district: 'Algum Bairro',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '00000-111',
    },
    password: '123senha4',
  },
  seller: {
    profile: 'Vendedor',
    corporateName: 'Razão Social Teste',
    tradingName: 'Mercadinho da Vila',
    email: 'davila@mercadinho.com',
    phone: '(11) 99999-8888',
    cnpj: '00.111.222/3333-44',
    address: {
      title: 'Matriz',
      streetName: 'Avenida Teste',
      number: '1489',
      complement: 'Piso 2 - Lj. 214',
      district: 'Algum Lugar',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '00000-111',
    },
    password: '123senha4',
    rating: 5.2
  },
  seller1: {
    profile: 'Vendedor',
    corporateName: 'Razão Social Teste1',
    tradingName: 'Segundo Estabelecimento',
    email: 'estabelecimento@mail.com',
    phone: '(11) 1234-4321',
    cnpj: '22.345.678/9999-00',
    address: {
      title: 'Matriz',
      streetName: 'Nome da Rua',
      number: '100',
      complement: '-',
      district: 'Algum Lugar',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01001-230',
    },
    password: 'senha1234',
    rating: 3.1
  },
  nullSeller: {
    profile: null,
    corporateName: null,
    tradingName: null,
    email: null,
    phone: null,
    cnpj: null,
    address: {
      title: null,
      streetName: null,
      number: null,
      complement: null,
      district: null,
      city: null,
      state: null,
      zipcode: null,
    },
    password: null,
    rating: null
  },
  undefinedSeller: {
    profile: undefined,
    corporateName: undefined,
    tradingName: undefined,
    email: undefined,
    phone: undefined,
    cnpj: undefined,
    address: {
      title: undefined,
      streetName: undefined,
      number: undefined,
      complement: undefined,
      district: undefined,
      city: undefined,
      state: undefined,
      zipcode: undefined,
    },
    password: undefined,
    rating: undefined
  },
}

describe('Testes Unitários - SellerService', () => {
  beforeEach((done) => {
    mongoose.connection.dropCollection('sellers', () => done());
  });

  it('should successfuly register a new seller', async () => {
    const result = await service.create(mocks.seller);

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
  });

  it('should prevent registering duplicated seller', async () => {
    jest.setTimeout(15000);
    await service.create(mocks.seller);
    
    const result = await service.create(mocks.seller);

    expect(result).rejects;
  });
  
  it('should prevent registering undefined seller', async () => {
    const result = await service.create(mocks.undefinedSeller);

    expect(result).rejects;
  });
  
  it('should prevent registering null seller', async () => {
    const result = await service.create(mocks.nullSeller);

    expect(result).rejects;
  });

  it('should prevent registering customer as seller', async () => {
    const result = await service.create(mocks.customer);

    expect(result).rejects;
  });

  it('should prevent searching seller if null data', async () => {
    const result = await service.exists(null ,null);

    expect(result).rejects;
  });

  it('should prevent searching seller with undefined data', async () => {
    const result = await service.exists(undefined, undefined);

    expect(result).rejects;
  });
  
  it('should prevent searching seller with no provided data', async () => {
    const result = await service.exists();

    expect(result).rejects;
  });

  it('should prevent searching seller with no provided data', async () => {
    const result = await service.exists();

    expect(result).rejects;
  });

  it('should find a seller by id', async() => {
    const registered = await service.create(mocks.seller);

    const result = await service.findById(registered._id);

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
    expect(result._id).toEqual(registered._id);
  });

  it ('should prevent returning any data provided an invalid id', async () => {
    const result = await service.findById('invalidID');

    expect(result).rejects;
  });
  
  it ('should prevent returning any data provided an undefined id', async () => {
    const result = await service.findById(undefined);

    expect(result).rejects;
  });
  
  it ('should prevent returning any data provided an null id', async () => {
    const result = await service.findById(null);

    expect(result).rejects;
  });

  it('should successfuly find a seller by email', async () => {
    const registered = await service.create(mocks.seller);

    const result = await service.findByEmail(registered.email);

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
    expect(result._id).toEqual(registered._id);
  });

  it('should prevent returning any data provided an invalid e-mail', async () => {
    const result = await service.findByEmail('invalid@mail.com');

    expect(result).toBeFalsy();
  });
  
  it('should prevent returning any data provided an null e-mail', async () => {
    const result = await service.findByEmail(null);

    expect(result).rejects;
  });
  
  it('should prevent returning any data provided an undefined e-mail', async () => {
    const result = await service.findByEmail(undefined);

    expect(result).rejects;
  });
  
  it('should prevent return any data provided an empty e-mail', async () => {
    const result = await service.findByEmail('');

    expect(result).rejects;
  });

  it('should successfuly update a seller', async () => {
    const registered = await service.create(mocks.seller);

    const result = await service.update(registered._id, { tradingName: 'Updated Trading Name' });

    expect(result).resolves;
    expect(result.tradingName).toBe('Updated Trading Name');
    expect(result._id).toEqual(registered._id);
  });
  
  it('should prevent updating an invalid seller', async () => {
    const result = await service.update('invalidId', {name: 'Updated Seller Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating a null seller', async () => {
    const result = await service.update(null, {name: 'Updated Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating an undefined seller', async () => {
    const result = await service.update(undefined, {name: 'Updated Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating a seller with invalid data', async () => {
    const registered = await service.create(mocks.seller);

    const result = await service.update(registered._id, mocks.nullSeller);

    expect(result).rejects;
  });
  
  it('should successfully delete a seller', async () => {
    const registered = await service.create(mocks.seller);

    await service.delete(registered._id);

    const check = await service.findById(registered._id);

    expect(check).rejects;
  });
  
  it('should prevent deleting a null seller', async () => {
    const result = await service.delete(null);

    expect(result).rejects;
  });
  
  it('should prevent deleting an undefined seller', async () => {
    const result = await service.delete(undefined);

    expect(result).rejects;
  });
  
  it('should prevent deleting a seller twice', async () => {
    const registered = await service.create(mocks.seller);

    await service.delete(registered._id);
    const result = await service.delete(registered._id);

    expect(result).rejects;
  });

  it('should be able to update an existing address', async () => {
    const registered = await service.create(mocks.seller);

    const update = {
      title: 'Loja Principal',
      streetName: 'Updated Street Name',
      number: '123A',
      complement: '-',
      district: 'District Name',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '11111-111'
    };

    const result = await service.updateAddress(registered._id, update);

    expect(result).resolves;
    expect(result.address.streetName).toBe('Updated Street Name');
  });
  
  it('should prevent updating an unexisting address', async () => {
    const registered = await service.create(mocks.seller);

    const updatedAddress = { ...registered.address, _id: 'invalidID' };

    const result = await service.updateAddress(registered._id, updatedAddress);

    expect(result).rejects;
  });
  
  it('should prevent updating an address with null data', async () => {
    const registered = await service.create(mocks.seller);

    const updatedAddress = { 
      _id: registered.address._id,
      title: null,
      streetName: null,
      number: null,
      complement: null,
      district: null,
      city: null,
      state: null,
      zipcode: null
    };

    const result = await service.updateAddress(registered._id, updatedAddress);

    expect(result).rejects;
  });
  
  it('should prevent updating an address with undefined data', async () => {
    const registered = await service.create(mocks.seller);

    const updatedAddress = { 
      _id: registered.address._id,
      title: undefined,
      streetName: undefined,
      number: undefined,
      complement: undefined,
      district: undefined,
      city: undefined,
      state: undefined,
      zipcode: undefined
    };

    const result = await service.updateAddress(registered._id, updatedAddress);

    expect(result).rejects;
  });

  it('should successfuly list sellers', async () => {
    await service.create(mocks.seller);

    const result = await service.findAll();

    expect(result).resolves;
    expect(result.length).toBe(1);
    expect(result[0].tradingName).toEqual(mocks.seller.tradingName);
  });
});