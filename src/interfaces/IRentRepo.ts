import { Rent } from "../rent";

export interface IRentRepo {
    add(rent: Rent): Promise<Rent>
    findOpen(bikeId: string, userId: string): Promise<Rent>
    findOpenFor(userId: string): Promise<Rent[]>
    update(rent: Rent, whereOptions: any): Promise<void>
    list(): Promise<Rent[]>
}