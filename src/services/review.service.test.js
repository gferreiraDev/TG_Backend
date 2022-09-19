const reviewService = require('./review.service');
const customerService = require('./customer.service');
const sellerService = require('./seller.service');
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
  review1: {
    rate: 4.0,
    comment: 'First Comment testing. The service was awesome.',
  },
  review2: {
    rate: 3.0,
    comment: 'Second Comment. It better works as it should.',
  }
}

describe('Testes Unitários ReviewService', () => {
  beforeEach((done) => {
    mongoose.connection.dropCollection('reviews', () => done());
  });

  it('should be able to create a new review', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);

    const result = await reviewService.create({
      rater: customer._id,
      rated: seller._id,
      ...mocks.review1
    });

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
  });

  it('should prevent creating a review with no provided data', async () => {
    const result = await reviewService.create();

    expect(result).rejects;
  });
  
  it('should prevent creating a review with null data', async () => {
    const result = await reviewService.create({
      rater: null,
      rated: null,
      rate: null,
      comment: null
    });

    expect(result).rejects;
  });
  
  it('should prevent creating a review with undefined data', async () => {
    const result = await reviewService.create({
      rater: undefined,
      rated: undefined,
      rate: undefined,
      comment: undefined
    });

    expect(result).rejects;
  });
  
  it('should prevent creating a review with invalid references', async () => {
    const result = await reviewService.create({
      rater: 'invalidID1',
      rated: 'invalidID2',
      rate: 5.0,
      comment: 'some comment here'
    });

    expect(result).rejects;
  });
  
  it('should be able to list all seller reviews', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);

    await reviewService.create({rater: customer._id, rated: seller._id, ...mocks.review1});

    const result = await reviewService.listReviews(seller._id);

    expect(result).resolves;
    expect(result.length).toBe(1);
  });
  
  it('should prevent listing reviews provided a null reference', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    await reviewService.create({rater: customer._id, rated: seller._id, ...mocks.review2});

    const result = await reviewService.listReviews(null);

    expect(result).rejects;
  });
  
  it('should prevent listing reviews provided an undefined reference', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    await reviewService.create({rater: customer._id, rated: seller._id, ...mocks.review1});

    const result = await reviewService.listReviews(undefined);

    expect(result).rejects;
  });
  
  it('should prevent listing reviews provided an invalid reference', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    await reviewService.create({rater: customer._id, rated: seller._id, ...mocks.review1});

    const result = await reviewService.listReviews('invalidID');

    expect(result).rejects;
  });

  it('should be able to update a review', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);

    const review = await reviewService.create({...mocks.review1, rater: customer._id, rated: seller._id});

    const result = await reviewService.updateReview(review._id, {
      rate: 3.0,
      comment: mocks.review2.comment
    });

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
    expect(result.comment).toEqual(mocks.review2.comment);
  });

  it('should prevent updating a review with null data', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);

    const review = await reviewService.create({...mocks.review1, rater: customer._id, rated: seller._id});

    const result = await reviewService.updateReview(review._id, {rate: null, comment: null});

    expect(result).rejects;
  });

  it('should prevent updating a review with invalid id', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);

    await reviewService.create({...mocks.review2, rater: customer._id, rated: seller._id});

    const result = await reviewService.updateReview('invalidId', {rate: 3.1, comment: '...'});

    expect(result).rejects;
  });

  it('should prevent updating a review with no provided data', async () => {
    const result = await reviewService.updateReview();

    expect(result).rejects;
  });
});