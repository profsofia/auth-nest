import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private authServ : AuthService) {}

  //si la respuesta es true, lo deja pasar.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('no hay token en la petición');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        //nuestra variable de entorno
        /**
         * si fue creado con una semilla diferente, ---< falla
         * si no coincide, ---< falla
         * si no puede extraer el payload --< falla
         */
        secret: process.env.JWT_SEED,
      });
      //obtenemos que usuario es
      const user = await this.authServ.findUserById(payload.id);
      if (!user) throw new UnauthorizedException ("user does not exists");
      if (!user.isActive) throw new UnauthorizedException ("user is not active");
      request['user'] = user ;
    } catch {
      throw new UnauthorizedException('No es un token valido');
    }
    return Promise.resolve(true);
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
