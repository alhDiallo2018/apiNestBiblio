import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';

// Créez un mock pour UserModel
const mockUserModel = {
  create: jest.fn().mockResolvedValue({
    id: '1',
    prenom: 'Test',
    email: 'test@example.com',
    password: 'hashedpassword',
    roles: ['user'],
  }),
  constructor: jest.fn(),
};

describe('UsersController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
