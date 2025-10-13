import { UpdateServiceGroupDto } from './dto/update-service-group.dto';

export class UpdateServiceGroupCommand {
  constructor(
    public readonly id: string,
    public readonly updateServiceGroupDto: UpdateServiceGroupDto
  ) {}
}
