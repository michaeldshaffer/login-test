import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<HttpEvent<any>> {
        if(!(req.url.endsWith('selfregister') || req.url.endsWith('authenticate'))){
            //TODO: need to ensure that there is a currUser
            const authReq = req.clone({
                setHeaders:{ Authorization: sessionStorage.getItem('currToken')}
            });
            return next.handle(authReq);            
        }
        return next.handle(req);
    }
}
export let requestInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
};