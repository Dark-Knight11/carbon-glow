// Sauce: https://blog.stackademic.com/crafting-a-uniform-response-structure-in-nestjs-a-guide-to-mastering-interceptors-706820b5aa0b
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((res: unknown) => this.responseHandler(res, context)),
        catchError((err: HttpException) =>
          throwError(() => this.errorHandler(err, context)),
        ),
      );
    }
  
    errorHandler(exception: HttpException, context: ExecutionContext) {
      console.log(exception);
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const out = this.createResponse(status, exception);
  
      response.status(status).json(out);
    }
  
    responseHandler(res: any, context: ExecutionContext) {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      return res;
    }
  
    private createResponse(status: number, exception: HttpException): any {
      const out = {
        status,
        message: '',
        error: '',
        stackTrace: '',
        data: {},
      };
  
      const apiResponse = exception['response'];
  
      out.message = apiResponse ? apiResponse.message : exception.message;
      out.error = apiResponse ? apiResponse.error : '';
      out.stackTrace = apiResponse ? apiResponse.stackTrace ?? '' : '';
      out.data = apiResponse
        ? apiResponse.data
          ? apiResponse.data
          : out.data
        : out.data;
  
      return out;
    }
  }