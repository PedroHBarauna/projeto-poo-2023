import  UserModel from "../../database/models/UserModel"
import { IUserRepo } from "../interfaces/IUserRepo"
import { User } from "../user"
import { FindOptions, Optional } from "sequelize"

class UserRepo implements IUserRepo {
    async find(email: any): Promise<User> {
        try{
            return await UserModel.findOne({
                raw: true,
                where: email
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }


    async add(user: User): Promise<User> {
        try{
            return await UserModel.create(user, {
                raw: true
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async remove(email: any): Promise<void> {
        try{
            await UserModel.destroy({
                where: email
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async list(): Promise<User[]> {
        return await UserModel.findAll({
            raw: true
        });
    }
}

export default new UserRepo()