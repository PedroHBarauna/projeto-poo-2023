import { Table, Column, Model, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import UserModel from './UserModel';
import BikeModel from './BikeModel';
import { Optional } from 'sequelize';

interface RentAttributes {
    id: string;
    bikeId: string;
    userId: string;
    start: Date;
    end: Date;
}

interface RentCreationAttributes extends Optional<RentAttributes, 'id'> {}

@Table
class Rent extends Model<RentAttributes, RentCreationAttributes> implements RentAttributes {
    @Column({ primaryKey: true })
    id: string;

    @ForeignKey(() => BikeModel)
    @Column
    bikeId: string;

    @BelongsTo(() => BikeModel)
    bike: BikeModel;

    @ForeignKey(() => UserModel)
    @Column
    userId: string;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @Column
    start: Date;

    @Column
    end: Date;
}

export default Rent;