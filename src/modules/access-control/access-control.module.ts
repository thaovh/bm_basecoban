import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './application/services/access-control.service';
import { AccessControlHttpClient } from './infrastructure/http/access-control.http.client';
import { GetAttendanceEventsHandler } from './application/queries/impl/get-attendance-events.handler';

@Module({
    imports: [CqrsModule, ConfigModule],
    controllers: [AccessControlController],
    providers: [
        {
            provide: 'IAccessControlService',
            useClass: AccessControlService,
        },
        AccessControlHttpClient,
        GetAttendanceEventsHandler,
    ],
    exports: ['IAccessControlService'],
})
export class AccessControlModule { }
