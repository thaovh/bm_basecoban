import { GetAttendanceEventsDto } from './dto/get-attendance-events.dto';

export class GetAttendanceEventsQuery {
    constructor(public readonly params: GetAttendanceEventsDto) { }
}
