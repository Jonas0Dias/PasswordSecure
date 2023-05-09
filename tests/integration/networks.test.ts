import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {createUser, createCredential} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { createNetwork } from '../factories';
import { Network } from '@prisma/client';
import { PostNetwork } from '@/protocols';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /network', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/network');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/network').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/network').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
});

    describe('when token is valid', () => {
        it('should respond with status 404 if there is no network for given userId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 200 when there is network', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);

          const data = {
            title: faker.name.jobTitle(),
            network: 'sdfgsfdf',
            password: faker.name.findName(),
            userId: user.id,
          }
          await createNetwork(data);

         const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
         expect(response.status).toEqual(httpStatus.OK);
        });

        
      });
  })

  describe('GET /network/:networkId', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/network/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/network/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/network/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
      describe('when token is valid', () => {
          it('should respond with status 404 if there is no network for given userId', async () => {
              const user = await createUser();
              const token = await generateValidToken(user);

              const response = await server.get('/network/1').set('Authorization', `Bearer ${token}`);
              expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
          it('should respond with status 404 if networkId doesnt exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const data = {
                title: faker.name.jobTitle(),
                network: 'www.fake.com.br',
                password: faker.name.findName(),
                userId: user.id,
              }
            await createNetwork(data);

            const response = await server.get('/network/-1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 when there is network', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);

          const data = {
            title: faker.name.jobTitle(),
            network: 'www.fake.com.br',
            password: faker.name.findName(),
            userId: user.id,
          }
        const network = await createNetwork(data);

         const response = await server.get(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
         expect(response.status).toEqual(httpStatus.OK);
         expect(response.body).toEqual({
          id:network.id,
          title: data.title,
          network: data.network,
          password: expect.any(String),
          userId: user.id,
         })
        });
        });
    })


  describe('POST /network', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/network');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/network').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post('/network').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 400 if body doesnt follow the schema', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

       
        const invalidBody = {
          title: faker.name.jobTitle(),
          username:faker.name.findName(),
          password: faker.name.findName(),
          userId: user.id,
        }
  
  
        const response = await server.post('/network').set('Authorization', `Bearer ${token}`).send(invalidBody);
  
        expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      });
  
      it('should respond with status 409 if already exist a network with this title', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);


        const networkOne = {
            title: 'MESMOTITULO',
            network: 'aaaaaa',
            password: faker.name.findName(),
            userId: user.id,
          }
        await createNetwork(networkOne);

        const networkTwo : PostNetwork = {
          title: 'MESMOTITULO',
          network: 'aaaaaa2',
          password: faker.name.findName(),
        }
  
  
        const response = await server.post('/network').set('Authorization', `Bearer ${token}`).send(networkTwo);
  
        expect(response.status).toEqual(httpStatus.CONFLICT);
      });

      it('should respond with status 200 when a network was created', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const data = {
            title: faker.name.jobTitle(),
            network: 'aaaaaa',
            password: faker.name.findName(),
          }

       const response = await server.post('/network').set('Authorization', `Bearer ${token}`).send(data);
       expect(response.status).toEqual(httpStatus.CREATED);
      });

    });
  });


  










  describe('DELETE /network', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.delete('/network/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {

      const token = faker.lorem.word();

      const response = await server.delete('/network/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });
  
    it('should respond with status 401 if there is no session for given token', async () => {

      const userWithoutSession = await createUser();

      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.delete('/network/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });
  
    describe('when token is valid', () => {

      it('should respond with status 404 if networkId doesnt exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const data = {
            title: faker.name.jobTitle(),
            network: 'aaaaaa',
            password: faker.name.findName(),
            userId: user.id,
          }
        await createNetwork(data);

        const response = await server.delete('/network/-1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  
    it('should respond with status 200 when there is credential', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const data = {
        title: faker.name.jobTitle(),
        network: 'aaaaaa',
        password: faker.name.findName(),
        userId: user.id,
      }
      const network = await createNetwork(data);

     const response = await server.delete(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
     expect(response.status).toEqual(httpStatus.OK);
    });
      
    });
  });