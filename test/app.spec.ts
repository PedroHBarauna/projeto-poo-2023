import { App } from "../src/app";
import { Location } from "../src/location";
import { BikeNotFoundError } from "../src/errors/bike-not-found-error";
import { UnavailableBikeError } from "../src/errors/unavailable-bike-error";
import { UserNotFoundError } from "../src/errors/user-not-found-error";
import { DuplicateUserError } from "../src/errors/duplicate-user-error";
import { UserHasOpenRentError } from "../src/errors/user-has-open-rent-error";
import sequelize from "../database"
import UserRepo from "../src/repos/UserRepo";
import BikeRepo from "../src/repos/BikeRepo";
import RentRepo from "../src/repos/RentRepo";
import sinon from "sinon";

let app: App;

afterAll(async () => {
    await sequelize.close();
  });

describe('App', () => {
    
    beforeEach(async () => {
        await sequelize.sync({ force: true }); 
    app = new App(UserRepo, BikeRepo, RentRepo); 
  });

    it('should correctly calculate the rent amount', async () => {
    const app = new App(UserRepo, BikeRepo, RentRepo);
    const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id: '1' });
    const bike = await BikeRepo.add({ 
        name: 'Caloi', 
        type: 'mountain', 
        bodySize: 42, 
        maxLoad: 322, 
        description: '', 
        latitude: 0, 
        longitude: 0, 
        rate: 0,  
        ratings: 100,  
        imageUrls: '',  
        available: true,  
        id: '1'
    });
    const clock = sinon.useFakeTimers();
    await app.rentBike(bike.id, user.email);
    const hour = 1000 * 60 * 60;
    clock.tick(2 * hour);
    const rentAmount = await app.returnBike(bike.id, user.email);
    expect(rentAmount).toEqual(200.0);

});

    it('should be able to move a bike to a specific location', async () => {
    const app = new App(UserRepo, BikeRepo, RentRepo);
    const bike = await BikeRepo.add({ 
        name: 'Caloi', 
        type: 'mountain', 
        bodySize: 42, 
        maxLoad: 322, 
        description: '', 
        latitude: 0, 
        longitude: 0, 
        rate: 0,  
        ratings: 100,  
        imageUrls: '',  
        available: true,
        id: '1'
    });
    await app.registerBike(bike)
    const newYork = new Location(40.753056, -73.983056)
    await app.moveBikeTo(bike.id, newYork)
    expect(bike.latitude).toEqual(newYork.latitude)
    expect(bike.longitude).toEqual(newYork.longitude)
})

    it('should throw an exception when trying to move an unregistered bike', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const newYork = new Location(40.753056, -73.983056)
        await expect(app.moveBikeTo('fake-id', newYork)).rejects.toThrow(BikeNotFoundError)
    })

    it('should correctly handle a bike rent', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id: '1' });
        await app.registerUser(user)
        const bike = await BikeRepo.add({ 
            name: 'Caloi', 
            type: 'mountain', 
            bodySize: 42, 
            maxLoad: 322, 
            description: '', 
            latitude: 0, 
            longitude: 0, 
            rate: 0,  
            ratings: 100,  
            imageUrls: '',  
            available: true,  
            id: '1'
        });
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        const rentRecord = await RentRepo.findOpen(bike.id, user.email)
        expect(rentRecord).not.toBeNull();
        expect(bike.available).toBeFalsy();
    })

    it('should throw unavailable bike when trying to rent with an unavailable bike', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id: '1' });
        await app.registerUser(user)
        const bike = await BikeRepo.add({ 
            name: 'Caloi', 
            type: 'mountain', 
            bodySize: 42, 
            maxLoad: 322, 
            description: '', 
            latitude: 0, 
            longitude: 0, 
            rate: 0,  
            ratings: 100,  
            imageUrls: '',  
            available: true,  
            id: '1'
        });
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        await expect(app.rentBike(bike.id, user.email))
            .rejects.toThrow(UnavailableBikeError)
    })

    it('should throw user not found error when user is not found', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        await expect(app.findUser('fake@mail.com'))
            .rejects.toThrow(UserNotFoundError)
    })

    it('should correctly authenticate user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id: '1' });
        await app.registerUser(user)
        await expect(app.authenticate('jose@mail.com', '1234'))
            .resolves.toBeTruthy()
    })

    it('should throw duplicate user error when trying to register a duplicate user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id: '1' });
        await app.registerUser(user)
        await expect(app.registerUser(user)).rejects.toThrow(DuplicateUserError)
    })

    it('should correctly remove registered user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id : '1' });
        await app.registerUser(user)
        await app.removeUser(user.email)
        await expect(app.findUser(user.email))
            .rejects.toThrow(UserNotFoundError)
    })

    it ('should throw user not found error when trying to remove an unregistered user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        await expect(app.removeUser('fake@mail.com'))
            .rejects.toThrow(UserNotFoundError)
    })

    it ('should correctly register user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id : '1' });
        await app.registerUser(user)
        await expect(app.findUser(user.email))
            .resolves.toEqual(user)
    })

    it ('should not remove user with open rents', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id : '1' });
        await app.registerUser(user)
        const bike = await BikeRepo.add({ 
            name: 'Caloi', 
            type: 'mountain', 
            bodySize: 42, 
            maxLoad: 322, 
            description: '', 
            latitude: 0, 
            longitude: 0, 
            rate: 0,  
            ratings: 100,  
            imageUrls: '',  
            available: true, 
            id: '1' 
        });
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        await expect(app.removeUser(user.email))
            .rejects.toThrow(UserHasOpenRentError)
    })

    it ('should correctly list the bikes rented by an user', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id : '1' });
        await app.registerUser(user)
        const bike = await BikeRepo.add({ 
            name: 'Caloi', 
            type: 'mountain', 
            bodySize: 42, 
            maxLoad: 322, 
            description: '', 
            latitude: 0, 
            longitude: 0, 
            rate: 0,  
            ratings: 100,  
            imageUrls: '',  
            available: true,  
            id: '1'
        });
        await app.registerBike(bike)
        await app.rentBike(bike.id, user.email)
        const bikes = await RentRepo.findOpenFor(user.id)
        expect(bikes).toHaveLength(1)
        expect(bikes[0]).toEqual(bike)
    })

    it ('should correctly register rent for different users', async () => {
        const app = new App(UserRepo, BikeRepo, RentRepo);
        const user1 = await UserRepo.add({ name: 'Jose', email: '', password: '1234', id : '1' });
        const user2 = await UserRepo.add({ name: 'Maria', email: '', password: '1234', id : '2' });
        await app.registerUser(user1)
        await app.registerUser(user2)
        const bike = await BikeRepo.add({ 
            name: 'Caloi', 
            type: 'mountain', 
            bodySize: 42, 
            maxLoad: 322, 
            description: '', 
            latitude: 0, 
            longitude: 0, 
            rate: 0,  
            ratings: 100,  
            imageUrls: '',  
            available: true,  
            id: '1'
        });
        await app.registerBike(bike)
        await app.rentBike(bike.id, user1.email)
        await app.rentBike(bike.id, user2.email)
        const rents = await RentRepo.findOpenFor(user1.id)
        expect(rents).toHaveLength(1)
        expect(rents[0]).toEqual(bike)
    })

})