import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { AppModule } from './app.module';

const SWAGGER_VERSION = '0.0.1';
const SWAGGER_TITLE = 'TEST API';
const SWAGGER_DESCRIPTION = 'API used for test project';
const SWAGGER_PREFIX = '/docs';

function createSwagger(app: INestApplication, configService: ConfigService) {
    const users = {};
    users[configService.get('SWAGGER_USER')] = configService.get('SWAGGER_PASSWORD');
    app.use(
        ['/docs', '/docs-json'],
        basicAuth({
            challenge: true,
            users: users,
        })
    );

    const config = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .setVersion(SWAGGER_VERSION)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.setGlobalPrefix(configService.get('API_PREFIX'));
    if (!configService.get('SWAGGER_ENABLE') || configService.get('SWAGGER_ENABLE') === '1') {
        createSwagger(app, configService);
    }

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    app.use(helmet());

    await app.listen(configService.get('HTTP_PORT'));
}

bootstrap();
