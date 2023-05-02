import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor() {
    this.logger.error('nique nestjs');
    console.log('JSP');
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    this.logger.log('zzzz');

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      //
      this.logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    response.end();
    // next();
  }
}
