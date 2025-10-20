import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetAttendanceEventsQuery } from '../get-attendance-events.query';
import { IAccessControlService, AttendanceEventResponse } from '../../../domain/access-control.interface';

@QueryHandler(GetAttendanceEventsQuery)
export class GetAttendanceEventsHandler implements IQueryHandler<GetAttendanceEventsQuery> {
    private readonly logger = new Logger(GetAttendanceEventsHandler.name);

    constructor(
        @Inject('IAccessControlService')
        private readonly accessControlService: IAccessControlService,
    ) { }

    async execute(query: GetAttendanceEventsQuery): Promise<AttendanceEventResponse> {
        this.logger.log(`Getting attendance events for employee: ${query.params.employeeNoString}`);

        return this.accessControlService.getAttendanceEvents(query.params);
    }
}
