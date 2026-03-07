import { AbstractEntity } from "@app/common/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Role extends AbstractEntity<Role> {
    @Column()
    name: string;

    constructor(entity: Partial<Role>) {
        super(entity);
    }
}