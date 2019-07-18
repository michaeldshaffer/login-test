import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackend implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });
                
                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details 
                    let user = filteredUsers[0];
                    
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                    let header = this.makeAHeader(); 
                    console.log(header)
                    let resp = new HttpResponse({ status: 200, body: body, headers: header});
                    console.log('FB','authenticated',resp)

                    return of(resp);
                } else {
                    // else return 400 bad request
                    console.log('FB','not authenticated')
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // check for auth token in header and return users if valid, this security is implemented server side in a real application
                if (this.validateToken(request.headers.get('Authorization'))) {
                    return of(new HttpResponse({ status: 200, body: users, headers:this.makeAHeader()}));
                } else {
                    // return 401 not authorised if token is null or invalid
                    console.log("NOPE", request)
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // check for auth token in header and return user if valid, this security is implemented server side in a real application
                if (this.validateToken(request.headers.get('Authorization'))) {
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
                // get new user object from post body
                let newSelfregisterUser = request.body;

                // validation
                let duplicateUser = users.filter(user => { return user.username === newSelfregisterUser.username; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newSelfregisterUser.username + '" is already taken' } });
                }

                // save new user
                newSelfregisterUser.id = users.length + 1;
                users.push(newSelfregisterUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (this.validateToken(request.headers.get('Authorization'))) {
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
    private makeToken():string {
        return 'fake-jwt-token';
    }
    private validateToken(tokenString:string):boolean {
        return tokenString === 'Bearer fake-jwt-token';
    }
    private makeAHeader():HttpHeaders {
        return new HttpHeaders().set('AuthorIzatioN','Bearer ' + this.makeToken());
    }
}
export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackend,
    multi: true
};
