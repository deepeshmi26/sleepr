import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { User } from '@app/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { JwtStrategy } from '../strategies/jwt-strategy';
@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([
        { name: User.name, schema: User }]),
        LoggerModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, JwtStrategy],
    exports: [UsersService]
})
export class UsersModule { }
