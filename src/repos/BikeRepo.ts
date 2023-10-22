import { FindOptions, UpdateOptions, where } from "sequelize";
import { IBikeRepo } from "../interfaces/IBikeRepo";
import BikeModel from "../../database/models/BikeModel";
import { Bike } from "../bike";

class BikeRepo implements IBikeRepo {
    async find(whereOptions: any): Promise<Bike> {
        try{
            return await BikeModel.findOne({
                raw: true,
                where: whereOptions,
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async add(bike: Bike): Promise<Bike> {
        try{
            return await BikeModel.create(bike);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async remove(whereOptions: any): Promise<void> {
        try{
            await BikeModel.destroy({where: whereOptions});
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async update(bike: Bike, whereOptions: any): Promise<void> {
        try{
            await BikeModel.update(bike, {
                where: whereOptions
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async list(): Promise<Bike[]> {
        return await BikeModel.findAll({raw: true});
    }
}

export default new BikeRepo()