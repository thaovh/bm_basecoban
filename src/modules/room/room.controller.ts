import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseBuilder } from '../../common/dtos/base-response.dto';

import { CreateRoomDto } from './application/commands/dto/create-room.dto';
import { UpdateRoomDto } from './application/commands/dto/update-room.dto';
import { GetRoomsDto } from './application/queries/dto/get-rooms.dto';

import { CreateRoomCommand } from './application/commands/create-room.command';
import { UpdateRoomCommand } from './application/commands/update-room.command';
import { DeleteRoomCommand } from './application/commands/delete-room.command';

import { GetRoomByIdQuery } from './application/queries/get-room-by-id.query';
import { GetRoomsQuery } from './application/queries/get-rooms.query';
import { GetRoomsByDepartmentQuery } from './application/queries/get-rooms-by-department.query';

@ApiTags('Rooms')
@Controller('api/v1/rooms')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class RoomController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Create a new room' })
    @ApiResponse({ status: 201, description: 'Room created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Room code or name already exists' })
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        const room = await this.commandBus.execute(new CreateRoomCommand(createRoomDto));
        return ResponseBuilder.success(room, HttpStatus.CREATED);
    }

    @Get()
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get all rooms with pagination and filters' })
    @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
    async getRooms(@Query() getRoomsDto: GetRoomsDto) {
        const result = await this.queryBus.execute(new GetRoomsQuery(getRoomsDto));
        return ResponseBuilder.paginated(result.items, result.total, getRoomsDto.limit || 10, getRoomsDto.offset || 0);
    }

    @Get('department/:departmentId')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get rooms by department ID' })
    @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
    async getRoomsByDepartment(
        @Param('departmentId') departmentId: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0
    ) {
        const result = await this.queryBus.execute(new GetRoomsByDepartmentQuery(departmentId, limit, offset));
        return ResponseBuilder.paginated(result.items, result.total, limit, offset);
    }

    @Get(':id')
    @Roles('admin', 'manager', 'user')
    @ApiOperation({ summary: 'Get room by ID' })
    @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    async getRoomById(@Param('id') id: string) {
        const room = await this.queryBus.execute(new GetRoomByIdQuery(id));
        return ResponseBuilder.success(room);
    }

    @Put(':id')
    @Roles('admin', 'manager')
    @ApiOperation({ summary: 'Update room by ID' })
    @ApiResponse({ status: 200, description: 'Room updated successfully' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @ApiResponse({ status: 409, description: 'Room code or name already exists' })
    async updateRoom(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
        const room = await this.commandBus.execute(new UpdateRoomCommand(id, updateRoomDto));
        return ResponseBuilder.success(room);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Delete room by ID' })
    @ApiResponse({ status: 200, description: 'Room deleted successfully' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    async deleteRoom(@Param('id') id: string) {
        await this.commandBus.execute(new DeleteRoomCommand(id));
        return ResponseBuilder.success({ message: 'Room deleted successfully' });
    }
}
