import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      if(this.mustIntercept(req.url)){
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone({
          headers: req.headers.set('Authorization', 'Token ' + localStorage.getItem('token'))
        });
        return next.handle(authReq);
      } else {
        return next.handle(req);
      }
      
  }

  private mustIntercept(url : string){
    return url.indexOf('public') === -1;
  }

}