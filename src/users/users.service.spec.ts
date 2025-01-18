import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './users.service';

const mockUserModel = {
  // Mock Mongoose constructor behavior
  new: jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({
      prenom: dto.prenom,
      email: dto.email,
      password: dto.password,
      roles: dto.roles,
    }),
  })),
  create: jest.fn().mockResolvedValue({
    prenom: 'Test',
    email: 'test@example.com',
    password: 'hashedpassword',
    roles: ['user'],
  }),
  findById: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
  findByIdAndUpdate: jest.fn().mockResolvedValue(null),
  deleteOne: jest.fn().mockResolvedValue(null),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel, // Inject the mock user model
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUserDto = {
      prenom: 'Test',
      email: 'test@example.com',
      password: 'password123',
      roles: ['user'],
    };

    // Mock bcrypt.hash to return a hashed password
    bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

    // Call the method to create the user
    const result = await service.createUser(createUserDto);

    // Assert that the returned result is as expected
    expect(result).toEqual({
      prenom: 'Test',
      email: 'test@example.com',
      password: 'hashedpassword',
      roles: ['user'],
    });

    // Ensure that `create` was called with the correct parameters
    expect(mockUserModel.create).toHaveBeenCalledWith({
      prenom: 'Test',
      email: 'test@example.com',
      password: 'hashedpassword',
      roles: ['user'],
    });
  });
});
