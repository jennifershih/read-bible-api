import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('read-bible-api (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / reports health', () =>
    request(app.getHttpServer()).get('/').expect(200).expect({ status: 'ok' }));

  it('POST /get-bible-verse-from-mood validates the body', () =>
    request(app.getHttpServer())
      .post('/get-bible-verse-from-mood')
      .send({})
      .expect(400));
});
