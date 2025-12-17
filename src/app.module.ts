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
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { PasswordHashService } from './services/password-hash.service';
import { JwtModule } from '@nestjs/jwt';
import { UserOnboardingEntity } from './entities/user-onboarding.entity';
import { AuthController } from './controllers/auth.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { IAService } from './services/ia.service';
import { IAController } from './controllers/ia.controller';
import { BucketService } from './services/bucket.service';
import { UserController } from './controllers/user.controller';
import { SaleEntity } from './entities/sale.entity';
import { ProductVisitEntity } from './entities/product-visit.entity';
import { LeadEntity } from './entities/lead.entity';
import { ProductVisitRepository } from './repositories/product-visit.repository';
import { WebhookService } from './services/webhook.service';
import { WebhookController } from './controllers/webhook.controller';
import { LeadRepository } from './repositories/lead.repository';
import { SaleRepository } from './repositories/sale.repository';
import { SaleController } from './controllers/sale.controller';
import { SaleService } from './services/sale.service';
import { IAPromptsEntity } from './entities/ia-prompts.entity';
import { IAPromptRepository } from './repositories/ia-prompts.repository';

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
      entities: [
        UserEntity,
        UserOnboardingEntity,
        GenerationCodeEntity,
        ProductEntity,
        ProductVisitEntity,
        LeadEntity,
        SaleEntity,
        IAPromptsEntity
      ],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserOnboardingEntity,
      GenerationCodeEntity,
      ProductEntity,
      ProductVisitEntity,
      LeadEntity,
      SaleEntity,
      IAPromptsEntity
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
    IAController,
    ProductController,
    UserController,
    WebhookController,
    SaleController,
  ],
  providers: [
    AppService,
    EmailService,
    BucketService,
    SaleService,
    WebhookService,
    GenerationCodeService,
    PasswordHashService,
    UserRepository,
    UserService,
    IAService,
    ProductRepository,
    ProductService,
    ProductVisitRepository,
    LeadRepository,
    SaleRepository,
    IAPromptRepository
  ],
})
export class AppModule {}
