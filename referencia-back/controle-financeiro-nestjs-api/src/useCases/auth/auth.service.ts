import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuarios } from './entitys/usuarios.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuarios)
    private usersRepo: Repository<Usuarios>,
    private jwtService: JwtService,
  ) {}

  async register(login: string, senha: string, nome: string) {
    const hash = await bcrypt.hash(senha, 10);
    const user = this.usersRepo.create({ login, senha: hash, nome });
    await this.usersRepo.save(user);
    return { message: 'Usuário registrado com sucesso' };
  }

  async validateUser(login: string, senha: string): Promise<Usuarios | null> {
    const user = await this.usersRepo.findOne({ where: { login } });
    if (user && (await bcrypt.compare(senha, user.senha))) {
      return user;
    }
    return null;
  }

  async login(login: string, senha: string) {
    const user = await this.validateUser(login, senha);
    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');
    const payload = { username: user.login, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
