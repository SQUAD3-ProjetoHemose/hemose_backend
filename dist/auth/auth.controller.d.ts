import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
    adminRoute(): {
        message: string;
    };
    medicoRoute(): {
        message: string;
    };
    enfermeiraRoute(): {
        message: string;
    };
    recepcionistaRoute(): {
        message: string;
    };
}
