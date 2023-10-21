import { FindOptions } from "sequelize";
import { Bike } from "../bike"

export interface IBikeRepo {
    find(id: FindOptions): Promise<Bike>
    add(bike: Bike): Promise<string>
    remove(id: FindOptions): Promise<void>
    update(id: FindOptions, bike: Bike): Promise<void>
    list(): Promise<Bike[]>
}