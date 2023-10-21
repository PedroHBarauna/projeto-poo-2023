import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'
import UserRepo from './repos/UserRepo'
import sequelize from "../database";

async function main() {
    const clock = sinon.useFakeTimers();
    await sequelize.sync({logging: false})
    const app = new App(UserRepo);
    const user1 = new User('Jose', 'jose@mail.com', '1234', '1');
    await app.registerUser(user1);
    // const bike = new Bike('caloi mountainbike', 'mountain bike',
    //     1234, 1234, 100.0, 'My bike', 5, [])
    // app.registerBike(bike)
    // console.log('Bike disponível: ', bike.available)
    // app.rentBike(bike.id, user1.email)
    // console.log('Bike disponível: ', bike.available)
    // clock.tick(1000 * 60 * 65)
    // console.log(app.returnBike(bike.id, user1.email))
    // console.log('Bike disponível: ', bike.available)
}

main()








