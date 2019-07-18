import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              if(event.status >= 200 && event.status < 300){
                sessionStorage.setItem('currToken',this.getAuthHeader(event.headers));
              }
              return event;
            }
          })
        );
  }
  getAuthHeader(hdrs:any): string {
    return hdrs.get('authorization')
  }
}
export let responseInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseInterceptor,
    multi: true
};