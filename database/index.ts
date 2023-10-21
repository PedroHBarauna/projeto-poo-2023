import { Sequelize } from 'sequelize-typescript';
import Bike from './models/BikeModel';
import User from './models/UserModel';
import Rent from './models/RentModel';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '123456',
  database: 'postgres',
  port: 5432,
  define: {
      timestamps: true,
  },
  models: [Bike, User, Rent]
})

export default sequelize;