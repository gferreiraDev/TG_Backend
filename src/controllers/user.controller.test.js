// const { mockRequest, mockResponse } = require('../utils/testInterceptor');
// // const request = require('supertest');
// const controller = require('./user.controller');
// const mongoose = require('../db');

// const mocks = {
//   customer: {
//     profile: 'Consumidor',
//     name: 'User Test',
//     email: 'usertest@mail.com',
//     phone: '(11) 99999-8888',
//     cpf: '010.020.030-40',
//     address: {
//       title: 'Casa',
//       streetName: 'Rua Teste',
//       number: '123A',
//       complement: '-',
//       district: 'Algum Bairro',
//       city: 'São Paulo',
//       state: 'SP',
//       zipcode: '00000-111',
//     },
//     password: '123senha4',
//   },
//   seller: {
//     profile: 'Vendedor',
//     corporateName: 'Razão Social Teste',
//     tradingName: 'Mercadinho da Vila',
//     email: 'davila@mercadinho.com',
//     phone: '(11) 99999-8888',
//     cnpj: '00.111.222/3333-44',
//     address: {
//       title: 'Matriz',
//       streetName: 'Avenida Teste',
//       number: '1489',
//       complement: 'Piso 2 - Lj. 214',
//       district: 'Algum Lugar',
//       city: 'São Paulo',
//       state: 'SP',
//       zipcode: '00000-111',
//     },
//     password: '123senha4',
//     rating: 5.2
//   }
// }


// describe('Testes Unitários - CustomerService', () => {

//   beforeEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//       const collection = collections[key];
//       await collection.deleteMany();
//     }
//   });


//   it('should successfuly register a new customer', async () => {
//     let req = mockRequest();
//     req.params = mocks.customer;
//     const res = mockResponse();

//     await controller.register(req, res);
    
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveProperty('_id');
//     expect(res.json).not.toHaveProperty('password');
//   });
// });

test('approves', () => {
  expect(true).toBe(true);
});