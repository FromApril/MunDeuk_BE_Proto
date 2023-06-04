import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { generateMember } from './mocks/member.mock';
import MemberDTO from 'src/dtos/Member.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/member (POST)', () => {
    const member = generateMember();

    return request(app.getHttpServer())
      .post('/member')
      .send(member)
      .expect(201)
      .expect((res) => {
        expect(plainToInstance(MemberDTO, res.body)).toStrictEqual(plainToInstance(MemberDTO, member));
      });
  });
});
