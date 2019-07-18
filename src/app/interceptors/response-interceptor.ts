import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<HttpEvent<any>> {
        console.log("ResponseInterceptor")
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                // let camelCaseObject = mapKeys(event.body, (v, k) => camelCase(k));
                // const modEvent = event.clone({ body: camelCaseObject });
                
                // return modEvent;
                //console.log("response:",event.headers.get('Authorization'))
                if(event.status >= 200 && event.status < 300){
                  sessionStorage.setItem('currToken',event.headers.get('Authorization'));
                }
                return event;
              }
            })
          );
    }
}
export let responseInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseInterceptor,
    multi: true
};