import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHashService {
  async hash(password: string) {
    const hashed = await argon2.hash(password);
    return hashed;
  }

  async verify(hash: string, password: string) {
    const matches = await argon2.verify(hash, password);
    return matches;
  }
}
