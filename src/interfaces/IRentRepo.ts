import { Rent } from "../rent";

export interface IRentRepo {
    add(rent: Rent): Promise<Rent>
    findOpen(bikeId: string, userEmail: string): Promise<Rent>
    findOpenFor(userEmail: string): Promise<Rent[]>
    update(id: string, rent: Rent): Promise<void>
}