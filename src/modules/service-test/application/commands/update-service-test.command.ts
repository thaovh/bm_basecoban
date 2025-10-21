import { UpdateServiceTestDto } from './dto/update-service-test.dto';

export class UpdateServiceTestCommand {
  constructor(
    public readonly id: string,
    public readonly updateServiceTestDto: UpdateServiceTestDto,
  ) {}
}
