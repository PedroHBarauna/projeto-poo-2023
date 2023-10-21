import  UserModel from "../../database/models/UserModel"
import { IUserRepo } from "../interfaces/IUserRepo"
import { User } from "../user"
import { FindOptions, Optional } from "sequelize"

class UserRepo implements IUserRepo {
    async find(email: FindOptions): Promise<User> {
        try{
            return await UserModel.findOne(email);
        }
        catch(error){
            throw new Error(error.message)
        }
    }


    async add(user: User): Promise<User> {
        try{
            return await UserModel.create(user);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async remove(email: FindOptions): Promise<void> {
        try{
            await UserModel.destroy(email);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async list(): Promise<User[]> {
        return await UserModel.findAll();
    }
}

export default new UserRepo()