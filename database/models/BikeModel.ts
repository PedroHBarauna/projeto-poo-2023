import { Optional } from 'sequelize';
import { Table, Column, Model, HasOne } from 'sequelize-typescript';
import RentModel from './RentModel';

interface BikeAttributes {
    id: string;
    name: string;
    price: number;
    type: string;
    bodySize: number;
    maxLoad: number;
    rate: number;
    description: string;
    ratings: number;
    imageUrls: string;
    available: boolean;
    latitude: number;
    longitude: number;
}

interface BikeCreationAttributes extends Optional<BikeAttributes, 'id'> {}

@Table
class Bike extends Model<BikeAttributes, BikeCreationAttributes> implements BikeAttributes {
    @Column({ primaryKey: true })
    id: string;

    @Column
    name: string;

    @Column
    price: number;

    @Column
    type: string;

    @Column
    bodySize: number;

    @Column
    maxLoad: number;

    @Column
    rate: number;

    @Column
    description: string;

    @Column
    ratings: number;

    @Column
    imageUrls: string;

    @Column
    available: boolean;

    @Column
    latitude: number;

    @Column
    longitude: number;

    @HasOne(() => RentModel)
    rent: RentModel;
}

export default Bike;