import { AbstractRepository } from "@app/common";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "@app/common";


export class UsersRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(UsersRepository.name);
    constructor(
        @InjectModel(UserDocument.name) UsersModule: Model<UserDocument>
    ) {
        super(UsersModule)
    }
}