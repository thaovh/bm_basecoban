import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './domain/patient.entity';
import { PatientController } from './patient.controller';
import { PatientRepository } from './infrastructure/database/patient.repository';

// Import Province and Ward modules for relationships
import { ProvinceModule } from '../province/province.module';
import { WardModule } from '../ward/ward.module';
import { HisIntegrationModule } from '../his-integration/his-integration.module';

// Command Handlers
import { CreatePatientHandler } from './application/commands/impl/create-patient.handler';
import { UpdatePatientHandler } from './application/commands/impl/update-patient.handler';
import { DeletePatientHandler } from './application/commands/impl/delete-patient.handler';
import { SyncPatientFromHisHandler } from './application/commands/impl/sync-patient-from-his.handler';

// Query Handlers
import { GetPatientByIdHandler } from './application/queries/impl/get-patient-by-id.handler';
import { GetPatientByCodeHandler } from './application/queries/impl/get-patient-by-code.handler';
import { GetPatientByHisIdHandler } from './application/queries/impl/get-patient-by-his-id.handler';
import { GetPatientsHandler } from './application/queries/impl/get-patients.handler';
import { SearchPatientsHandler } from './application/queries/impl/search-patients.handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Patient]),
        ProvinceModule,
        WardModule,
        HisIntegrationModule,
    ],
    controllers: [PatientController],
    providers: [
        {
            provide: 'IPatientRepository',
            useClass: PatientRepository,
        },
        PatientRepository,
        // Command Handlers
        CreatePatientHandler,
        UpdatePatientHandler,
        DeletePatientHandler,
        SyncPatientFromHisHandler,
        // Query Handlers
        GetPatientByIdHandler,
        GetPatientByCodeHandler,
        GetPatientByHisIdHandler,
        GetPatientsHandler,
        SearchPatientsHandler,
    ],
    exports: ['IPatientRepository'],
})
export class PatientModule { }
