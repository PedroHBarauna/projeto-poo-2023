import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Location } from "./location";
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UnavailableBikeError } from "./errors/unavailable-bike-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { DuplicateUserError } from "./errors/duplicate-user-error";
import { UserHasOpenRentError } from "./errors/user-has-open-rent-error";
import { FindOptions } from "sequelize";
import { IUserRepo } from "./interfaces/IUserRepo";

export class App {
    crypt: Crypt = new Crypt()

    constructor(
        readonly userRepo: IUserRepo,
        // readonly bikeRepo: IBikeRepo,
        // readonly rentRepo: IRentRepo
    ) {}

    async findUser(email: string): Promise<User> {
        const whereOptions: FindOptions = {
            where: {
                email
            }
        }

        const user = await this.userRepo.find(whereOptions)
        if (!user) throw new UserNotFoundError()
        return user
    }

    async registerUser(user: User): Promise<string> {
        const whereOptions: FindOptions = {
            where: {
                email: user.email
            }
        }

        const userFound = await this.userRepo.find(whereOptions)

        if (userFound) {
          throw new DuplicateUserError()
        }
        
        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        const usuarioCriado = await this.userRepo.add(user)

        if(!usuarioCriado) throw new Error('Erro ao criar usuário')

        return usuarioCriado.id
    }

    // async authenticate(userEmail: string, password: string): Promise<boolean> {
    //     const user = await this.findUser(userEmail)
    //     return await this.crypt.compare(password, user.password)
    // }

    // async registerBike(bike: Bike): Promise<string> {
    //     return await this.bikeRepo.add(bike)
    // }

    // async removeUser(email: string): Promise<void> {
    //     await this.findUser(email)
    //     if ((await this.rentRepo.findOpenFor(email)).length > 0) {
    //         throw new UserHasOpenRentError()
    //     }
    //     await this.userRepo.remove(email)
    // }
    
    // async rentBike(bikeId: string, userEmail: string): Promise<string> {
    //     const bike = await this.findBike(bikeId)
    //     if (!bike.available) {
    //         throw new UnavailableBikeError()
    //     }
    //     const user = await this.findUser(userEmail)
    //     bike.available = false
    //     await this.bikeRepo.update(bikeId, bike)
    //     const newRent = new Rent(bike, user, new Date())
    //     return await this.rentRepo.add(newRent)
    // }

    // async returnBike(bikeId: string, userEmail: string): Promise<number> {
    //     const now = new Date()
    //     const rent = await this.rentRepo.findOpen(bikeId, userEmail)
    //     if (!rent) throw new Error('Rent not found.')
    //     rent.end = now
    //     await this.rentRepo.update(rent.id, rent)
    //     rent.bike.available = true
    //     await this.bikeRepo.update(rent.bike.id, rent.bike)
    //     const hours = diffHours(rent.end, rent.start)
    //     return hours * rent.bike.rate
    // }

    // async listUsers(): Promise<User[]> {
    //     return await this.userRepo.list()
    // }

    // async listBikes(): Promise<Bike[]> {
    //     return await this.bikeRepo.list()
    // }

    // async moveBikeTo(bikeId: string, location: Location) {
    //     const bike = await this.findBike(bikeId)
    //     bike.location.latitude = location.latitude
    //     bike.location.longitude = location.longitude
    //     await this.bikeRepo.update(bikeId, bike)
    // }

    // async findBike(bikeId: string): Promise<Bike> {
    //     const bike = await this.bikeRepo.find(bikeId)
    //     if (!bike) throw new BikeNotFoundError()
    //     return bike
    // }
}

function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
}