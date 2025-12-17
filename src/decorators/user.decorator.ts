import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserEntity }>();
    if (!request.user) {
      return undefined;
    }
    if (data) {
      return request.user?.[data];
    }
    return request.user;
  },
);
