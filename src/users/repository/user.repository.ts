import { Repository } from "typeorm";
import { User } from "../entity/user.entity";

export interface UserRepository extends Repository<User> {
    this: Repository<User>;

    findByEmail(email: string): Promise<User>;

    findByUserId(userId: number): Promise<User>;
}

export const customUserRepositoryMethods = <UserRepository>{
    async findByEmail(email: string): Promise<User> {
        return this.findOneBy({ email: email });
    },

    async findByUserId(userId: number): Promise<User> {
        return this.findOneBy({ userId: userId });
    }
};

