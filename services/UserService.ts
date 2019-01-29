import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { User } from '../models/User'
import { Repository } from 'typeorm';

@Service()
export class UserService {
    @InjectRepository(User)
    private userRepository!: Repository<User>

    findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async find(id: number): Promise<User | null> {
        const user = await this.userRepository.findOne(id)
        return user || null
    }

    async save(user: User): Promise<number> {
        const { id } = await this.userRepository.save(user)
        return id
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id)
    }
}