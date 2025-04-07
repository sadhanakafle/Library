import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
//import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/helpers/public'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtServices:JwtService,
              private readonly reflector: Reflector
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
  try{

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY,[
      context.getHandler(),
      context.getClass()
     ]);
     if(isPublic){
      return true;
     }
    const request= context.switchToHttp().getRequest();
    const [type, token]=request.headers.authorization?.split(' ')?? [];

    if(type!=='Bearer' || !token){
      throw new UnauthorizedException();
    }
    const payload =await this.jwtServices.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    request ['payload']=payload;
    return true;
  }catch(err){
    throw new UnauthorizedException(err);
     }
    }
  }

