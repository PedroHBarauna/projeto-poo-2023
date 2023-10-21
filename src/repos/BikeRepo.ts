import { FindOptions, UpdateOptions } from "sequelize";
import { IBikeRepo } from "../interfaces/IBikeRepo";
import BikeModel from "../../database/models/BikeModel";
import { Bike } from "../bike";

class BikeRepo implements IBikeRepo {
    async find(id: FindOptions): Promise<Bike> {
        try{
            return await BikeModel.findOne(id);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async add(bike: Bike): Promise<string> {
        try{
            return await BikeModel.create(bike);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async remove(id: FindOptions): Promise<void> {
        try{
            await BikeModel.destroy(id);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async update(id: Omit<UpdateOptions, 'returning'>, bike: Bike): Promise<void> {
        try{
            await BikeModel.update(bike, id);
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async list(): Promise<Bike[]> {
        return await BikeModel.findAll();
    }
}

export default new BikeRepo()