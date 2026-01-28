import { CurrentUser } from '@app/common';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from '@app/common';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { };

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async find(@CurrentUser() user: UserDocument) {
        return user;
    }

    @Get('all')
    returnAllUsers() {
        return this.usersService.findAll();
    }
}
