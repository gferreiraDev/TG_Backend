const service = require('./customer.service');
const mongoose = require('../db');

const mocks = {
  customer: {
    profile: 'Consumidor',
    name: 'User Test',
    email: 'usertest@mail.com',
    phone: '(11) 99999-8888',
    cpf: '010.020.030-40',
    addressList: {
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
  nullCustomer: {
    profile: null,
    name: null,
    email: null,
    phone: null,
    cpf: null,
    addressList: {
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
  },
  undefinedCustomer: {
    profile: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    cpf: undefined,
    addressList: {
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
    rating: 4.2
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

describe('Testes Unitários - CustomerService', () => {
  beforeEach((done) => {
    mongoose.connection.dropCollection('customers', () => done());
  });

  it('should successfuly register a new customer', async () => {
    const result = await service.create(mocks.customer);

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
  });

  it('should prevent registering duplicated customer', async () => {
    jest.setTimeout(15000);
    await service.create(mocks.customer);
    
    const result = await service.create(mocks.customer);

    expect(result).rejects;
  });
  
  it('should prevent registering undefined customer', async () => {
    const result = await service.create(mocks.undefinedCustomer);

    expect(result).rejects;
  });
  
  it('should prevent registering null customer', async () => {
    const result = await service.create(mocks.nullCustomer);

    expect(result).rejects;
  });

  it('should prevent registering seller as customer', async () => {
    const result = await service.create(mocks.seller);

    expect(result).rejects;
  });

  it('should prevent searching customer if null data', async () => {
    const result = await service.exists(null ,null);

    expect(result).rejects;
  });

  it('should prevent searching customer with undefined data', async () => {
    const result = await service.exists(undefined, undefined);

    expect(result).rejects;
  });
  
  it('should prevent searching customer with no provided data', async () => {
    const result = await service.exists();

    expect(result).rejects;
  });

  it('should prevent searching customer with no provided data', async () => {
    const result = await service.exists();

    expect(result).rejects;
  });

  it('should find a customer by id', async() => {
    const registered = await service.create(mocks.customer);

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

  it('should successfuly find a customer by email', async () => {
    const registered = await service.create(mocks.customer);

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
  
  it('should prevent return any data provides an empty e-mail', async () => {
    const result = await service.findByEmail('');

    expect(result).rejects;
  });

  it('should successfuly update a customer', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.update(registered._id, { name: 'Updated User Name' });

    expect(result).resolves;
    expect(result.name).toBe('Updated User Name');
    expect(result._id).toEqual(registered._id);
  });
  
  it('should prevent updating an invalid customer', async () => {
    const result = await service.update('invalidId', {name: 'Updated User Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating a null customer', async () => {
    const result = await service.update(null, {name: 'Updated User Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating an undefined customer', async () => {
    const result = await service.update(undefined, {name: 'Updated User Name'});

    expect(result).rejects;
  });
  
  it('should prevent updating a customer with invalid data', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.update(registered._id, mocks.nullCustomer);

    expect(result).rejects;
  });
  
  it('should successfully delete a customer', async () => {
    const registered = await service.create(mocks.customer);

    await service.delete(registered._id);

    const check = await service.findById(registered._id);

    expect(check).rejects;
  });
  
  it('should prevent deleting a null customer', async () => {
    const result = await service.delete(null);

    expect(result).rejects;
  });
  
  it('should prevent deleting an undefined customer', async () => {
    const result = await service.delete(undefined);

    expect(result).rejects;
  });
  
  it('should prevent deleting a customer twice', async () => {
    const registered = await service.create(mocks.customer);

    await service.delete(registered._id);
    const result = await service.delete(registered._id);

    expect(result).rejects;
  });

  it('should successfuly add an address', async () => {
    const registered = await service.create(mocks.customer);

    const newAddress = {
      title: 'Faculdade',
      streetName: 'Rua Frei João',
      number: '59',
      complement: 'predio II - sala 6',
      district: 'Vila Nair',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '04280-130'
    };

    const result = await service.addAddress(registered._id, newAddress);

    expect(result).resolves;
    expect(result.addressList.length).toBe(2);
  });
  
  it('should prevent adding an empty address', async () => {
    const registered = await service.create(mocks.customer);

    const newAddress = {};

    const result = await service.addAddress(registered._id, newAddress);

    expect(result).rejects;
  });
  
  it('should prevent adding an undefined address', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.addAddress(registered._id, undefined);

    expect(result).rejects;
  });
  
  it('should prevent adding a null address', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.addAddress(registered._id, null);

    expect(result).rejects;
  });

  it('should be able to update an existing address', async () => {
    const registered = await service.create(mocks.customer);

    const update = {
      _id: registered.addressList[0]._id,
      title: 'Casa',
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
    expect(result.addressList[0].streetName).toBe('Updated Street Name');
  });
  
  it('should prevent updating an unexisting address', async () => {
    const registered = await service.create(mocks.customer);

    const updatedAddress = { ...registered.addressList[0], _id: 'invalidID' };

    const result = await service.updateAddress(registered._id, updatedAddress);

    expect(result).rejects;
  });
  
  it('should prevent updating an address with null data', async () => {
    const registered = await service.create(mocks.customer);

    const updatedAddress = { 
      _id: registered.addressList[0]._id,
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
    const registered = await service.create(mocks.customer);

    const updatedAddress = { 
      _id: registered.addressList[0]._id,
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
  
  it('should successfuly delete an existing address', async () => {
    const registered = await service.create(mocks.customer);
    
    const newAddress = {
      title: 'Faculdade',
      streetName: 'Rua Frei João',
      number: '59',
      complement: 'predio II - sala 6',
      district: 'Vila Nair',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '04280-130'
    };

    await service.addAddress(registered._id, newAddress);

    const result = await service.deleteAddress(registered._id, registered.addressList[0]._id);

    expect(result).resolves;
    expect(result.addressList.length).toBe(1);
    expect(result.addressList[0].title).toEqual('Faculdade');
  });
  
  it('should prevent deleting an unexisting address', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.deleteAddress(registered._id, 'invalidId');

    expect(result).rejects;
  });
  
  it('should prevent deleting a null address', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.deleteAddress(registered._id, null);

    expect(result).rejects;
  });
  
  it('should prevent deleting an undefined address', async () => {
    const registered = await service.create(mocks.customer);

    const result = await service.deleteAddress(registered._id, undefined);

    expect(result).rejects;
  });
});