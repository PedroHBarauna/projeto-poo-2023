import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'
import UserRepo from './repos/UserRepo'
import sequelize from "../database";
import BikeRepo from "./repos/BikeRepo";
import RentRepo from "./repos/RentRepo";
import { Location } from "./location";

async function main() {
    const clock = sinon.useFakeTimers();
    await sequelize.sync({logging: false})
    const app = new App(UserRepo, BikeRepo, RentRepo);
    const user1 = new User('Joao Jose da Silva', 'jjsilva@mail.com', '1234', '1');
    const bike = new Bike('caloi mountainbike', 'mountain bike',
        1234, 1234, 100.0, 'My bike', 5, "", true, 12312, 3432, 'sad')

    await app.registerUser(user1);
    console.log(await app.listUsers())

    
    await app.registerBike(bike)
    console.log(await app.listBikes())


    await app.removeUser(user1.email)
    console.log(await app.listUsers())
    

    await app.removeBike(bike.id)
    console.log(await app.listBikes())

    // await app.moveBikeTo('sad', new Location(3333,2222))
    // console.log(await app.listBikes())

    // await app.rentBike(bike.id, user1.email)
    // console.log(await app.listRent())

    // clock.tick(1000 * 60 * 65)
    // console.log(await app.returnBike(bike.id, user1.id))
    // console.log('Bike disponível: ', bike.available)
}

main()








