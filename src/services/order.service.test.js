const customerService = require('./customer.service');
const sellerService = require('./seller.service');
const stockService = require('./stock.service');
const orderService = require('./order.service');

const mongoose = require('../db');

const mocks = {
  customer: {
    profile: 'Consumidor',
    name: 'Ana Maria Silva',
    email: 'ana.maria@gmail.com',
    phone: '(11) 98798-8989',
    cpf: '100.200.300-40',
    addressList: {
      title: 'Casa',
      streetName: 'Rua Teste',
      number: '123A',
      complement: '-',
      district: 'Algum Bairro',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '00000-111',
      position: {
        lat: -48.998650,
        lng: -122.58012
      }
    },
    password: 'senha123',
  },
  seller: {
    profile: 'Vendedor',
    corporateName: 'Razão Social Teste',
    tradingName: 'Mercadinho da Villa',
    email: 'davilla@mercadinho.com',
    phone: '(11) 99999-8888',
    cnpj: '00.001.220/4343-01',
    address: {
      title: 'Matriz',
      streetName: 'Avenida Teste',
      number: '1489',
      complement: 'Piso 2 - Lj. 214',
      district: 'Algum Lugar',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '00000-111',
      position: {
        lat: -48.762864,
        lng: -120.378270
      }
    },
    password: '123senha4',
    rating: 4.2
  },
  product1: {
    category: 'Farináceos',
    productName: 'Farinha de Trigo 1kg Dona Benta',
    description: 'Farinha de trigo enriquecida com ferro e ácido fólico. CONTÉM GLÚTEN',
    trade: 'Dona Benta',
    barcode: '7897897897890',
    measureUnit: '1kg',
    packageDescription: 'pct',
    image: '',
    perishable: false,
    minStock: 280,
    currentStock: 344,
    price: 4.19,
    promotion: {
      active: false,
      price: 0.0
    }
  },
  product2: {
    category: 'Óleos',
    productName: 'Óleo de Soja 900ml Soya',
    description: 'Óleo de soja semiprocessado',
    trade: 'Soya',
    barcode: '7897897899001',
    measureUnit: '900ml',
    packageDescription: 'und',
    image: '',
    perishable: false,
    minStock: 300,
    currentStock: 418,
    price: 9.78,
    promotion: {
      active: true,
      price: 9.49
    }
  },
  order1: {
    orderNumber: '202208109999',
    orderType: 'Entrega',
    origin: {},
    destination: {},
    items: [{
      productId: '',
      currentPrice: 0.00,
      quantity: 1
    }],
    status: 'Enviado ao Estabelecimento'
  },
  order2: {
    customer: '',
    seller: '',
    orderNumber: '202208109999',
    orderType: 'Retirada',
    items: [{
      productId: '',
      currentPrice: 0.00,
      quantity: 1
    }],
    status: 'Em Processamento'
  }
}

describe('Testes de Integração OrderService', () => {
  beforeEach((done) => {
    mongoose.connection.dropCollection('orders', () => done());
  });

  it('should be able to place an order', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    const list = await stockService.addProduct(stock._id, mocks.product2);

    const result = await orderService.create({
      customer: customer._id,
      seller: seller._id,
      orderNumber: '202208109999',
      orderType: 'Entrega',
      origin: seller.address.position,
      destination: customer.addressList[0].position,
      items: {
        productId: list.products[0]._id,
        currentPrice: list.products[0].price,
        quantity: 3
      },
      volume: {
        packs: 1,
        weight: 3
      },
      status: 'Enviado ao Estabelecimento'
    });

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
  });

  it('should prevent registering a null order', async () => {
    const result = await orderService.create(null);
    
    expect(result).rejects;
  });

  it('should prevent registering a undefined order', async () => {
    const result = await orderService.create(undefined);
    
    expect(result).rejects;
  });

  it('should prevent registering an order with no provided data', async () => {
    const result = await orderService.create();
    
    expect(result).rejects;
  });

  it('should prevent registering an order with no items', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await orderService.create({
      customer: customer._id,
      seller: seller._id,
      orderNumber: '202208109999',
      orderType: 'Entrega',
      origin: seller.address.position,
      destination: customer.addressList[0].position,
      items: {},
      volume: {
        packs: 1,
        weight: 3
      },
      status: 'Enviado ao Estabelecimento'
    });

    expect(result).rejects;
  });

  it('should prevent registering an order with invalid data', async () => {
    const result = await orderService.create({
      customer: 'invalidID',
      seller: 'invalidId',
      orderNumber: undefined,
      orderType: '',
      origin: {},
      destination: {},
      items: {},
      volume: {},
      status: ''
    });

    expect(result).rejects;
  });

  it('should be able to list all orders from a seller', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    const list = await stockService.addProduct(stock._id, mocks.product2);

    await orderService.create({
      customer: customer._id,
      seller: seller._id,
      orderNumber: '202208109999',
      orderType: 'Entrega',
      origin: seller.address.position,
      destination: customer.addressList[0].position,
      items: {
        productId: list.products[0]._id,
        currentPrice: list.products[0].price,
        quantity: 3
      },
      volume: {
        packs: 1,
        weight: 3
      },
      status: 'Enviado ao Estabelecimento'
    });

    const result = orderService.findByUser(seller._id);
    expect(result).resolves;
    expect(result.length).toBe(1);
  });
  
  it('should be able to update an order status', async () => {
    const customer = await customerService.create(mocks.customer);
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    const list = await stockService.addProduct(stock._id, mocks.product2);

    const order = await orderService.create({
      customer: customer._id,
      seller: seller._id,
      orderNumber: '202208109999',
      orderType: 'Entrega',
      origin: seller.address.position,
      destination: customer.addressList[0].position,
      items: {
        productId: list.products[0]._id,
        currentPrice: list.products[0].price,
        quantity: 3
      },
      volume: {
        packs: 1,
        weight: 3
      },
      status: 'Enviado ao Estabelecimento'
    });

    const result = orderService.update(order._id, {status: 'Em Processamento'});
    expect(result).resolves;
    expect(result.status).toEqual('Em Processamento');
  });
  
  it('should prevent updating status to an invalid order', async () => {
    const result = orderService.update('invalidID', {status: 'Em Processamento'});
    expect(result).rejects;
  });

  it('should prevent updating status to a null order', async () => {
    const result = orderService.update(null, {status: 'Em Processamento'});
    expect(result).rejects;
  });
  
  it('should prevent updating status to an undefined order', async () => {
    const result = orderService.update(undefined, {status: 'Em Processamento'});
    expect(result).rejects;
  });
});