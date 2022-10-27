import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PostRefactoring1666363152968 } from './migrations/1666363152968-PostRefactoring';
import { PostRefactoring1666372202823 } from './migrations/1666372202823-PostRefactoring';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: configService.get<any>('DATABASE_TYPE'),
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_DB'),
                autoLoadEntities: true,
                synchronize: false,
                logging: configService.get('DATABASE_LOGGING_ENABLED') === "true",
                migrations: [
                    PostRefactoring1666363152968,
                    PostRefactoring1666372202823
                ],
                migrationsRun: true,
                bigNumberStrings: false
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UsersModule,
        UserProfileModule,
        HealthModule,
    ]
})
export class AppModule { }
