import { GetServiceTestsDto } from './dto/get-service-tests.dto';

export class GetServiceTestsQuery {
  constructor(public readonly params: GetServiceTestsDto) {}
}
