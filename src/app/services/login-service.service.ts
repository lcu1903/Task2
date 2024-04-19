import { Injectable } from '@angular/core';
import { Login } from '../pages/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginObj: Login = {
    Email: '',
    Password: '',
  };
  constructor() {}
}
