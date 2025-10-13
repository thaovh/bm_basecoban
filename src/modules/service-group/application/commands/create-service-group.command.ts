import { CreateServiceGroupDto } from './dto/create-service-group.dto';

export class CreateServiceGroupCommand {
  constructor(public readonly createServiceGroupDto: CreateServiceGroupDto) {}
}
