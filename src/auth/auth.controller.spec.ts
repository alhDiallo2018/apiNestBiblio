import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users/users.service'; // Importer UserService
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mock UserService
const mockUserService = {
  findOne: jest.fn().mockResolvedValue({
    id: '123',
    username: 'testuser',
    password: 'hashedpassword',
  }),
};

// Mock JwtService si nécessaire
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService }, // Mock UserService
        { provide: JwtService, useValue: mockJwtService },   // Mock JwtService
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
