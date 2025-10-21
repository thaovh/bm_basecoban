import { CreateServiceTestDto } from './dto/create-service-test.dto';

export class CreateServiceTestCommand {
  constructor(public readonly createServiceTestDto: CreateServiceTestDto) {}
}
