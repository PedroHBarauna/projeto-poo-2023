import { IRentRepo } from "../interfaces/IRentRepo";
import RentModel from "../../database/models/RentModel";
import { Rent } from "../rent";

class RentRepo implements IRentRepo {
    async add(rent: Rent): Promise<Rent> {
        try {
            return await RentModel.create(rent);
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async findOpen(bikeId: string, userId: string): Promise<Rent> {
        try {
            return await RentModel.findOne({
                raw: true,
                where: {
                    bikeId,
                    userId,
                    end: null
                }
            });
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async findOpenFor(userId: string): Promise<Rent[]> {
        try {
            return await RentModel.findAll({
                raw: true,
                where: {
                    userId,
                    end: null
                }
            });
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async update(rent: Rent, whereOptions: any): Promise<void> {
        try {
            await RentModel.update(rent, { where: whereOptions });
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async list(): Promise<Rent[]> {
        try {
            return await RentModel.findAll({ raw: true });
        }
        catch (error) {
            throw new Error(error.message)
        }
    }
}

export default new RentRepo();