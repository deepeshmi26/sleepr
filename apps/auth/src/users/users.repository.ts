import { AbstractRepository, User } from "@app/common";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";


export class UsersRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UsersRepository.name);
    constructor(
        @InjectRepository(User) userRepository: Repository<User>,
        entityManager: EntityManager,
    ) {
        super(userRepository, entityManager);
    }
}