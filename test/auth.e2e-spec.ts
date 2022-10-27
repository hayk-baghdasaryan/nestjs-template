import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/users/repository/user.repository';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RoleEntity } from '../src/users/entity/role.enitity';
import { User } from '../src/users/entity/user.entity';

describe('AppModule (e2e)', () => {
    let app: INestApplication;
    let userRepository: UserRepository;
    const email = "user@test.com";
    const password = "password";
    let userId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        userRepository = moduleFixture.get(getRepositoryToken(User));


        const passHash = await bcrypt.hash(password, 10);
        const user = await userRepository.save(<User>{
            email: email,
            password: passHash,
            roles: [<RoleEntity>{
                id: 2
            }]
        });
        userId = user.userId;

        await app.init();
    });

    let accessToken: string;
    let refreshToken: string;
    describe('Autentication', () => {
        it("should succeed when calling /login with valid credentials", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: "user@test.com",
                    password: "password"
                })
                .set('Accept', 'application/json')
                .expect(200);

            accessToken = body["access_token"];
            refreshToken = body["refresh_token"];

            expect(body["user_id"]).toBe(userId);
            expect(body["access_token"]).toBeDefined();
            expect(body["refresh_token"]).toBeDefined();
        });

        it("should fail when calling /login with invalid credentials", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: "user@test.com",
                    password: "wrongpassword"
                })
                .set('Accept', 'application/json')
                .expect(401);
        });

        it("should succeed when calling /refresh with valid refresh_token", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .post('/auth/refresh')
                .set("Authorization", "Bearer " + refreshToken)
                .set('Accept', 'application/json')
                .expect(200);

            expect(body["access_token"]).toBeDefined();
            expect(body["refresh_token"]).toBeDefined();
        });

        it("should fail when calling /refresh by passing access_token instead of refresh_token", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .post('/auth/refresh')
                .set("Authorization", "Bearer " + accessToken)
                .set('Accept', 'application/json')
                .expect(401);
        });

        it("should fail when passing refresh_token instead of access_token", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .get('/userprofile/user')
                .set("Authorization", "Bearer " + refreshToken)
                .set('Accept', 'application/json')
                .expect(401);
        });

        it("should fail when Authorization header is missing", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .get('/userprofile/user')
                .set('Accept', 'application/json')
                .expect(401);
        });
    });

    describe('Authorization', () => {
        it("should succeed when passing valid access_token", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .get('/userprofile/user')
                .set("Authorization", "Bearer " + accessToken)
                .set('Accept', 'application/json')
                .expect(200);

            expect(body).toBeDefined();
        });

        it("should fail when accessing protected resource", async () => {
            const { body } = await request.agent(app.getHttpServer())
                .get('/userprofile/admin')
                .set("Authorization", "Bearer " + accessToken)
                .set('Accept', 'application/json')
                .expect(403);
        });
    });

    afterAll(async () => {
        const user = await userRepository.findOneBy({email: email});
        await userRepository.remove(user);
        await app.close();
    });
});
