import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from "../services";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService,
              private router: Router,
              private ngxSpinnerService: NgxSpinnerService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentToken = this.authenticationService.currentTokenValue;
    if (currentToken) {
      request = this.addToken(request, currentToken);
    }

    return next.handle(request).pipe(
        catchError( response => {
          this.ngxSpinnerService.hide();
          if(response.status === 401) {
            this.authenticationService.logOut();
          }
          return throwError(() => new Error(response));
        })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
