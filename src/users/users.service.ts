import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // hashed
    createUserDto.user_pass = await bcrypt.hash(createUserDto.user_pass, 10)
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByLogin(login: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_login: login })
    if (!user) {
      throw new NotFoundException(`User with login: ${login} not found`);
    }
    return user;
  }

  async findOne(user_id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return user;
  }

  async update(user_id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(user_id, updateUserDto);
    return this.findOne(user_id);
  }

  async remove(user_id: number): Promise<void> {
    const result = await this.usersRepository.delete(user_id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  }

  async checkDbConnection() {
    try {
      await this.usersRepository.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('connection failed:', error);
      return false;
    }
  }
}