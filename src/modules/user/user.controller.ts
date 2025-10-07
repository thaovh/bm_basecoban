import { Controller, Get, Post, Body, Query, Param, UseGuards, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

import { CreateUserDto } from './application/commands/dto/create-user.dto';
import { GetUsersDto } from './application/queries/dto/get-users.dto';
import { CreateUserCommand } from './application/commands/create-user.command';
import { GetUsersQuery } from './application/queries/get-users.query';
import { ResponseBuilder, HTTP_STATUS } from '../../common/dtos/base-response.dto';

@ApiTags('Users')
@Controller('api/v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post('users')
    @UseGuards(RoleGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async createUser(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`Creating user: ${createUserDto.username}`);

        const user = await this.commandBus.execute(new CreateUserCommand(createUserDto));

        return ResponseBuilder.success(user, HTTP_STATUS.CREATED);
    }

    @Get('users')
    @ApiOperation({ summary: 'Get list of users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getUsers(@Query() getUsersDto: GetUsersDto) {
        this.logger.log(`Getting users with criteria: ${JSON.stringify(getUsersDto)}`);

        const result = await this.queryBus.execute(new GetUsersQuery(getUsersDto));

        return ResponseBuilder.paginated(
            result.users,
            result.total,
            result.limit,
            result.offset,
            HTTP_STATUS.OK
        );
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string) {
        this.logger.log(`Getting user by ID: ${id}`);

        // TODO: Implement GetUserByIdQuery
        // const user = await this.queryBus.execute(new GetUserByIdQuery(id));

        return ResponseBuilder.success({ id }, HTTP_STATUS.OK);
    }
}
