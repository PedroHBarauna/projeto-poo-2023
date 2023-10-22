import { FindOptions } from "sequelize";
import { Bike } from "../bike"

export interface IBikeRepo {
    find(id: any): Promise<Bike>
    add(bike: Bike): Promise<Bike>
    remove(id: FindOptions): Promise<void>
    update(bike: Bike, id: any): Promise<void>
    list(): Promise<Bike[]>
}