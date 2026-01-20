import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    if (!user) {
      throw new Error('User not found in request context');
    }

    if (filter && !(filter in user)) {
      throw new Error(`Filter '${filter}' does not exist on user object`);
    }

    return filter ? user[filter] : user;
  },
);
