import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {createUser, createCredential} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { string } from 'joi';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /credential', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/credential');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/credential').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/credential').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
});

    describe('when token is valid', () => {
        it('should respond with status 404 if there is no credential for given userId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.get('/credential').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    
        it('should respond with status 200 when there is credential', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);

          const data = {
            title: faker.name.jobTitle(),
            url: 'www.fake.com.br',
            username:faker.name.findName(),
            password: faker.name.findName(),
            userId: user.id,
          }
          await createCredential(data);

         const response = await server.get('/credential').set('Authorization', `Bearer ${token}`);
         expect(response.status).toEqual(httpStatus.OK);
        });

        
      });
  })

  describe('GET /credential/:credentialId', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/credential/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/credential/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/credential/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
      describe('when token is valid', () => {
          it('should respond with status 404 if there is no credential for given userId', async () => {
              const user = await createUser();
              const token = await generateValidToken(user);

              const response = await server.get('/credential/1').set('Authorization', `Bearer ${token}`);
              expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
          it('should respond with status 404 if credentialId doesnt exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const data = {
              title: faker.name.jobTitle(),
              url: 'https://www.fake.com.br',
              username:faker.name.findName(),
              password: faker.name.findName(),
              userId: user.id,
            }
            await createCredential(data);

            const response = await server.get('/credential/-1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 when there is credential', async () => {
          const user = await createUser();
          const token = await generateValidToken(user);

          const data = {
            title: faker.name.jobTitle(),
            url: 'https://www.fake.com.br',
            username:faker.name.findName(),
            password: faker.name.findName(),
            userId: user.id,
          }
          const credential = await createCredential(data);

         const response = await server.get(`/credential/${credential.id}`).set('Authorization', `Bearer ${token}`);
         expect(response.status).toEqual(httpStatus.OK);
         expect(response.body).toEqual({
          id:credential.id,
          title: data.title,
          url: data.url,
          username:data.username,
          password: data.password,
          userId: user.id,
         })
        });
        });
    })


  describe('POST /credential', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/credential');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/credential').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post('/credential').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 400 if body doesnt follow the schema', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        //body withou a url
        const invalidBody = {
          title: faker.name.jobTitle(),
          username:faker.name.findName(),
          password: faker.name.findName(),
          userId: user.id,
        }
  
  
        const response = await server.post('/credential').set('Authorization', `Bearer ${token}`).send(invalidBody);
  
        expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      });
  
      it('should respond with status 409 if already exist a credential with this title', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);


        const credentialOne = {
          title: 'MESMOTITULO',
          url: 'http://www.fake1.com.br',
          username:faker.name.findName(),
          password: faker.name.findName(),
          userId: user.id,
        }

        await createCredential(credentialOne)

        const credentialTwo = {
          title: 'MESMOTITULO',
          url: 'http://www.fake2.com.br',
          username:faker.name.findName(),
          password: faker.name.findName(),
        }
  
  
        const response = await server.post('/credential').set('Authorization', `Bearer ${token}`).send(credentialTwo);
  
        expect(response.status).toEqual(httpStatus.CONFLICT);
      });

      it('should respond with status 200 when acredential was created', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const data = {
          title: faker.name.jobTitle(),
          url: 'https://www.fake.com.br',
          username:faker.name.findName(),
          password: faker.name.findName(),
        }
       const response = await server.post('/credential').set('Authorization', `Bearer ${token}`).send(data);
       expect(response.status).toEqual(httpStatus.CREATED);
      });

    });
  });


  










  describe('DELETE /credential', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.delete('/credential/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {

      const token = faker.lorem.word();

      const response = await server.delete('/credential/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });
  
    it('should respond with status 401 if there is no session for given token', async () => {

      const userWithoutSession = await createUser();

      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.delete('/credential/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });
  
    describe('when token is valid', () => {

      it('should respond with status 404 if credentialId doesnt exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const data = {
          title: faker.name.jobTitle(),
          url: 'https://www.fake.com.br',
          username:faker.name.findName(),
          password: faker.name.findName(),
          userId: user.id,
        }
        await createCredential(data);

        const response = await server.delete('/credential/-1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  
    it('should respond with status 200 when there is credential', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const data = {
        title: faker.name.jobTitle(),
        url: 'https://www.fake.com.br',
        username:faker.name.findName(),
        password: faker.name.findName(),
        userId: user.id,
      }
      const credential = await createCredential(data);

     const response = await server.delete(`/credential/${credential.id}`).set('Authorization', `Bearer ${token}`);
     expect(response.status).toEqual(httpStatus.OK);
    });
      
    });
  });