import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { HisToken } from './domain/his-token.entity';
import { HisTokenRepository } from './infrastructure/database/his-token.repository';
import { HisHttpClientService } from './infrastructure/http/his-http-client.service';
import { HisIntegrationService } from './application/services/his-integration.service';
import { HisIntegrationController } from './his-integration.controller';
import { HisProtectedController } from './his-protected.controller';
import { HisDirectLoginController } from './his-direct-login.controller';
import { User } from '../user/domain/user.entity';
import { UserRepository } from '../user/infrastructure/database/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([HisToken, User]),
        ConfigModule,
    ],
    controllers: [HisIntegrationController, HisProtectedController, HisDirectLoginController],
    providers: [
        {
            provide: 'IHisTokenRepository',
            useClass: HisTokenRepository,
        },
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        HisHttpClientService,
        HisIntegrationService,
    ],
    exports: [
        'IHisTokenRepository',
        'IUserRepository',
        HisHttpClientService,
        HisIntegrationService,
    ],
})
export class HisIntegrationModule { }
