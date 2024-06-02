import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


  //   const token = localStorage.getItem('token');

  //   console.log(token,'tkn');


  //   if (token) {
  //     const parsedToken = JSON.parse(token);
  //     const cloned = request.clone({
  //       headers: request.headers.set('Authorization', `Bearer ${parsedToken}`)
  //     });
  //     return next.handle(cloned);
  //   } else {
  //     return next.handle(request);
  //   }
  // }

  const token = localStorage.getItem('token');

  if (token) {
    const tokens =JSON.parse(token);
    console.log(tokens,'t')
    const headers = new HttpHeaders({
      'Authorization': `Token ${tokens}`
    });

    console.log(headers)
    const authReq = request.clone({ headers });
    return next.handle(authReq);
  } else {
    return next.handle(request);
  }
  }}

