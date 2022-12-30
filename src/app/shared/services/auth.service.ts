import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {BehaviorSubject, lastValueFrom, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from 'rxjs/operators';

export interface IUser {
  email: string;
  avatarUrl?: string
}

const defaultPath = '/';
const defaultUser = {
  email: 'sandra@example.com',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService {
  apiUrl = environment.apiUrl + '/auth';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private _user: IUser | null;

  public currentToken: Observable<string | null>;
  private currentTokenSubject: BehaviorSubject<string | null>;

  public currentUser: Observable<IUser | null>;
  private currentUserSubject: BehaviorSubject<IUser | null>;

  constructor(private router: Router,
              private httpClient: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<string | null>(<string>localStorage.getItem(this.JWT_TOKEN));
    this.currentToken = this.currentTokenSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<IUser | null>(JSON.parse(<string>localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get loggedIn(): boolean {
    let user = this.currentUserValue;
    if(user){
      return true;
    } else {
      return false;
    }
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  public get currentTokenValue(): string | null {
    return this.currentTokenSubject.value;
  }

  public get currentUserValue(): IUser | null {
    return this.currentUserSubject.value;
  }

  async logIn(email: string, password: string) {
    try {
      // Send request
      let response = await lastValueFrom(this.httpClient.post<any>(this.apiUrl + '/login', {email, password}));
      if (response && response.data && response.data.access_token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this._user = response.data.user;
        this.storeJwtToken(response.data.access_token);
        this.setCurrentUser(response.data.user);
        return {
          isOk: true,
          user: this._user
        };
      } else {
        return {
          isOk: false,
          message: "Authentication failed"
        };
      }
    } catch (err:any){
      return {
        isOk: false,
        message: err.error.message
      };
    }
  }

  public setCurrentUser(user: IUser) {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private storeJwtToken(jwt: string) {
    this.currentTokenSubject.next(jwt);
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  async getUser() {
    try {
      // Send request
      return {
        isOk: true,
        data: this.currentUserValue
      };
    }
    catch {
      return {
        isOk: false,
        data: null
      };
    }
  }

  async createAccount(data: any) {
    try {
      // Send request
      let user = await lastValueFrom(this.httpClient.post<any>(this.apiUrl + '/register', data));
      if (user) {
        return {
          isOk: true,
          user: user
        };
      } else {
        return {
          isOk: false,
          message: "Register failed"
        };
      }
    } catch (err:any){
      return {
        isOk: false,
        message: err.error.message
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    };
  }

  async resetPassword(email: string) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  async logOut() {
    this._user = null;
    this.currentTokenSubject.next(null);
    this.currentUserSubject.next(null );
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(['/login-form']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ].includes(route.routeConfig?.path || defaultPath);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
