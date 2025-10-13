import { GetServiceGroupsDto } from './dto/get-service-groups.dto';

export class GetServiceGroupsQuery {
  constructor(public readonly getServiceGroupsDto: GetServiceGroupsDto) {}
}
