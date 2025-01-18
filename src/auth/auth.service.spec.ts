import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';

// Mock UserService
const mockUserService = {
  // Add mock methods as required
  findOne: jest.fn().mockResolvedValue({
    id: '123',
    username: 'testuser',
    password: 'hashedpassword',
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService }, // Mock UserService
        JwtService, // Add JwtService if needed, or mock it
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
