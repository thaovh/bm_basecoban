import { GetServiceRequestDto } from './dto/get-service-request.dto';

export class GetServiceRequestQuery {
  constructor(public readonly params: GetServiceRequestDto) {}
}
