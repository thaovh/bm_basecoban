import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProvinceModule } from './modules/province/province.module';
import { WardModule } from './modules/ward/ward.module';
import { BranchModule } from './modules/branch/branch.module';
import { DepartmentTypeModule } from './modules/department-type/department-type.module';
import { DepartmentModule } from './modules/department/department.module';
import { RoomModule } from './modules/room/room.module';
import { SampleTypeModule } from './modules/sample-type/sample-type.module';
import { ServiceGroupModule } from './modules/service-group/service-group.module';
import { UnitOfMeasureModule } from './modules/unit-of-measure/unit-of-measure.module';
import { ServiceModule } from './modules/service/service.module';
import { HisIntegrationModule } from './modules/his-integration/his-integration.module';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { HealthController } from './health.controller';
import { DualAuthGuard } from './common/guards/dual-auth.guard';
import { HisIntegrationService } from './modules/his-integration/application/services/his-integration.service';
import { UserRepository } from './modules/user/infrastructure/database/user.repository';
import { User } from './modules/user/domain/user.entity';
import { HisTokenRepository } from './modules/his-integration/infrastructure/database/his-token.repository';
import { HisToken } from './modules/his-integration/domain/his-token.entity';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // Database
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => typeOrmConfig(configService),
            inject: [ConfigService],
        }),

        // Entities for global providers
        TypeOrmModule.forFeature([User, HisToken]),

        // CQRS
        CqrsModule.forRoot(),

        // Health checks
        TerminusModule,

        // Feature modules
        UserModule,
        AuthModule,
        ProvinceModule,
        WardModule,
        BranchModule,
        DepartmentTypeModule,
        DepartmentModule,
        RoomModule,
        SampleTypeModule,
        ServiceGroupModule,
        UnitOfMeasureModule,
        ServiceModule,
        HisIntegrationModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: DualAuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        HisIntegrationService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        {
            provide: 'IHisTokenRepository',
            useClass: HisTokenRepository,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestIdMiddleware)
            .forRoutes('*');
    }
}
