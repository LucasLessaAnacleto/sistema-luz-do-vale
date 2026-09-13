import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './entitys/usuarios.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserContextInterceptor } from './user-context.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuarios]),
    PassportModule,
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UserContextInterceptor],
  controllers: [AuthController],
  exports: [AuthService, UserContextInterceptor],
})
export class AuthModule {}
