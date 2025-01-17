import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Injectable()
export class JwtAuthGuardWithUserId extends JwtAuthGuard {
    // Override la méthode handleRequest pour inclure l'ID de l'utilisateur
    handleRequest(err, user, info, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user.userId; 
    }
}
