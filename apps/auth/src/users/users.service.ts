import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }
    async create(createUserDTO: CreateUserDto) {
        await this.validateCreateUserDto(createUserDTO);
        return this.usersRepository.create({ ...createUserDTO, password: await bcrypt.hash(createUserDTO.password, 10) });
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

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            const user = await this.usersRepository.findOne({ email: createUserDto.email });
            if (user) {
                throw new UnprocessableEntityException('User with this email already exists');
            }
            return createUserDto;
        } catch (error) {
            if (error.name === 'NotFoundException') {
                return;
            }
            throw new UnprocessableEntityException('User with this email already exists');
        }
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne({ _id: getUserDto._id });
    }

    findAll() {
        return this.usersRepository.find({});
    }

    findOne(_id: string) {
        return this.usersRepository.findOne({ _id: _id });
    }

    update(_id: string, updateUserDto: UpdateUserDto) {
        return this.usersRepository.findOneAndUpdate({ _id: _id }, { $set: updateUserDto });
    }

    remove(_id: string) {
        return this.usersRepository.findOneAndDelete({ _id: _id });
    }
}
