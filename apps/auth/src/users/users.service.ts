import { Role, User } from '@app/common';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }
    async create(createUserDTO: CreateUserDto) {
        await this.validateCreateUser(createUserDTO);
        const user = new User({ ...createUserDTO, password: await bcrypt.hash(createUserDTO.password, 10), roles: createUserDTO.roles?.map(role => new Role(role)) });

        return this.usersRepository.create(user);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email: email });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Password is incorrect');
        }
        return user;
    }

    private async validateCreateUser(createUserDTO: CreateUserDto) {
        try {
            const user = await this.usersRepository.findOne({ email: createUserDTO.email });
            if (user) {
                throw new UnprocessableEntityException('User with this email already exists');
            }
            return createUserDTO;
        } catch (error) {
            if (error.name === 'NotFoundException') {
                return;
            }
            throw new UnprocessableEntityException('User with this email already exists');
        }
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto, { roles: true });
    }

    findAll() {
        return this.usersRepository.find({});
    }

}
