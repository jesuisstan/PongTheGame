import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

export class FsExceptionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.code === 'ENOENT') {
          throw new NotFoundException('Not found', {
            cause: error,
            description: error.code,
          });
        }
        throw error;
      }),
    );
  }
}
