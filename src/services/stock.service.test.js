const stockService = require('./stock.service');
const sellerService = require('./seller.service');
const mongoose = require('../db');

const mocks = {
  seller: {
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
  }
}

describe('Testes Unitários - StockService', () => {
  beforeEach((done) => {
    mongoose.connection.dropCollection('stocks', () => {
      mongoose.connection.dropCollection('sellers', () => done());
    });
  });

  it('should successfuly register a seller stock', async () => {
    const seller = await sellerService.create(mocks.seller);

    const result = await stockService.createStock(seller._id);

    expect(result).resolves;
    expect(result).toHaveProperty('_id');
    expect(result.sellerId).toEqual(seller._id);
  });

  it('should prevent registering duplicated stocks', async () => {
    const seller = await sellerService.create(mocks.seller);

    await stockService.createStock(seller._id);
    const result = await stockService.createStock(seller._id);

    expect(result).rejects;
  });
  
  it('should prevent creating stock for undefined seller', async () => {
    const result = await stockService.createStock(undefined);

    expect(result).rejects;
  });
  
  it('should prevent creating stock for null seller', async () => {
    const result = await stockService.createStock(null);

    expect(result).rejects;
  });

  it('should prevent creating stock for customer', async () => {
    const customer = await sellerService.create(mocks.customer);

    const result = await stockService.createStock(customer._id);

    expect(result).rejects;
  });

  it('should prevent creating stock with null data', async () => {
    const result = await stockService.exists(null ,null);

    expect(result).rejects;
  });

  it('should prevent creating stock with undefined data', async () => {
    const result = await stockService.exists(undefined, undefined);

    expect(result).rejects;
  });
  
  it('should prevent creating stock with no provided data', async () => {
    const result = await stockService.exists();

    expect(result).rejects;
  });

  it('should successfuly add an item to stock', async() => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.addProduct(stock._id, mocks.product1);

    expect(result).resolves;
    expect(result.products.length).toBe(1);
    expect(result.products[0].barcode).toEqual(mocks.product1.barcode);
  });

  it ('should prevent adding duplicated items to stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    await stockService.addProduct(stock._id, mocks.product1);
    const result = await stockService.addProduct(stock._id, mocks.product1);

    expect(result).rejects;
  });
  
  it ('should prevent adding null products to stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.addProduct(stock._id, null);

    expect(result).rejects;
  });
  
  it ('should prevent adding undefined products to stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.addProduct(stock._id, undefined);

    expect(result).rejects;
  });

  it('should prevent adding products with no provided data to stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.addProduct(stock._id, {});

    expect(result).rejects;
  });

  it('should prevent adding products to stock with invalid id', async () => {
    const result = await stockService.addProduct('invalidId', mocks.product1);

    expect(result).rejects;
  });
  
  it('should successfuly update item in stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    const item = await stockService.addProduct(stock._id, mocks.product1);

    const result = await stockService.update(stock._id, { ...item.products[0], currentStock: mocks.product1.currentStock - 4 });

    expect(result).resolves;
  });
  
  it('should prevent updating invalid item in stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.update(stock._id, { _id: 'invalidId', currentStock: -2 });

    expect(result).rejects;
  });

  it('should prevent updating a null item in stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.update(stock._id, null);

    expect(result).rejects;
  });

  it('should prevent updating an undefined item in stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.update(stock._id, undefined);

    expect(result).rejects;
  });

  it('should prevent updating a no provided stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    const item = await stockService.addProduct(stock._id, mocks.product1);

    const result = await stockService.update('', { ...item, currentStock: mocks.product1.currentStock - 4 });

    expect(result).rejects;
  });

  it('should list all products in a stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.listProducts(stock._id);

    expect(result).resolves;
    expect(result.products.length).toBe(2);
  });

  it('should find a valid stock item by id', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    const product = await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.findProduct(stock._id, product.products[0]._id);

    expect(result).resolves;
  });
  
  it('should not find any item when searching an invalid id', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.findProduct(stock._id, 'invalidId');

    expect(result).rejects;
  });
  
  it('should not find any item when searching a null id', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.findProduct(stock._id, null);

    expect(result).rejects;
  });
  
  it('should not find any item when searching an undefined id', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.findProduct(stock._id, undefined);

    expect(result).rejects;
  });
  
  it('should successfuly list all products by category', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.listByCategory(stock._id, 'Farináceos');

    expect(result).resolves;
    expect(result.length).toBe(1);
  });

  it('should return empty array if category is not found', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.listByCategory(stock._id, 'invalidCategory');

    expect(result).resolves;
    expect(result.length).toBe(0);
  });
  
  it('should list all products with no provided category', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.listByCategory(stock._id, null);

    expect(result).resolves;
    expect(result.products.length).toBe(2);
  });

  it('should successfuly remove an item from stock', async() => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    const product = await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.removeItem(stock._id, product.products[1]._id);

    expect(result).resolves;
    expect(result.products.length).toBe(1);
  });

  it ('should prevent removing item from stock twice', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    const product = await stockService.addProduct(stock._id, mocks.product1);

    await stockService.removeItem(stock._id, product.products[0]._id);
    const result = await stockService.removeItem(stock._id, product.products[0]._id);

    expect(result).rejects;
  });
  
  it ('should prevent removing null products from stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.removeItem(stock._id, null);

    expect(result).rejects;
  });
  
  it ('should prevent removing undefined products from stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.removeItem(stock._id, undefined);

    expect(result).rejects;
  });

  it('should prevent removing products from no provided stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    const product = await stockService.addProduct(stock._id, mocks.product1);

    const result = await stockService.removeItem('', product.products[0]._id);

    expect(result).rejects;
  });

  it('should prevent removing invalid products from stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    const result = await stockService.removeItem(stock._id, 'invalidId');

    expect(result).rejects;
  });

  it('should be able to delete a seller stock', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);
    await stockService.addProduct(stock._id, mocks.product1);
    await stockService.addProduct(stock._id, mocks.product2);

    const result = await stockService.deleteStock(stock._id);

    expect(result).resolves;
  });

  it('should prevent deleting a seller stock twice', async () => {
    const seller = await sellerService.create(mocks.seller);
    const stock = await stockService.createStock(seller._id);

    await stockService.deleteStock(stock._id);
    const result = await stockService.deleteStock(stock._id);

    expect(result).rejects;
  });

  it('should prevent deleting null stock', async () => {
    const result = await stockService.deleteStock(null);

    expect(result).rejects;
  });

  it('should prevent deleting undefined stock', async () => {
    const result = await stockService.deleteStock(undefined);

    expect(result).rejects;
  });

  it('should prevent deleting no provided stock', async () => {
    const result = await stockService.deleteStock();

    expect(result).rejects;
  });

  it('should prevent deleting invalid stock', async () => {
    const result = await stockService.deleteStock('invalidID');

    expect(result).rejects;
  });
});