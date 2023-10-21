import { IRentRepo } from "../interfaces/IRentRepo";
import RentModel from "../../database/models/RentModel";
import { Rent } from "../rent";

class RentRepo implements IRentRepo {
    async add(rent: Rent): Promise<Rent> {
        try{
            return await RentModel.create(rent);
        }
        catch(error){
            throw new Error(error.message)
        }
    }
    
    async findOpen(bikeId: string, userEmail: string): Promise<Rent> {
        try{
            return await RentModel.findOne({
                where: {
                    bikeId,
                    userEmail,
                    finishedAt: null
                }
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async findOpenFor(userEmail: string): Promise<Rent[]> {
        try{
            return await RentModel.findAll({
                where: {
                    userEmail,
                    finishedAt: null
                }
            });
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async update(id: string, rent: Rent): Promise<void> {
        try{
            await RentModel.update(rent, {where: {id}});
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    async list(): Promise<Rent[]> {
        return await RentModel.findAll();
    }
}