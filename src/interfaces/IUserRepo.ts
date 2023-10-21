import { FindOptions } from "sequelize";
import { User } from "../user";

export interface IUserRepo {
    find(email: FindOptions): Promise<User>
    add(user: User): Promise<User>
    remove(email: FindOptions): Promise<void>
    list(): Promise<User[]>
}
