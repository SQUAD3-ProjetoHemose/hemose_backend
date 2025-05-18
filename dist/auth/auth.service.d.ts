import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, senha: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        success: boolean;
        access_token: string;
        user: {
            id: any;
            nome: any;
            email: any;
            tipo: any;
        };
        message?: undefined;
    }>;
}
