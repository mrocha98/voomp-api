import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './entities/user.entity';
import { Config } from './config';
import { EmailService } from './services/email.service';
import { GenerationCodeEntity } from './entities/generation-code.entity';
import { GenerationCodeService } from './services/generation-code.service';
import { GenerationCodeController } from './controllers/generation-code.controller';
import { UserRepository } from './repositories/user-repository';
import { UserService } from './services/user.service';
import { PasswordHashService } from './services/password-hash.service';
import { JwtModule } from '@nestjs/jwt';
import { UserOnboardingEntity } from './entities/user-onboarding.entity';
import { AuthController } from './controllers/auth.controller';
import { IAService } from './services/ia.serice';
import { IAController } from './controllers/ia-controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: Config.database.type,
      host: Config.database.host,
      port: Number(Config.database.port),
      username: Config.database.username,
      password: Config.database.password,
      database: Config.database.name,
      synchronize: true,
      entities: [UserEntity, UserOnboardingEntity, GenerationCodeEntity],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserOnboardingEntity,
      GenerationCodeEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: Config.jwt.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AppController,
    GenerationCodeController,
    AuthController, 
    IAController
  ],
  providers: [
    AppService,
    EmailService,
    GenerationCodeService,
    PasswordHashService,
    UserRepository,
    UserService,
    IAService
  ],
})
export class AppModule {}
