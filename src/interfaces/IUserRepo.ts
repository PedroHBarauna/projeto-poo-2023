import { FindOptions } from "sequelize";
import { User } from "../user";

export interface IUserRepo {
    find(email: any): Promise<User>
    add(user: User): Promise<User>
    remove(email: any): Promise<void>
    list(): Promise<User[]>
}
