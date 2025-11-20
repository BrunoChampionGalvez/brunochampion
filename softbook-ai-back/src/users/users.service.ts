import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(userData: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(userData);
        return this.usersRepository.save(newUser);
    }

    async onModuleInit() {
        await this.seedUsers();
    }

    private async seedUsers() {
        const usersToSeed = [
            {
                email: 'testuser@mail.com',
                password: 'Test*1234!',
                role: UserRole.USER,
            },
            {
                email: 'adminuser@mail.com',
                password: 'Test*1234!',
                role: UserRole.ADMIN,
            },
        ];

        for (const userData of usersToSeed) {
            const existingUser = await this.findOne(userData.email);
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await this.create({
                    ...userData,
                    password: hashedPassword,
                });
                console.log(`Seeded user: ${userData.email}`);
            }
        }
    }
}
