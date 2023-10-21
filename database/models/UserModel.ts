import { Table, Model, Column, HasOne } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import RentModel from './RentModel';

interface UserAttributes {
    id: string;
    email: string;
    password: string;
    name: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @Column({ primaryKey: true })
    id: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    name: string;

    @HasOne(() => RentModel)
    rent: RentModel;
}


export default User;