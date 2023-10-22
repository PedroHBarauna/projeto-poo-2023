import { Bike } from "./bike";
import { User } from "./user";

export class Rent {
    public end: Date = undefined

    constructor(
        public bikeId: string,
        public userId: string,
        public start: Date,
        public id?: string
    ) {}
}

