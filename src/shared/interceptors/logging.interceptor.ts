import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;
        console.log(
          `Execution time: ${Date.now() - now}ms, Method: ${method}, URL: ${url}`,
        );
      }),
    );
  }
}
