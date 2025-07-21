import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth & Transactions (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'testuser@e2e.com',
        name: 'Test User',
        password: 'test1234',
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('testuser@e2e.com');
  });

  it('should login and return JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'testuser@e2e.com',
        password: 'test1234',
      });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    // Store JWT for later use in authenticated requests
    jwt = res.body.token;
  });

  it('should not allow creating transaction without JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/transactions')
      .send({});
    expect(res.status).toBe(401);
  });

  it('should allow creating transaction with valid JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/transactions')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        description: 'Test transaction',
        amount: 100,
        type: 'expense',
        category: 'Test'
      });
    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
