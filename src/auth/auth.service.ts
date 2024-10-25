import { DatabaseService } from '@database/database.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { user } from '@drizzle/schema';
import { eq } from 'drizzle-orm';
import { ApiResponse } from 'src/utils/api-response';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) {
    const existingUser = await this.dbService.db.query.user.findFirst({
      columns: {
        id: true,
      },
      where: eq(user.email, dto.email),
    });
    if (existingUser) {
      throw new ForbiddenException('User Already exists please log in');
    }

    const hashedPassword = await argon.hash(dto.password);
    await this.dbService.db.insert(user).values({
      name: dto.name,
      email: dto.email,
      mobile_number: dto.mobile_number,
      password: hashedPassword,
    });

    return new ApiResponse(201, {}, 'User registered successfully');
  }

  async login(dto: LoginDTO) {
    const loggedInUser = await this.dbService.db.query.user.findFirst({
      columns: {
        id: true,
        password: true,
        name: true,
      },
      where: eq(user.email, dto.email),
    });
    if (!loggedInUser) {
      throw new NotFoundException('User not found, Please Sign Up');
    }
    const isPasswordValid = await argon.verify(
      loggedInUser.password,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: loggedInUser.id, name: loggedInUser.name };
    const token = await this.jwtService.signAsync(payload);
    return new ApiResponse(
      200,
      {
        access_token: token,
      },
      'User logged in successfully',
    );
  }
}
