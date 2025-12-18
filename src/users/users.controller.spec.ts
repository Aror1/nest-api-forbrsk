import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

const mockUser = { user_id: 1, email: 'test@example.com', name: 'Test User' };
const mockUsers = [mockUser];

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue(mockUsers),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(undefined),
  checkDbConnection: jest.fn().mockResolvedValue({ status: 'OK' }),
};

describe('users', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('create a user', async () => {
    const dto: CreateUserDto = { user_login: 'asasdasdasd', user_pass: 'pass' };
    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
  });

  it('find all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockUsers);
  });

  it('find one user', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('update a user', async () => {
    const dto: UpdateUserDto = { user_login: 'Updated Name' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(mockUser);
  });

  it('delete a user', async () => {
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });

  it('check DB connection', async () => {
    const result = await controller.checkDb();
    expect(result).toEqual({ status: 'OK' });
  });
});