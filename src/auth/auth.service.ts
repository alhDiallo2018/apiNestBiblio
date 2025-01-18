import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsException } from '../common/InvalidCredentialsException';
import { UserService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await user.validatePassword(password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            // Utilisation de l'exception personnalisée
            throw new InvalidCredentialsException();
        }
        const payload = { email: user.email, sub: user._id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
