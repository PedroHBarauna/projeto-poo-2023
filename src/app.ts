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
import { FindOptions } from 'sequelize'
import { IUserRepo } from "./interfaces/IUserRepo";
import { IBikeRepo } from "./interfaces/IBikeRepo";
import { IRentRepo } from "./interfaces/IRentRepo";

export class App {
    crypt: Crypt = new Crypt()

    constructor(
        readonly userRepo: IUserRepo,
        readonly bikeRepo: IBikeRepo,
        readonly rentRepo: IRentRepo
    ) {}

    async findUser(email: string): Promise<User> {
        const whereOptions: any = {
            email
        }

        const user = await this.userRepo.find(whereOptions)
        if (!user) throw new UserNotFoundError()
        return user
    }

    async registerUser(user: User): Promise<string> {
        const whereOptions: any = {
            email: user.email
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

    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = await this.findUser(userEmail)
        return await this.crypt.compare(password, user.password)
    }

    async registerBike(bike: Bike): Promise<Bike> {
        return await this.bikeRepo.add(bike)
    }

    async removeUser(email: string): Promise<void> {
        await this.findUser(email)
        if ((await this.rentRepo.findOpenFor(email)).length > 0) {
            throw new UserHasOpenRentError()
        }
        const whereOptions: any = {
            email
        }

        await this.userRepo.remove(whereOptions)
    }
    
    async removeBike(id: string): Promise<void> {
        await this.findBike(id)
        if ((await this.rentRepo.findOpenFor(id)).length > 0) {
            throw new UserHasOpenRentError()
        }
        const whereOptions: any = {
            id
        }

        await this.bikeRepo.remove(whereOptions)
    }

    async rentBike(bikeId: string, userEmail: string): Promise<Rent> {
        const bike = await this.findBike(bikeId)
        if (!bike.available) {
            throw new UnavailableBikeError()
        }
        const user = await this.findUser(userEmail)
        bike.available = false
        const whereOptions = {
            id: bikeId
        }
        await this.bikeRepo.update(bike, whereOptions)
        const newRent = new Rent(bikeId, user.id, new Date(), '1')
        return await this.rentRepo.add(newRent)
    }

    async returnBike(bikeId: string, userId: string): Promise<number> {
        const now = new Date()
        now.setHours(now.getHours() + 3);
        const rent = await this.rentRepo.findOpen(bikeId, userId)
        if (!rent) throw new Error('Rent not found.')
        rent.end = now

        const whereOptions = {
            id: rent.id
        }
        
        await this.rentRepo.update(rent, whereOptions)
        const bike = await this.findBike(rent.bikeId)
        bike.available = true

        const whereOptionsBike = {
            id: bike.id
        }

        await this.bikeRepo.update(bike, whereOptionsBike)
        const hours = diffHours(rent.end, rent.start)
        return hours * bike.rate
    }

    async listUsers(): Promise<User[]> {
        return await this.userRepo.list()
    }

    async listBikes(): Promise<Bike[]> {
        return await this.bikeRepo.list()
    }

    async listRent(): Promise<Rent[]>{
        return await this.rentRepo.list()
    }

    async moveBikeTo(bikeId: string, location: Location) {
        const whereOptions = {
                id: bikeId
            }

        const bike = await this.findBike(bikeId)
        console.log(bike)
        bike.latitude = location.latitude
        bike.longitude = location.longitude
        await this.bikeRepo.update(bike, whereOptions)
    }

    async findBike(bikeId: string): Promise<Bike> {
        const whereOptions = {
            id: bikeId
        }

        const bike = await this.bikeRepo.find(whereOptions)
        if (!bike) throw new BikeNotFoundError()
        return bike
    }
}

function diffHours(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
}