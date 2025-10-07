import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from './user.controller';
import { User } from './domain/user.entity';
import { UserRepository } from './infrastructure/database/user.repository';
import { CreateUserHandler } from './application/commands/impl/create-user.handler';
import { GetUsersHandler } from './application/queries/impl/get-users.handler';

// Command Handlers
const CommandHandlers = [CreateUserHandler];

// Query Handlers
const QueryHandlers = [GetUsersHandler];

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CqrsModule,
    ],
    controllers: [UserController],
    providers: [
        // Repository
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        // Command Handlers
        ...CommandHandlers,
        // Query Handlers
        ...QueryHandlers,
    ],
    exports: [
        'IUserRepository',
        ...CommandHandlers,
        ...QueryHandlers,
    ],
})
export class UserModule { }
