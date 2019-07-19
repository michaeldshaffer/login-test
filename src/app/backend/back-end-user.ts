import { SelfregisterUser } from '../models/selfregister-user';

export class BackEndUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    constructor(id: number, username: string, firstName: string, lastName: string, email: string, password: string ){
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
