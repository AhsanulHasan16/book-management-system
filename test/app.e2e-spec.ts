import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/authors (POST)', () => {
    return request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'An author',
        birthDate: '1980-01-01',
      })
      .expect(201)
      .expect((res: request.Response) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.firstName).toBe('John');
        expect(res.body.lastName).toBe('Doe');
      });
  });

  it('/authors (GET)', () => {
    return request(app.getHttpServer())
      .get('/authors')
      .expect(200)
      .expect((res: request.Response) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/authors/:id (GET)', async () => {
    const author = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
      });

    return request(app.getHttpServer())
      .get(`/authors/${author.body._id}`)
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body).toHaveProperty('_id', author.body._id);
      });
  });

  it('/authors/:id (PATCH)', async () => {
    const author = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
      });

    return request(app.getHttpServer())
      .patch(`/authors/${author.body._id}`)
      .send({ bio: 'Updated bio' })
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body.bio).toBe('Updated bio');
      });
  });

  it('/authors/:id (DELETE)', async () => {
    const author = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
      });

    return request(app.getHttpServer())
      .delete(`/authors/${author.body._id}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});