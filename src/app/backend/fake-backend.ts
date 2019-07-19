import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { BackEndUser } from './back-end-user';


@Injectable()
export class FakeBackend implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // array in local storage for registered users
        let users: BackEndUser[] = JSON.parse(localStorage.getItem('users')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                return this.doAuthenticate(request, users);
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                return this.doGetUsers(request, users);
            }

            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // check for auth token in header and return user if valid, this security is implemented server side in a real application
                if (this.validateToken(request.headers.get('authorization'))) {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // register user
            if (request.url.endsWith('/users/selfregister') && request.method === 'POST') {
                return this.doSelfRegister(request, users);
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (this.validateToken(request.headers.get('authorization'))) {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
    private makeToken(user:any):string {
        return 'fake-jwt-token';
    }
    private refreshAToken(token: string):string {
        return 'fake-jwt-token'
    }
    private validateToken(tokenString:string):boolean {
        return tokenString === 'Bearer fake-jwt-token';
    }
    private makeAHeader(token: string):HttpHeaders {
        return new HttpHeaders().set('AuthorIzatioN','Bearer ' + token);
    }
    private doAuthenticate(request: HttpRequest<any>, users: BackEndUser[]): Observable<HttpEvent<any>> {
        // find if any user matches login credentials
        let filteredUsers = users.filter(user => {
            return user.username === request.body.username && user.password === request.body.password;
        });
        if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details 
            let user = filteredUsers[0];
            let header = this.makeAHeader(this.makeToken(user)); 
            let resp = new HttpResponse({ status: 200, body: user, headers: header});
            console.log('FB','authenticated')

            return of(resp);
        } else {
            // else return 400 bad request
            console.log('FB','not authenticated')
            return throwError({ error: { message: 'Username or password is incorrect' } });
        }        
    };
    private doGetUsers(request: HttpRequest<any>, users: BackEndUser[]): Observable<HttpEvent<any>> {
        // check for auth token in header and return users if valid, this security is implemented server side in a real application
        if (this.validateToken(request.headers.get('authorization'))) {
            return of(new HttpResponse({ status: 200, body: users, headers:this.makeAHeader(this.refreshAToken(request.headers.get('authorization')))}));
        } else {
            // return 401 not authorised if token is null or invalid
            console.log("NOPE", request)
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
    };
    private doSelfRegister(request: HttpRequest<any>, users: any[]): Observable<HttpEvent<any>> {
        // get new user object from post body
        let newSelfregisterUser = request.body;

        // validation
        let duplicateUser = users.filter(user => { return user.username === newSelfregisterUser.username; }).length;
        if (duplicateUser) {
            return throwError({ error: { message: 'Username "' + newSelfregisterUser.username + '" is already taken' } });
        }

        // save new user
        users.push(this.makeAUser(newSelfregisterUser, users.length + 1));
        localStorage.setItem('users', JSON.stringify(users));

        // respond 200 OK
        return of(new HttpResponse({ status: 200 }));//no token
    }
    private makeAUser(sru: any, id: number): BackEndUser {
        return new BackEndUser(id, sru.username, sru.firstName, sru.lastName, sru.email, sru.password);
    }
    private doDeleteUser(request: HttpRequest<any>, users: any[], userid: number): Observable<HttpEvent<any>> {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            if (this.validateToken(request.headers.get('authorization'))) {
            // find user by id in users array
            let urlParts = request.url.split('/');
            let id = parseInt(urlParts[urlParts.length - 1]);
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if (user.id === id) {
                    // delete user
                    users.splice(i, 1);
                    localStorage.setItem('users', JSON.stringify(users));
                    break;
                }
            }

            // respond 200 OK
            return of(new HttpResponse({ status: 200, headers:this.makeAHeader(this.refreshAToken(request.headers.get('authorization')))}));
        } else {
            // return 401 not authorised if token is null or invalid
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
    }
}
export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackend,
    multi: true
};
